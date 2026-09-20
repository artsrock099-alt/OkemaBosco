'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';

type Notification = {
  id: string;
  type: 'BOOKING' | 'CONTACT' | 'NEWSLETTER' | 'EMAIL_FAILURE' | 'SECURITY';
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

const TYPE_STYLES: Record<Notification['type'], { dot: string; label: string }> = {
  BOOKING: { dot: 'bg-muted-ochre', label: 'Booking' },
  CONTACT: { dot: 'bg-earth-brown', label: 'Message' },
  NEWSLETTER: { dot: 'bg-emerald-600', label: 'Newsletter' },
  EMAIL_FAILURE: { dot: 'bg-accent-orange', label: 'Email' },
  SECURITY: { dot: 'bg-error', label: 'Security' },
};

function timeAgo(value: string): string {
  const then = new Date(value).getTime();
  const seconds = Math.max(1, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/**
 * Admin notification bell. Polls the unread count, shows the most recent
 * notifications and marks them read, either individually or all at once.
 */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications?limit=8', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // Silent: an admin dashboard should not shout about a failed poll.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 30_000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const markAllRead = async () => {
    setUnreadCount(0);
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => undefined);
  };

  const markOneRead = async (id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
    setUnreadCount((count) => Math.max(0, count - 1));
    await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => undefined);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
        aria-expanded={open}
        className="relative text-on-surface-variant hover:text-primary hover:bg-surface-container-high p-2 rounded-full transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-orange text-warm-ivory font-label text-[10px] flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(24rem,calc(100vw-2rem))] bg-surface border border-earth-brown/20 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-earth-brown/10">
            <span className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="font-label text-label-sm uppercase tracking-widest text-muted-ochre hover:text-earth-brown"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[22rem] overflow-y-auto">
            {loading ? (
              <p className="px-4 py-8 text-center font-body text-body-md text-on-surface-variant">
                Loading…
              </p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-8 text-center font-body text-body-md text-on-surface-variant">
                Nothing yet. Bookings, messages, subscribers and security alerts will appear here.
              </p>
            ) : (
              <ul className="divide-y divide-earth-brown/10">
                {notifications.map((item) => {
                  const style = TYPE_STYLES[item.type] ?? TYPE_STYLES.CONTACT;
                  const content = (
                    <div className="flex gap-3 px-4 py-3 hover:bg-surface-container/60 transition-colors">
                      <span
                        className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                          item.isRead ? 'bg-earth-brown/20' : style.dot
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
                            {style.label}
                          </span>
                          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant flex-shrink-0">
                            {timeAgo(item.createdAt)}
                          </span>
                        </div>
                        <div
                          className={`font-body text-body-md truncate ${
                            item.isRead ? 'text-on-surface-variant' : 'text-on-surface font-medium'
                          }`}
                        >
                          {item.title}
                        </div>
                        <div className="font-body text-body-sm text-on-surface-variant truncate">
                          {item.message}
                        </div>
                      </div>
                    </div>
                  );

                  return (
                    <li key={item.id}>
                      {item.link ? (
                        <Link
                          href={item.link}
                          onClick={() => {
                            if (!item.isRead) markOneRead(item.id);
                            setOpen(false);
                          }}
                        >
                          {content}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-left"
                          onClick={() => !item.isRead && markOneRead(item.id)}
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="border-t border-earth-brown/10">
            <Link
              href="/admin/notifications"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-center font-label text-label-sm uppercase tracking-widest text-muted-ochre hover:bg-surface-container/60"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
