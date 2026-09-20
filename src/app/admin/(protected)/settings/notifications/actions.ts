'use server';

import { revalidatePath } from 'next/cache';
import type { NotificationType } from '@prisma/client';
import { requireRole } from '@/lib/rbac';
import { setNotificationPreference, NOTIFICATION_TYPES } from '@/lib/notifications';

/**
 * Saves the per-type notification switches.
 *
 * SECURITY alerts are forced on server-side by setNotificationPreference, so a
 * tampered form cannot silence them.
 */
export async function saveNotificationPreferences(formData: FormData) {
  const session = await requireRole(['SUPER_ADMIN', 'ADMIN']);

  for (const type of NOTIFICATION_TYPES) {
    const dashboard = formData.get(`dashboard:${type}`) === 'on';
    const email = formData.get(`email:${type}`) === 'on';
    await setNotificationPreference(type as NotificationType, { dashboard, email });
  }

  await import('@/lib/audit').then(({ createAuditLog }) =>
    createAuditLog('NOTIFICATION_PREFERENCES_UPDATED', 'SETTINGS', undefined, session.user.id)
  );

  revalidatePath('/admin/settings/notifications');
  revalidatePath('/admin/notifications');
}
