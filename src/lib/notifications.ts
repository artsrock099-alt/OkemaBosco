/**
 * Admin notification service.
 *
 * One call records a dashboard notification and, when the matching preference
 * is on, triggers the designed email for that event. Both halves respect the
 * per-type switches stored in NotificationPreference.
 */
import { prisma } from './db';
import type { NotificationType } from '@prisma/client';

export const NOTIFICATION_TYPES: NotificationType[] = [
  'BOOKING',
  'CONTACT',
  'NEWSLETTER',
  'EMAIL_FAILURE',
  'SECURITY',
];

export const NOTIFICATION_LABELS: Record<NotificationType, { label: string; description: string }> = {
  BOOKING: {
    label: 'New booking request',
    description: 'Somebody submitted a booking enquiry on the website.',
  },
  CONTACT: {
    label: 'New contact message',
    description: 'A message arrived through the contact form.',
  },
  NEWSLETTER: {
    label: 'New newsletter subscriber',
    description: 'A visitor joined the mailing list.',
  },
  EMAIL_FAILURE: {
    label: 'Email delivery problem',
    description: 'An email failed to send, bounced or was marked as spam.',
  },
  SECURITY: {
    label: 'Security alerts',
    description:
      'Sign-ins, MFA changes, password changes and lockouts. These cannot be switched off.',
  },
};

export type NotificationInput = {
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  /** Admin route the notification opens, e.g. "/admin/bookings/abc". */
  link?: string;
  /**
   * Sends the email half. Provided by the caller so the designed template and
   * its idempotency key live with the feature rather than here.
   */
  sendEmailNotification?: (() => Promise<{ ok: boolean }>) | null;
};

export type NotificationPreferenceMap = Record<
  NotificationType,
  { dashboard: boolean; email: boolean }
>;

/** Stored preferences merged over the defaults (everything on). */
export async function getNotificationPreferences(): Promise<NotificationPreferenceMap> {
  const map = {} as NotificationPreferenceMap;
  for (const type of NOTIFICATION_TYPES) {
    map[type] = { dashboard: true, email: true };
  }

  try {
    const rows = await prisma.notificationPreference.findMany();
    for (const row of rows) {
      if (!map[row.type]) continue;
      map[row.type] = { dashboard: row.dashboard, email: row.email };
    }
  } catch (error) {
    console.error('Could not load notification preferences:', error);
  }

  // Security alerts are deliberately always on.
  map.SECURITY = { dashboard: true, email: true };
  return map;
}

export async function setNotificationPreference(
  type: NotificationType,
  values: { dashboard: boolean; email: boolean }
) {
  if (type === 'SECURITY') {
    // Refuse to disable security alerts; they are the account's safety net.
    values = { dashboard: true, email: true };
  }

  return prisma.notificationPreference.upsert({
    where: { type },
    create: { type, dashboard: values.dashboard, email: values.email },
    update: { dashboard: values.dashboard, email: values.email },
  });
}

/**
 * Record a notification and optionally email it.
 *
 * Never throws: the caller has already completed the real work (a booking, a
 * message, a signup) and that result must not be lost because of a
 * notification problem.
 */
export async function notify(input: NotificationInput): Promise<{
  notificationId?: string;
  emailSent: boolean;
  error?: string;
}> {
  try {
    const preferences = await getNotificationPreferences();
    const preference = preferences[input.type] ?? { dashboard: true, email: true };

    let notificationId: string | undefined;

    if (preference.dashboard) {
      const row = await prisma.adminNotification.create({
        data: {
          type: input.type,
          title: input.title,
          message: input.message,
          entityType: input.entityType ?? null,
          entityId: input.entityId ?? null,
          link: input.link ?? null,
        },
        select: { id: true },
      });
      notificationId = row.id;
    }

    let emailSent = false;
    if (preference.email && input.sendEmailNotification) {
      const result = await input.sendEmailNotification();
      emailSent = Boolean(result?.ok);
    }

    if (notificationId && emailSent) {
      await prisma.adminNotification
        .update({ where: { id: notificationId }, data: { emailSent: true } })
        .catch(() => undefined);
    }

    return { notificationId, emailSent };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Notification failed:', message);
    return { emailSent: false, error: message };
  }
}

export async function unreadNotificationCount(): Promise<number> {
  try {
    return await prisma.adminNotification.count({ where: { isRead: false } });
  } catch {
    return 0;
  }
}

export async function recentNotifications(limit = 8) {
  try {
    return await prisma.adminNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  } catch (error) {
    console.error('Could not load notifications:', error);
    return [];
  }
}

export async function markNotificationRead(id: string) {
  return prisma.adminNotification.update({
    where: { id },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function markAllNotificationsRead() {
  return prisma.adminNotification.updateMany({
    where: { isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}

/** Used by the email webhook to raise delivery problems. */
export async function notifyEmailFailure(input: {
  recipient: string;
  subject: string;
  reason: string;
  emailLogId?: string | null;
}) {
  return notify({
    type: 'EMAIL_FAILURE',
    title: `Email problem: ${input.reason}`,
    message: `${input.recipient} - ${input.subject}`,
    entityType: 'EmailLog',
    entityId: input.emailLogId ?? undefined,
    link: '/admin/settings/email',
    sendEmailNotification: null,
  });
}
