import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { markAllNotificationsRead, markNotificationRead } from '@/lib/notifications';

/** Recent notifications plus the unread count, for the header bell. */
export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const limit = Math.min(
      Number(new URL(request.url).searchParams.get('limit') || 10) || 10,
      50
    );

    const [notifications, unreadCount] = await Promise.all([
      prisma.adminNotification.findMany({ orderBy: { createdAt: 'desc' }, take: limit }),
      prisma.adminNotification.count({ where: { isRead: false } }),
    ]);

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error) {
    return handleApiError(error, 'Failed to load notifications');
  }
}

/** Mark one notification, or all of them, as read. */
export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json().catch(() => ({}));
    const id = String(body?.id || '').trim();

    if (!id) {
      await markAllNotificationsRead();
      return NextResponse.json({ success: true, all: true });
    }

    await markNotificationRead(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return handleApiError(error, 'Failed to update the notification');
  }
}
