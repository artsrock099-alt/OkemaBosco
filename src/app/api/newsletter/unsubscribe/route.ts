import { NextResponse } from 'next/server';
import { unsubscribeSubscriberByToken } from '@/lib/newsletter/subscribers';
import { env } from '@/lib/env';

/**
 * Unsubscribe endpoint.
 *
 * POST performs the unsubscribe. This is the endpoint advertised in the
 * List-Unsubscribe header, so supporting mail clients can unsubscribe a
 * recipient in one click (RFC 8058).
 *
 * GET deliberately changes nothing and simply sends the visitor to a page
 * with a button: link scanners and email previews fetch URLs automatically and
 * must never unsubscribe somebody by accident.
 */
export async function POST(request: Request) {
  const token =
    new URL(request.url).searchParams.get('token') ||
    (await request
      .json()
      .then((body: any) => String(body?.token || ''))
      .catch(() => ''));

  if (!token) {
    return NextResponse.json({ message: 'Missing token.' }, { status: 400 });
  }

  const subscriber = await unsubscribeSubscriberByToken(token);
  if (!subscriber) {
    return NextResponse.json({ message: 'This unsubscribe link is not valid.' }, { status: 400 });
  }

  return NextResponse.json({ success: true, email: subscriber.email });
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') || '';
  const target = new URL('/newsletter/unsubscribed', env.appUrl());
  if (token) target.searchParams.set('token', token);
  return NextResponse.redirect(target, { status: 302 });
}
