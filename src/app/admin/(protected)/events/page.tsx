import Link from 'next/link';
import { formatDateShort } from '@/lib/utils';
import { prisma } from '@/lib/db';

export const metadata = { title: 'Events' };

const statusColors: Record<string, string> = {
  NEW: 'bg-secondary-container text-on-secondary-container',
  CONFIRMED: 'bg-muted-ochre/20 text-earth-brown border border-muted-ochre/30',
  COMPLETED: 'bg-earth-brown/20 text-earth-brown',
};

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    include: { category: true },
    orderBy: { startDate: 'desc' },
    take: 20,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Events</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2">
            Manage performances, workshops, festivals and other engagements.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
        >
          + Create Event
        </Link>
      </div>
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-body-md">
            <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
              <tr>
                <th className="py-3 px-6 font-normal">Title</th>
                <th className="py-3 px-6 font-normal">Date</th>
                <th className="py-3 px-6 font-normal">Category</th>
                <th className="py-3 px-6 font-normal">Location</th>
                <th className="py-3 px-6 font-normal">Status</th>
                <th className="py-3 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-brown/10">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-on-surface-variant">
                    No events yet. Create your first event above.
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-on-surface">{ev.title}</td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {formatDateShort(ev.startDate)}
                      {ev.time ? ` • ${ev.time}` : ''}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
                        {ev.category?.name || '—'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant truncate max-w-[220px]">
                      {ev.venue || ev.location || '—'}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-1 font-label text-[10px] rounded uppercase tracking-wider ${
                          ev.isPublished
                            ? 'bg-earth-brown/10 text-earth-brown'
                            : 'bg-surface-container-high text-on-surface-variant border border-earth-brown/20'
                        }`}
                      >
                        {ev.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <Link href={`/admin/events/${ev.id}/edit`} className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest">
                        Edit
                      </Link>
                      <Link href={`/events/${ev.slug}`} target="_blank" className="text-on-surface-variant hover:text-on-surface font-label text-label-sm uppercase tracking-widest">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
