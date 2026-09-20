import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { contactSchema } from '@/lib/validations';
import { createAuditLog } from '@/lib/audit';
import { notify } from '@/lib/notifications';
import {
  sendContactAdminNotification,
  sendContactConfirmation,
} from '@/lib/email/notifications';
import { clientIp, rateLimit, tooManyRequests, userAgent } from '@/lib/rate-limit';

/**
 * Public contact form endpoint. The message is stored first, then the
 * notifications and emails are attempted, so a mail outage never loses a
 * message.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);

  const limit = rateLimit(`contact:${ip}`, 5, 60 * 10);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

  try {
    const body = await request.json();

    if (typeof body?._honey === 'string' && body._honey.trim() !== '') {
      return NextResponse.json({ success: true, messageId: 'ignored' });
    }

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.create({
      data: { ...parsed.data, status: 'NEW', isRead: false },
    });

    await createAuditLog(
      'CONTACT_RECEIVED',
      'CONTACT_MESSAGE',
      message.id,
      undefined,
      { email: message.email, subject: message.subject },
      ip,
      userAgent(request)
    );

    await notify({
      type: 'CONTACT',
      title: 'New contact message',
      message: `${message.name} - ${message.subject}`,
      entityType: 'ContactMessage',
      entityId: message.id,
      link: `/admin/messages/${message.id}`,
      sendEmailNotification: () => sendContactAdminNotification(message),
    });

    // Visitor acknowledgement. Never blocks the stored message.
    await sendContactConfirmation(message).catch((error) =>
      console.error('Contact confirmation email failed:', error)
    );

    return NextResponse.json({
      success: true,
      messageId: message.id,
    });
  } catch (error) {
    console.error('Contact message error:', error);
    return NextResponse.json(
      { message: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
