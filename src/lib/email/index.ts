/**
 * The single place emails leave the application from.
 *
 * Guarantees:
 *  - never throws, so a mail provider outage cannot break a booking, a
 *    contact message or a newsletter signup;
 *  - every attempt is written to EmailLog first, so failures are visible in
 *    the admin and can be retried;
 *  - `dedupeKey` makes a send idempotent, so retried operations do not send
 *    the same notification twice.
 */
import { prisma } from '../db';
import { isEmailConfigured } from '../env';
import { sendViaResend } from './resend';
import { htmlToText } from './templates';
import type { EmailType, SendEmailInput, SendEmailResult } from './types';

export type { EmailType, SendEmailInput, SendEmailResult } from './types';
export { EMAIL_TYPES } from './types';

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const to = (input.to || '').trim();
  if (!to) return { ok: false, error: 'No recipient address' };

  const text = input.text || htmlToText(input.html);

  // Idempotency: if this exact email was already logged, do not send again.
  if (input.dedupeKey) {
    try {
      const existing = await prisma.emailLog.findUnique({
        where: { dedupeKey: input.dedupeKey },
        select: { id: true, status: true, providerMessageId: true },
      });
      if (existing && existing.status !== 'FAILED') {
        return {
          ok: true,
          skipped: true,
          logId: existing.id,
          providerMessageId: existing.providerMessageId ?? undefined,
        };
      }
    } catch (error) {
      console.error('Email idempotency check failed:', error);
    }
  }

  // Record the attempt before handing it to the provider.
  let logId: string | undefined;
  try {
    const log = await prisma.emailLog.create({
      data: {
        provider: 'resend',
        recipient: to,
        subject: input.subject,
        type: input.type as EmailType,
        status: 'QUEUED',
        dedupeKey: input.dedupeKey ?? null,
        campaignId: input.campaignId ?? null,
        bookingId: input.bookingId ?? null,
        contactMessageId: input.contactMessageId ?? null,
        subscriberId: input.subscriberId ?? null,
        metadata: (input.metadata ?? {}) as object,
      },
      select: { id: true },
    });
    logId = log.id;
  } catch (error) {
    console.error('Could not write email log:', error);
  }

  if (!isEmailConfigured()) {
    const error = 'Email is not configured (RESEND_API_KEY / EMAIL_FROM)';
    if (logId) {
      await prisma.emailLog
        .update({
          where: { id: logId },
          data: { status: 'FAILED', error, failedAt: new Date() },
        })
        .catch(() => undefined);
    }
    return { ok: false, error, logId };
  }

  const result = await sendViaResend({
    to,
    subject: input.subject,
    html: input.html,
    text,
    replyTo: input.replyTo,
    fromName: input.fromName,
    tags: [{ name: 'type', value: input.type }],
  });

  if (!result.ok) {
    if (logId) {
      await prisma.emailLog
        .update({
          where: { id: logId },
          data: { status: 'FAILED', error: result.error, failedAt: new Date() },
        })
        .catch(() => undefined);
    }
    console.error(`Email "${input.type}" to ${to} failed:`, result.error);
    return { ok: false, error: result.error, logId };
  }

  const messageId = result.data?.id ? String(result.data.id) : undefined;

  if (logId) {
    await prisma.emailLog
      .update({
        where: { id: logId },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          providerMessageId: messageId ?? null,
        },
      })
      .catch((error) => console.error('Could not update email log:', unknownMessage(error)));
  }

  return { ok: true, logId, providerMessageId: messageId };
}

function unknownMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
