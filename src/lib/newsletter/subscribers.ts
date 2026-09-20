/**
 * Newsletter signup logic shared by the public form and the admin.
 *
 * PostgreSQL is the source of truth. Resend synchronisation is best effort:
 * if it fails the subscriber is still saved and the failure is logged, so a
 * third-party outage can never lose a subscriber.
 */
import { prisma } from '../db';
import { env } from '../env';
import { syncResendContact } from '../email/resend';
import {
  sendNewsletterAdminNotification,
  sendNewsletterWelcome,
} from '../email/notifications';
import { notify } from '../notifications';
import { signToken } from '../tokens';
import { generateOpaqueToken } from '../tokens';

export type SubscribeOutcome =
  | { state: 'created'; alreadySubscribed: false; pending: boolean; subscriberId: string }
  | { state: 'reactivated'; alreadySubscribed: false; pending: boolean; subscriberId: string }
  | { state: 'already-subscribed'; alreadySubscribed: true; pending: boolean; subscriberId: string };

export type SubscribeInput = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  /** Where the signup came from, e.g. "footer", "newsletter-section", "admin". */
  source?: string | null;
};

function normalise(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Unsubscribe link for a subscriber. Prefers the stored opaque token and
 * falls back to a signed one, so links keep working for older rows.
 */
export function unsubscribeUrlFor(subscriber: {
  id: string;
  email: string;
  unsubscribeToken?: string | null;
}): string {
  const base = env.appUrl();
  if (subscriber.unsubscribeToken) {
    return `${base}/newsletter/unsubscribed?token=${encodeURIComponent(subscriber.unsubscribeToken)}`;
  }
  const token = signToken(
    { purpose: 'unsubscribe', sub: subscriber.id, data: { email: subscriber.email } },
    60 * 60 * 24 * 365
  );
  return `${base}/newsletter/unsubscribed?token=${encodeURIComponent(token)}`;
}

/** The route that performs the unsubscribe; embedded in campaign emails. */
export function unsubscribeApiUrlFor(subscriber: {
  id: string;
  email: string;
  unsubscribeToken?: string | null;
}): string {
  const base = env.appUrl();
  if (subscriber.unsubscribeToken) {
    return `${base}/api/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribeToken)}`;
  }
  const token = signToken(
    { purpose: 'unsubscribe', sub: subscriber.id, data: { email: subscriber.email } },
    60 * 60 * 24 * 365
  );
  return `${base}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

export async function subscribeToNewsletter(input: SubscribeInput): Promise<SubscribeOutcome> {
  const email = normalise(input.email);
  const doubleOptIn = env.newsletterDoubleOptIn();
  const targetStatus = doubleOptIn ? 'PENDING' : 'ACTIVE';

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

  let subscriber: { id: string; email: string; status: string; unsubscribeToken: string | null };
  let outcome: SubscribeOutcome['state'];

  if (existing) {
    if (existing.status === 'ACTIVE' || existing.status === 'PENDING') {
      // Already on the list: touch nothing, just tell the form the good news.
      await prisma.newsletterSubscriber
        .update({
          where: { id: existing.id },
          data: {
            unsubscribeToken: existing.unsubscribeToken ?? generateOpaqueToken(),
            firstName: existing.firstName ?? input.firstName ?? null,
            lastName: existing.lastName ?? input.lastName ?? null,
          },
        })
        .catch(() => undefined);

      return {
        state: 'already-subscribed',
        alreadySubscribed: true,
        pending: existing.status === 'PENDING',
        subscriberId: existing.id,
      };
    }

    // Previously unsubscribed or bounced: reactivate only on a fresh signup.
    const updated = await prisma.newsletterSubscriber.update({
      where: { id: existing.id },
      data: {
        status: targetStatus,
        isActive: true,
        unsubscribedAt: null,
        confirmedAt: doubleOptIn ? null : new Date(),
        firstName: input.firstName ?? existing.firstName ?? null,
        lastName: input.lastName ?? existing.lastName ?? null,
        source: input.source ?? existing.source ?? null,
        unsubscribeToken: existing.unsubscribeToken ?? generateOpaqueToken(),
      },
      select: { id: true, email: true, status: true, unsubscribeToken: true },
    });
    subscriber = updated;
    outcome = 'reactivated';
  } else {
    const created = await prisma.newsletterSubscriber.create({
      data: {
        email,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        status: targetStatus,
        isActive: true,
        source: input.source ?? null,
        confirmedAt: doubleOptIn ? null : new Date(),
        unsubscribeToken: generateOpaqueToken(),
      },
      select: { id: true, email: true, status: true, unsubscribeToken: true },
    });
    subscriber = created;
    outcome = 'created';
  }

  const fullName = [input.firstName, input.lastName].filter(Boolean).join(' ');

  // 1. Dashboard notification + admin email.
  await notify({
    type: 'NEWSLETTER',
    title: 'New newsletter subscriber',
    message: fullName ? `${fullName} - ${email}` : email,
    entityType: 'NewsletterSubscriber',
    entityId: subscriber.id,
    link: `/admin/newsletter/subscribers?q=${encodeURIComponent(email)}`,
    sendEmailNotification: () =>
      sendNewsletterAdminNotification({
        id: subscriber.id,
        email,
        firstName: input.firstName,
        lastName: input.lastName,
        source: input.source,
        status: subscriber.status,
      }),
  });

  // 2. Welcome (or confirmation) email to the visitor.
  const confirmUrl = doubleOptIn
    ? `${env.appUrl()}/api/newsletter/confirm?token=${encodeURIComponent(
        signToken(
          { purpose: 'confirm-subscription', sub: subscriber.id, data: { email } },
          60 * 60 * 24 * 7
        )
      )}`
    : null;

  await sendNewsletterWelcome(
    {
      id: subscriber.id,
      email,
      firstName: input.firstName,
      lastName: input.lastName,
      source: input.source,
      status: subscriber.status,
    },
    { confirmUrl }
  ).catch((error) => console.error('Welcome email failed:', error));

  // 3. Mirror into Resend, best effort. The database already has the truth.
  syncResendContact({
    email,
    firstName: input.firstName,
    lastName: input.lastName,
    unsubscribed: false,
  })
    .then((result) => {
      if (!result.ok && env.resendAudienceId()) {
        console.warn(`Resend contact sync failed for ${email}:`, result.error);
      }
    })
    .catch(() => undefined);

  return {
    state: outcome,
    alreadySubscribed: false,
    pending: targetStatus === 'PENDING',
    subscriberId: subscriber.id,
  } as SubscribeOutcome;
}

/** Mark a subscriber as unsubscribed. Idempotent. */
export async function unsubscribeSubscriberByToken(token: string) {
  const byOpaque = await prisma.newsletterSubscriber.findUnique({
    where: { unsubscribeToken: token },
    select: { id: true, email: true, status: true },
  });

  let target = byOpaque;

  if (!target) {
    const { verifyToken } = await import('../tokens');
    const payload = verifyToken(token, 'unsubscribe');
    if (!payload) return null;
    target = await prisma.newsletterSubscriber.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, status: true },
    });
  }

  if (!target) return null;

  if (target.status !== 'UNSUBSCRIBED') {
    await prisma.newsletterSubscriber.update({
      where: { id: target.id },
      data: { status: 'UNSUBSCRIBED', isActive: false, unsubscribedAt: new Date() },
    });
  }

  syncResendContact({ email: target.email, unsubscribed: true }).catch(() => undefined);

  return target;
}
