/**
 * Thin Resend client.
 *
 * Uses the REST API directly with `fetch` so there is no SDK dependency, and
 * every function returns a result object instead of throwing: a mail provider
 * outage must never break booking, contact or newsletter flows.
 *
 * Server-side only. RESEND_API_KEY is never sent to the browser.
 */
import { env, fromAddress } from '../env';

const API = 'https://api.resend.com';
const TIMEOUT_MS = 15_000;

export type ResendResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function call<T>(
  path: string,
  init: { method: 'GET' | 'POST' | 'PATCH' | 'DELETE'; body?: unknown }
): Promise<ResendResult<T>> {
  const key = env.resendApiKey();
  if (!key) return { ok: false, error: 'RESEND_API_KEY is not configured' };

  try {
    const response = await fetch(`${API}${path}`, {
      method: init.method,
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const payload = (await response.json().catch(() => null)) as any;

    if (!response.ok) {
      const message =
        payload?.message || payload?.error?.message || `Resend responded with ${response.status}`;
      return { ok: false, error: String(message) };
    }
    return { ok: true, data: payload as T };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    return { ok: false, error: message };
  }
}

export type OutgoingEmail = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string | null;
  fromName?: string | null;
  headers?: Record<string, string>;
  tags?: { name: string; value: string }[];
};

/** Send one email. Returns the provider message id on success. */
export async function sendViaResend(
  email: OutgoingEmail
): Promise<ResendResult<{ id: string }>> {
  const from = fromAddress(email.fromName);
  if (!from) return { ok: false, error: 'EMAIL_FROM is not configured' };

  return call<{ id: string }>('/emails', {
    method: 'POST',
    body: {
      from,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      ...(email.text ? { text: email.text } : {}),
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      ...(email.headers ? { headers: email.headers } : {}),
      ...(email.tags?.length ? { tags: email.tags } : {}),
    },
  });
}

/**
 * Mirror a subscriber into a Resend audience, kept best-effort: PostgreSQL is
 * the source of truth, so a failure here is logged and retried later rather
 * than blocking the signup.
 */
export async function syncResendContact(input: {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  unsubscribed?: boolean;
}): Promise<ResendResult<unknown>> {
  const audienceId = env.resendAudienceId();
  if (!audienceId) return { ok: false, error: 'RESEND_AUDIENCE_ID is not configured' };

  return call(`/audiences/${audienceId}/contacts`, {
    method: 'POST',
    body: {
      email: input.email,
      first_name: input.firstName || undefined,
      last_name: input.lastName || undefined,
      unsubscribed: Boolean(input.unsubscribed),
    },
  });
}

export async function removeResendContact(email: string): Promise<ResendResult<unknown>> {
  const audienceId = env.resendAudienceId();
  if (!audienceId) return { ok: false, error: 'RESEND_AUDIENCE_ID is not configured' };

  return call(`/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`, {
    method: 'DELETE',
  });
}

/** Reachability probe used by the admin Email settings screen. */
export async function checkResendConnection(): Promise<ResendResult<{ data?: unknown[] }>> {
  return call<{ data?: unknown[] }>('/domains', { method: 'GET' });
}
