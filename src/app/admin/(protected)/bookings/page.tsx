import Link from 'next/link';
import { formatDateShort } from '@/lib/utils';
import { prisma } from '@/lib/db';

const statusColors: Record<string, string> = {
  NEW: 'bg-secondary-container text-on-secondary-container',
  REVIEWING: 'bg-surface-container-high text-on-surface-variant border border-earth-brown/20',
  CONFIRMED: 'bg-muted-ochre/20 text-earth-brown border border-muted-ochre/30',
  FULLY_PAID: 'bg-warm-ivory text-muted-ochre border border-muted-ochre/30',
  COMPLETED: 'bg-earth-brown/20 text-earth-brown',
  CANCELLED: 'bg-error-container text-on-error-container',
};

export const metadata = { title: 'Bookings' };

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  const filters = [
    { label: 'All', key: 'ALL', count: bookings.length },
    { label: 'New', key: 'NEW', count: bookings.filter(b => b.status === 'NEW').length },
    { label: 'Confirmed', key: 'CONFIRMED', count: bookings.filter(b => b.status === 'CONFIRMED').length },
    { label: 'Completed', key: 'COMPLETED', count: bookings.filter(b => b.status === 'COMPLETED').length },
    { label: 'Cancelled', key: 'CANCELLED', count: bookings.filter(b => b.status === 'CANCELLED').length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Bookings</h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2">
          Manage incoming booking requests, statuses, communications and payments.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f, i) => (
          <button
            key={f.key}
            className={`px-4 py-2 rounded border text-body-md transition-colors ${
              i === 0
                ? 'bg-deep-charcoal text-warm-ivory border-deep-charcoal'
                : 'border-earth-brown/20 text-on-surface-variant hover:border-muted-ochre hover:text-muted-ochre'
            }`}
          >
            {f.label} <span className="font-label text-[10px] opacity-70 ml-1">({f.count})</span>
          </button>
        ))}
      </div>
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-body-md min-w-[900px]">
            <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
              <tr>
                <th className="py-3 px-6 font-normal">Reference</th>
                <th className="py-3 px-6 font-normal">Client</th>
                <th className="py-3 px-6 font-normal">Type</th>
                <th className="py-3 px-6 font-normal">Event Date</th>
                <th className="py-3 px-6 font-normal">Submitted</th>
                <th className="py-3 px-6 font-normal text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-brown/10">
              {bookings.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-on-surface-variant">No bookings yet.</td></tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-on-surface font-label text-label-sm">
                      {b.reference}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-on-surface">{b.customerName}</div>
                      <div className="font-label text-label-sm text-on-surface-variant truncate max-w-[200px]">
                        {b.organization || b.customerEmail}
                      </div>
                    </td>
                    <td className="py-4 px-6 capitalize text-on-surface-variant">
                      {b.type.replace(/_/g, ' ')}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">{formatDateShort(b.eventDate)}</td>
                    <td className="py-4 px-6 text-on-surface-variant">{formatDateShort(b.createdAt)}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-block px-2 py-1 font-label text-[10px] rounded uppercase tracking-wider ${statusColors[b.status] || statusColors.NEW}`}>
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
  );
}
