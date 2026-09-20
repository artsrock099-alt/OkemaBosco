import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateShort } from '@/lib/utils';
import MarkAllReadButton from '@/components/admin/MarkAllReadButton';

export const metadata = { title: 'Notifications' };

const TYPE_LABELS: Record<string, string> = {
  BOOKING: 'Booking',
  CONTACT: 'Message',
  NEWSLETTER: 'Newsletter',
  EMAIL_FAILURE: 'Email',
  SECURITY: 'Security',
};

const TYPE_CLASSES: Record<string, string> = {
  BOOKING: 'bg-muted-ochre/20 text-earth-brown border-muted-ochre/40',
  CONTACT: 'bg-earth-brown/10 text-earth-brown border-earth-brown/30',
  NEWSLETTER: 'bg-emerald-600/10 text-emerald-800 border-emerald-700/30',
  EMAIL_FAILURE: 'bg-accent-orange/15 text-accent-orange border-accent-orange/40',
  SECURITY: 'bg-error-container text-on-error-container border-error/30',
};

type Props = {
  searchParams: { filter?: string; page?: string };
};

export default async function AdminNotificationsPage({ searchParams }: Props) {
  const filter = searchParams.filter === 'unread' ? 'unread' : 'all';
  const page = Math.max(1, Number(searchParams.page || 1) || 1);
  const perPage = 30;

  const where = filter === 'unread' ? { isRead: false } : {};

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.adminNotification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.adminNotification.count({ where }),
    prisma.adminNotification.count({ where: { isRead: false } }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
            Admin
          </div>
          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
            Notifications
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Everything that has arrived: booking requests, contact messages, newsletter
            subscribers, email delivery problems and security events.
          </p>
        </div>
        {unreadCount > 0 && <MarkAllReadButton count={unreadCount} />}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All', href: '/admin/notifications' },
          { key: 'unread', label: `Unread (${unreadCount})`, href: '/admin/notifications?filter=unread' },
        ].map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`px-4 py-2 rounded border font-body text-body-md transition-colors ${
              filter === tab.key
                ? 'bg-deep-charcoal text-warm-ivory border-deep-charcoal'
                : 'border-earth-brown/20 text-on-surface-variant hover:border-muted-ochre hover:text-muted-ochre'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="card-surface overflow-hidden">
        {notifications.length === 0 ? (
          <p className="py-16 text-center font-body text-body-md text-on-surface-variant">
            {filter === 'unread' ? 'Nothing unread.' : 'No notifications yet.'}
          </p>
        ) : (
          <ul className="divide-y divide-earth-brown/10">
            {notifications.map((item) => (
              <li key={item.id} className="flex flex-wrap items-start gap-4 px-6 py-4">
                <span
                  className={`px-2.5 py-1 rounded border font-label text-[10px] uppercase tracking-widest whitespace-nowrap ${
                    TYPE_CLASSES[item.type] || TYPE_CLASSES.CONTACT
                  }`}
                >
                  {TYPE_LABELS[item.type] || item.type}
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className={`font-body text-body-md ${
                      item.isRead ? 'text-on-surface-variant' : 'text-on-surface font-medium'
                    }`}
                  >
                    {item.title}
                  </div>
                  <div className="font-body text-body-sm text-on-surface-variant">{item.message}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant whitespace-nowrap">
                    {formatDateShort(item.createdAt)}
                  </span>
                  {item.link && (
                    <Link
                      href={item.link}
                      className="font-label text-label-sm uppercase tracking-widest text-muted-ochre hover:text-earth-brown whitespace-nowrap"
                    >
                      Open
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
          <span>
            Page {page} of {pageCount}
          </span>
          <div className="flex gap-3">
            {page > 1 && (
              <Link
                href={`/admin/notifications?filter=${filter}&page=${page - 1}`}
                className="hover:text-muted-ochre"
              >
                Newer
              </Link>
            )}
            {page < pageCount && (
              <Link
                href={`/admin/notifications?filter=${filter}&page=${page + 1}`}
                className="hover:text-muted-ochre"
              >
                Older
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
