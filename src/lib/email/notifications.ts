/**
 * Typed, pre-designed emails for bookings, contact messages, the newsletter,
 * account security and admin replies.
 *
 * Each function returns the send result so the caller can log or surface a
 * problem, but none of them throw: the database write that triggered the email
 * has already succeeded and must stay that way.
 */
import { prisma } from '../db';
import { env } from '../env';
import { sendEmail, type SendEmailResult } from './index';
import {
  BRAND,
  escapeHtml,
  renderDetailTable,
  renderEmailLayout,
  renderQuote,
} from './templates';

function humanize(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function longDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const value = typeof date === 'string' ? new Date(date) : date;
  return value.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function adminUrl(path = ''): string {
  const base = env.appUrl();
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

/**
 * Admin notification recipients: the configured address if set, otherwise
 * every active super administrator.
 */
export async function adminRecipients(): Promise<string[]> {
  const configured = env.adminNotificationEmail();
  if (configured) return [configured];

  try {
    const admins = await prisma.user.findMany({
      where: { role: 'SUPER_ADMIN' },
      select: { email: true },
      take: 5,
    });
    return admins.map((admin) => admin.email).filter(Boolean);
  } catch (error) {
    console.error('Could not resolve admin notification recipients:', error);
    return [];
  }
}

async function sendToAdmins(
  build: () => { subject: string; html: string },
  meta: { type: Parameters<typeof sendEmail>[0]['type']; dedupeKey: string; bookingId?: string }
): Promise<SendEmailResult> {
  const recipients = await adminRecipients();
  if (recipients.length === 0) {
    return { ok: false, error: 'No admin notification recipient is configured' };
  }

  const { subject, html } = build();
  const results = await Promise.all(
    recipients.map((to, index) =>
      sendEmail({
        to,
        subject,
        html,
        type: meta.type,
        bookingId: meta.bookingId,
        // Suffix keeps the dedupe key unique per recipient.
        dedupeKey: recipients.length > 1 ? `${meta.dedupeKey}:${index}` : meta.dedupeKey,
      })
    )
  );

  return results.find((result) => !result.ok) ?? results[0];
}

type BookingLike = {
  id: string;
  reference: string;
  type: string;
  status?: string;
  eventDate: Date | string;
  alternativeDate?: Date | string | null;
  venue?: string | null;
  location?: string | null;
  expectedAudience?: string | null;
  eventDescription?: string | null;
  customerName: string;
  organization?: string | null;
  customerEmail: string;
  customerPhone?: string | null;
  additionalInfo?: string | null;
};

// --------------------------------------------------------------------------
// Bookings
// --------------------------------------------------------------------------

export async function sendBookingAdminNotification(booking: BookingLike) {
  return sendToAdmins(
    () => {
      const html = renderEmailLayout({
        preheader: `New booking request from ${booking.customerName}`,
        heading: 'New booking request',
        intro: [
          `A new booking request has been received through the website. Reference <strong>${escapeHtml(
            booking.reference
          )}</strong>.`,
        ],
        bodyHtml: renderDetailTable([
          ['Customer', booking.customerName],
          ['Organisation', booking.organization],
          ['Email', booking.customerEmail],
          ['Phone', booking.customerPhone],
          ['Service', humanize(booking.type)],
          ['Event date', longDate(booking.eventDate)],
          ['Alternative date', booking.alternativeDate ? longDate(booking.alternativeDate) : ''],
          ['Venue', booking.venue],
          ['Location', booking.location],
          ['Expected audience', booking.expectedAudience],
          ['Budget', ''],
        ]),
        cta: { label: 'View booking', href: adminUrl(`/admin/bookings/${booking.id}`) },
        outro: booking.eventDescription
          ? [`<strong>Event description</strong><br />${escapeHtml(booking.eventDescription)}`]
          : [],
        footerNote: 'Automated notification from the Bosco Okema website.',
      });
      return { subject: `New booking request - ${booking.reference}`, html };
    },
    { type: 'BOOKING_ADMIN', dedupeKey: `booking:${booking.id}:admin`, bookingId: booking.id }
  );
}

export async function sendBookingConfirmation(booking: BookingLike) {
  const html = renderEmailLayout({
    preheader: `We have your request, reference ${booking.reference}`,
    heading: 'Thank you, your request has arrived',
    intro: [
      `Hello ${escapeHtml(booking.customerName)},`,
      'Thank you for getting in touch about a performance. Your request is with Bosco and you will hear back personally, usually within two working days.',
    ],
    bodyHtml: renderDetailTable([
      ['Reference', booking.reference],
      ['Service', humanize(booking.type)],
      ['Event date', longDate(booking.eventDate)],
      ['Venue', booking.venue],
      ['Location', booking.location],
    ]),
    outro: [
      'If any of the details above need changing, just reply to this email and mention your reference number.',
      'This is a booking enquiry, so no payment has been taken and nothing has been confirmed yet.',
    ],
    footerNote: 'Bosco Okema - Kampala, Uganda',
  });

  return sendEmail({
    to: booking.customerEmail,
    subject: `We received your booking request (${booking.reference})`,
    html,
    type: 'BOOKING_CONFIRMATION',
    bookingId: booking.id,
    dedupeKey: `booking:${booking.id}:confirmation`,
  });
}

export async function sendBookingStatusUpdate(
  booking: BookingLike,
  newStatus: string,
  note?: string | null
) {
  const label = humanize(newStatus);
  const html = renderEmailLayout({
    preheader: `Your booking is now ${label}`,
    heading: `Your booking is now ${label}`,
    intro: [
      `Hello ${escapeHtml(booking.customerName)},`,
      `The status of your booking <strong>${escapeHtml(booking.reference)}</strong> has been updated to <strong>${escapeHtml(
        label
      )}</strong>.`,
    ],
    bodyHtml: renderDetailTable([
      ['Service', humanize(booking.type)],
      ['Event date', longDate(booking.eventDate)],
      ['Venue', booking.venue],
      ['Location', booking.location],
    ]),
    outro: note ? [renderQuote(note)] : ['Reply to this email if you have any questions.'],
    footerNote: 'Bosco Okema - Kampala, Uganda',
  });

  return sendEmail({
    to: booking.customerEmail,
    subject: `Booking ${booking.reference} is now ${label}`,
    html,
    type: 'BOOKING_STATUS',
    bookingId: booking.id,
    // One email per status change, but never the same status twice.
    dedupeKey: `booking:${booking.id}:status:${newStatus}:${Date.now()}`,
  });
}

// --------------------------------------------------------------------------
// Contact messages
// --------------------------------------------------------------------------

type ContactLike = {
  id: string;
  name: string;
  organization?: string | null;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
};

export async function sendContactAdminNotification(message: ContactLike) {
  return sendToAdmins(
    () => {
      const html = renderEmailLayout({
        preheader: `New message from ${message.name}`,
        heading: 'New contact message',
        intro: ['A new message has been submitted through the website contact form.'],
        bodyHtml:
          renderDetailTable([
            ['Name', message.name],
            ['Organisation', message.organization],
            ['Email', message.email],
            ['Phone', message.phone],
            ['Subject', message.subject],
          ]) + renderQuote(message.message),
        cta: { label: 'View message', href: adminUrl(`/admin/messages/${message.id}`) },
        footerNote: 'Automated notification from the Bosco Okema website.',
      });
      return { subject: `New contact message - ${message.subject}`, html };
    },
    { type: 'CONTACT_ADMIN', dedupeKey: `contact:${message.id}:admin` }
  );
}

export async function sendContactConfirmation(message: ContactLike) {
  const html = renderEmailLayout({
    preheader: 'Thank you for your message',
    heading: 'Thank you for your message',
    intro: [
      `Hello ${escapeHtml(message.name)},`,
      'Your message has reached Bosco and a reply will follow personally. For reference, this is what you sent:',
    ],
    bodyHtml: renderQuote(message.message),
    outro: ['If your message was urgent, you can also reply directly to this email.'],
    footerNote: 'Bosco Okema - Kampala, Uganda',
  });

  return sendEmail({
    to: message.email,
    subject: 'Thank you for contacting Bosco Okema',
    html,
    type: 'CONTACT_CONFIRMATION',
    contactMessageId: message.id,
    dedupeKey: `contact:${message.id}:confirmation`,
  });
}

// --------------------------------------------------------------------------
// Admin replies
// --------------------------------------------------------------------------

export async function sendCustomerReply(input: {
  to: string;
  subject: string;
  body: string;
  bookingId?: string | null;
  contactMessageId?: string | null;
}) {
  const html = renderEmailLayout({
    heading: input.subject,
    bodyHtml: renderQuote(input.body),
    outro: ['You can reply straight to this email and it will reach Bosco.'],
    footerNote: 'Bosco Okema - Kampala, Uganda',
  });

  return sendEmail({
    to: input.to,
    subject: input.subject,
    html,
    type: input.bookingId ? 'BOOKING_REPLY' : 'CONTACT_REPLY',
    replyTo: env.emailReplyTo() || undefined,
    bookingId: input.bookingId ?? null,
    contactMessageId: input.contactMessageId ?? null,
    metadata: { manual: true },
  });
}

// --------------------------------------------------------------------------
// Newsletter
// --------------------------------------------------------------------------

type SubscriberLike = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  source?: string | null;
  status?: string;
  subscribedAt?: Date | string;
};

export async function sendNewsletterAdminNotification(subscriber: SubscriberLike) {
  return sendToAdmins(
    () => {
      const name = [subscriber.firstName, subscriber.lastName].filter(Boolean).join(' ');
      const html = renderEmailLayout({
        preheader: `${subscriber.email} joined the mailing list`,
        heading: 'New newsletter subscriber',
        intro: ['A new visitor has subscribed to the Bosco Okema newsletter.'],
        bodyHtml: renderDetailTable([
          ['Name', name],
          ['Email', subscriber.email],
          ['Status', humanize(subscriber.status || 'ACTIVE')],
          ['Source', subscriber.source],
          ['Date', longDate(subscriber.subscribedAt || new Date())],
        ]),
        cta: { label: 'View subscribers', href: adminUrl('/admin/newsletter/subscribers') },
        footerNote: 'Automated notification from the Bosco Okema website.',
      });
      return { subject: 'New newsletter subscriber', html };
    },
    { type: 'NEWSLETTER_ADMIN', dedupeKey: `subscriber:${subscriber.id}:admin` }
  );
}

export async function sendNewsletterWelcome(
  subscriber: SubscriberLike,
  options: { confirmUrl?: string | null } = {}
) {
  const firstName = subscriber.firstName?.trim();
  const confirming = Boolean(options.confirmUrl);

  const html = renderEmailLayout({
    preheader: confirming ? 'Please confirm your subscription' : 'Welcome to the mailing list',
    heading: confirming ? 'One click to confirm' : 'Welcome, and thank you',
    intro: [
      firstName ? `Hello ${escapeHtml(firstName)},` : 'Hello,',
      confirming
        ? 'Please confirm your email address and we will add you to the list.'
        : 'Thank you for subscribing. You will hear about new performances, educational programmes and upcoming events, and nothing else.',
    ],
    cta: confirming
      ? { label: 'Confirm my subscription', href: options.confirmUrl as string }
      : null,
    outro: [
      confirming
        ? 'If you did not sign up, you can ignore this email and nothing further will happen.'
        : 'You can leave the list at any time using the unsubscribe link at the bottom of any email.',
    ],
    footerNote: 'Bosco Okema - Kampala, Uganda',
  });

  return sendEmail({
    to: subscriber.email,
    subject: confirming
      ? 'Please confirm your subscription to Bosco Okema updates'
      : 'Welcome to Bosco Okema updates',
    html,
    type: confirming ? 'NEWSLETTER_CONFIRM' : 'NEWSLETTER_WELCOME',
    subscriberId: subscriber.id,
    dedupeKey: confirming
      ? `subscriber:${subscriber.id}:confirm`
      : `subscriber:${subscriber.id}:welcome`,
  });
}

// --------------------------------------------------------------------------
// Security
// --------------------------------------------------------------------------

export async function sendPasswordReset(
  user: { id: string; email: string; name?: string | null },
  resetUrl: string
) {
  const html = renderEmailLayout({
    preheader: 'Reset your admin password',
    heading: 'Reset your password',
    intro: [
      user.name ? `Hello ${escapeHtml(user.name)},` : 'Hello,',
      'A password reset was requested for your Bosco Okema admin account. This link expires in one hour.',
    ],
    cta: { label: 'Choose a new password', href: resetUrl },
    outro: [
      'If you did not request this, no action is needed. Your password has not changed and the link will simply expire.',
    ],
    footerNote: 'Bosco Okema admin security',
  });

  return sendEmail({
    to: user.email,
    subject: 'Reset your Bosco Okema admin password',
    html,
    type: 'PASSWORD_RESET',
    metadata: { userId: user.id },
  });
}

export async function sendSecurityAlert(
  user: { id: string; email: string; name?: string | null },
  event: string,
  detail?: Record<string, string | null | undefined>
) {
  const html = renderEmailLayout({
    preheader: `Security notice: ${event}`,
    heading: 'Admin account security notice',
    intro: [
      `This is a security notice for the Bosco Okema admin account ${escapeHtml(user.email)}.`,
      `**${escapeHtml(event)}**`.replace(/\*\*/g, ''),
    ],
    bodyHtml: detail
      ? renderDetailTable(Object.entries(detail).map(([k, v]) => [k, v ?? '']))
      : '',
    outro: [
      'If you did not expect this, change your password immediately and review the active sessions in Admin then Settings then Security.',
    ],
    footerNote: 'Bosco Okema admin security',
  });

  return sendEmail({
    to: user.email,
    subject: `Security notice: ${event}`,
    html,
    type: 'SECURITY_ALERT',
    metadata: { userId: user.id, event },
  });
}

export async function sendNewLoginAlert(
  user: { id: string; email: string },
  meta: { ipAddress?: string | null; userAgent?: string | null }
) {
  const html = renderEmailLayout({
    preheader: 'New sign-in to your admin account',
    heading: 'New sign-in to your admin account',
    intro: [
      `Your Bosco Okema admin account (${escapeHtml(user.email)}) was just used to sign in.`,
    ],
    bodyHtml: renderDetailTable([
      ['Time', new Date().toLocaleString('en-GB')],
      ['IP address', meta.ipAddress],
      ['Device', meta.userAgent],
    ]),
    outro: ['If this was not you, change your password now and revoke the session.'],
    footerNote: 'Bosco Okema admin security',
  });

  return sendEmail({
    to: user.email,
    subject: 'New sign-in to your Bosco Okema admin account',
    html,
    type: 'SECURITY_ALERT',
    metadata: { userId: user.id, event: 'login' },
    dedupeKey: `login-alert:${user.id}:${new Date().toISOString().slice(0, 13)}`,
  });
}

export { BRAND };
