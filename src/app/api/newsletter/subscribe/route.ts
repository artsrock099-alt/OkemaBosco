import { NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations';
import { subscribeToNewsletter } from '@/lib/newsletter/subscribers';
import { clientIp, rateLimit, tooManyRequests } from '@/lib/rate-limit';

/**
 * Public newsletter signup.
 *
 * The subscriber is written to PostgreSQL first, which is the source of truth.
 * Admin notification, welcome email and Resend synchronisation all happen
 * afterwards and cannot lose the signup if they fail.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);

  const limit = rateLimit(`newsletter:${ip}`, 8, 60 * 10);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

  try {
    const body = await request.json().catch(() => ({}));

    // Honeypot: real visitors never see this field.
    if (typeof body?._honey === 'string' && body._honey.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Subscribed successfully.' });
    }

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const source =
      typeof body?.source === 'string' && body.source.trim()
        ? body.source.trim().slice(0, 60)
        : 'website';

    const outcome = await subscribeToNewsletter({
      email: parsed.data.email,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      source,
    });

    if (outcome.state === 'already-subscribed') {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: outcome.pending
          ? 'You are on the list. Please confirm using the link we emailed you.'
          : 'You are already subscribed. Thank you!',
      });
    }

    if (outcome.pending) {
      return NextResponse.json({
        success: true,
        pending: true,
        message: 'Almost there. Please check your inbox and click the confirmation link.',
      });
    }

    return NextResponse.json({
      success: true,
      message:
        outcome.state === 'reactivated'
          ? 'Welcome back. You are subscribed again.'
          : 'Subscribed successfully. Thank you!',
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { message: 'Subscription failed. Please try again.' },
      { status: 500 }
    );
  }
}
