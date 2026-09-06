import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateShort } from '@/lib/utils';
import {
  CalendarDays,
  CalendarClock,
  Mail,
  Users2,
  FileText,
  Image,
  Music,
  Plus,
  ArrowRight,
} from 'lucide-react';

export const metadata = { title: 'Dashboard' };

const statusColors: Record<string, string> = {
  NEW: 'bg-secondary-container text-on-secondary-container',
  REVIEWING: 'bg-surface-container-high text-on-surface-variant border border-earth-brown/20',
  QUOTED: 'bg-warm-ivory text-earth-brown border border-earth-brown/30',
  CONFIRMED: 'bg-muted-ochre/20 text-earth-brown border border-muted-ochre/30',
  DEPOSIT_PAID: 'bg-muted-ochre/10 text-muted-ochre border border-muted-ochre/30',
  FULLY_PAID: 'bg-warm-ivory text-muted-ochre border border-muted-ochre/30',
  COMPLETED: 'bg-earth-brown/20 text-earth-brown',
  CANCELLED: 'bg-error-container text-on-error-container',
};

export default async function AdminDashboardPage() {
  const now = new Date();

  const [
    upcomingEventsCount,
    newBookings,
    unreadMessages,
    newsletterSubs,
    publishedArticles,
    mediaCount,
    recentBookings,
    upcomingEvents,
    recentMessages,
    musicCount,
  ] = await Promise.all([
    prisma.event.count({
      where: { isPublished: true, startDate: { gte: now } },
    }),
    prisma.booking.count({ where: { status: 'NEW' } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.media.count(),
    prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.event.findMany({
      where: { isPublished: true, startDate: { gte: now } },
      orderBy: { startDate: 'asc' },
      take: 5,
      include: { category: true },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.music.count(),
  ]);

  const stats = [
    {
      label: 'Upcoming Events',
      value: upcomingEventsCount,
      icon: <CalendarDays className="w-5 h-5 text-muted-ochre" />,
      href: '/admin/events',
    },
    {
      label: 'New Bookings',
      value: newBookings,
      icon: <CalendarClock className="w-5 h-5 text-muted-ochre" />,
      href: '/admin/bookings',
      highlight: true,
    },
    {
      label: 'Unread Messages',
      value: unreadMessages,
      icon: <Mail className="w-5 h-5 text-accent-orange" />,
      href: '/admin/messages',
      dark: true,
    },
    {
      label: 'Newsletter Subs',
      value: newsletterSubs > 1000 ? `${(newsletterSubs / 1000).toFixed(1)}k` : newsletterSubs,
      icon: <Users2 className="w-5 h-5 text-muted-ochre" />,
      href: '/admin/newsletter',
    },
    {
      label: 'Published Articles',
      value: publishedArticles,
      icon: <FileText className="w-5 h-5 text-muted-ochre" />,
      href: '/admin/articles',
    },
    {
      label: 'Media Items',
      value: mediaCount,
      icon: <Image className="w-5 h-5 text-muted-ochre" />,
      href: '/admin/media',
    },
    {
      label: 'Music Tracks',
      value: musicCount,
      icon: <Music className="w-5 h-5 text-muted-ochre" />,
      href: '/admin/music',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Greeting */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-display text-display-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            GOOD MORNING, BOSCO
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-xl">
            Here is a summary of your recent activity and upcoming engagements. The arts await your direction.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-transparent text-on-surface font-label text-label-sm border border-earth-brown/20 hover:border-earth-brown hover:bg-surface-container transition-colors uppercase tracking-widest rounded"
          >
            Write Article
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-transparent text-on-surface font-label text-label-sm border border-earth-brown/20 hover:border-earth-brown hover:bg-surface-container transition-colors uppercase tracking-widest rounded"
          >
            Upload Media
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`p-6 flex flex-col justify-between h-40 transition-colors border ${
              s.dark
                ? 'bg-deep-charcoal text-warm-ivory border-earth-brown/20 hover:border-warm-ivory/30'
                : 'bg-surface-container border-earth-brown/10 hover:border-earth-brown/30'
            }`}
          >
            <div className="flex justify-between items-start">
              <span
                className={`font-label text-label-sm uppercase tracking-widest ${
                  s.dark ? 'text-surface-variant' : 'text-on-surface-variant'
                }`}
              >
                {s.label}
              </span>
              {s.icon}
            </div>
            <span
              className={`font-display text-headline-lg tracking-tight ${
                s.dark ? 'text-warm-ivory' : 'text-on-surface'
              }`}
            >
              {s.value}
            </span>
          </Link>
        ))}
      </section>

      {/* Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-end border-b border-earth-brown/20 pb-3">
            <h2 className="font-headline text-headline-md text-on-surface">Recent Bookings</h2>
            <Link
              href="/admin/bookings"
              className="font-label text-label-sm text-muted-ochre hover:text-earth-brown transition-colors uppercase tracking-widest"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto -mx-5 md:mx-0">
            <div className="min-w-[720px]">
              <table className="w-full text-left font-body text-body-md text-on-surface">
                <thead className="font-label text-label-sm text-on-surface-variant border-b border-earth-brown/10 bg-surface-container/50">
                  <tr>
                    <th className="py-3 px-4 font-normal">Client</th>
                    <th className="py-3 px-4 font-normal">Type</th>
                    <th className="py-3 px-4 font-normal">Date</th>
                    <th className="py-3 px-4 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-brown/10">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-on-surface-variant">
                        No bookings yet — you will see them here when they arrive.
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-surface-container/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium">{b.customerName}</div>
                          {b.organization && (
                            <div className="font-label text-label-sm text-on-surface-variant">
                              {b.organization}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-on-surface-variant capitalize">
                          {b.type.replace(/_/g, ' ')}
                        </td>
                        <td className="py-4 px-4">{formatDateShort(b.eventDate)}</td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`inline-block px-2 py-1 font-label text-[10px] rounded uppercase tracking-wider ${
                              statusColors[b.status] || statusColors.NEW
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Agenda + Messages */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <div className="border-b border-earth-brown/20 pb-3 mb-4 flex justify-between items-end">
              <h2 className="font-headline text-headline-md text-on-surface">Agenda</h2>
              <Link
                href="/admin/events"
                className="font-label text-label-sm text-muted-ochre hover:text-earth-brown transition-colors uppercase tracking-widest"
              >
                All →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {upcomingEvents.length === 0 ? (
                <p className="p-4 text-on-surface-variant text-body-md bg-surface-container">
                  No upcoming events.
                </p>
              ) : (
                upcomingEvents.map((ev) => {
                  const d = new Date(ev.startDate);
                  const month = d.toLocaleString('en-US', { month: 'short' });
                  const day = d.getDate();
                  return (
                    <Link
                      key={ev.id}
                      href={`/admin/events/${ev.id}/edit`}
                      className="flex gap-4 p-4 bg-surface-container border border-earth-brown/10 hover:border-earth-brown/30 transition-colors items-center group"
                    >
                      <div className="flex flex-col items-center justify-center min-w-[3rem] text-center">
                        <span className="font-label text-label-sm text-muted-ochre uppercase">
                          {month}
                        </span>
                        <span className="font-headline text-headline-md text-on-surface leading-none">
                          {day}
                        </span>
                      </div>
                      <div className="h-10 w-px bg-earth-brown/20" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-body text-body-md font-bold text-on-surface truncate group-hover:text-muted-ochre transition-colors">
                          {ev.title}
                        </h3>
                        <p className="font-label text-label-sm text-on-surface-variant mt-1 truncate">
                          {ev.venue || ev.location || 'TBA'}
                          {ev.time ? `, ${ev.time}` : ''}
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <div className="border-b border-earth-brown/20 pb-3 mb-4 flex justify-between items-end">
              <h2 className="font-headline text-headline-md text-on-surface">Messages</h2>
              <Link
                href="/admin/messages"
                className="font-label text-label-sm text-muted-ochre hover:text-earth-brown transition-colors uppercase tracking-widest"
              >
                All →
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-earth-brown/10 bg-surface-container border border-earth-brown/10">
              {recentMessages.length === 0 ? (
                <p className="p-4 text-on-surface-variant text-body-md">No messages yet.</p>
              ) : (
                recentMessages.map((m) => (
                  <Link
                    key={m.id}
                    href={`/admin/messages/${m.id}`}
                    className="p-4 hover:bg-surface transition-colors flex items-start gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2 mb-1">
                        <span className="font-medium text-on-surface truncate">{m.name}</span>
                        <span className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant whitespace-nowrap">
                          {formatDateShort(m.createdAt)}
                        </span>
                      </div>
                      <div className="font-body text-body-md text-on-surface truncate">{m.subject}</div>
                      <div className="font-body text-body-md text-on-surface-variant line-clamp-1 mt-1">
                        {m.message}
                      </div>
                    </div>
                    {!m.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-accent-orange flex-shrink-0 mt-2" />
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Row */}
      <section>
        <div className="border-b border-earth-brown/20 pb-3 mb-6">
          <h2 className="font-headline text-headline-md text-on-surface">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Create Event', href: '/admin/events/new', icon: <CalendarDays className="w-5 h-5" /> },
            { label: 'Write Article', href: '/admin/articles/new', icon: <FileText className="w-5 h-5" /> },
            { label: 'Upload Media', href: '/admin/media', icon: <Image className="w-5 h-5" /> },
            { label: 'Create Page', href: '/admin/pages/new', icon: <FileText className="w-5 h-5" /> },
            { label: 'Add Music', href: '/admin/music/new', icon: <Music className="w-5 h-5" /> },
            { label: 'View Bookings', href: '/admin/bookings', icon: <CalendarClock className="w-5 h-5" /> },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex flex-col items-start gap-3 p-5 card-surface group hover:bg-surface"
            >
              <div className="w-10 h-10 rounded bg-deep-charcoal text-warm-ivory flex items-center justify-center group-hover:bg-muted-ochre transition-colors">
                {a.icon}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label text-label-sm uppercase tracking-widest text-on-surface">
                  {a.label}
                </span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-muted-ochre group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
