import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/tokens';
import { syncResendContact } from '@/lib/email/resend';
import { env } from '@/lib/env';

/**
 * Double opt-in confirmation. Reached from the confirmation email and only
 * when NEWSLETTER_DOUBLE_OPT_IN is enabled.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') || '';
  const appUrl = env.appUrl();

  const success = (query: string) =>
    NextResponse.redirect(new URL(`/newsletter/confirm?${query}`, appUrl), { status: 302 });

  if (!token) return success('state=missing');

  const payload = verifyToken(token, 'confirm-subscription');
  if (!payload) return success('state=invalid');

  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, status: true, firstName: true, lastName: true },
  });

  if (!subscriber) return success('state=invalid');

  if (subscriber.status === 'ACTIVE') {
    return success('state=already');
  }

  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: { status: 'ACTIVE', isActive: true, confirmedAt: new Date(), unsubscribedAt: null },
  });

  syncResendContact({
    email: subscriber.email,
    firstName: subscriber.firstName,
    lastName: subscriber.lastName,
    unsubscribed: false,
  }).catch(() => undefined);

  return success('state=confirmed');
}
