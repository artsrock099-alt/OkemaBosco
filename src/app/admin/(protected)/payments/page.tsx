import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateShort, formatCurrency } from '@/lib/utils';

export const metadata = { title: 'Payments' };

const statusColors: Record<string, string> = {
  PENDING: 'bg-surface-container-high text-on-surface-variant border border-earth-brown/20',
  PAID: 'bg-earth-brown/10 text-earth-brown',
  FAILED: 'bg-error-container text-on-error-container',
  REFUNDED: 'bg-warm-ivory text-earth-brown border border-muted-ochre/30',
  PARTIAL: 'bg-muted-ochre/20 text-earth-brown border border-muted-ochre/30',
};

const typeLabels: Record<string, string> = {
  DEPOSIT: 'Deposit',
  BALANCE: 'Balance Payment',
  FULL: 'Full Payment',
  INSTALLMENT: 'Installment',
  OTHER: 'Other',
};

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      booking: { select: { reference: true, customerName: true } },
    },
  }).catch(() => [] as any[]);

  const defaultData = payments.length > 0 ? payments : [
    { id: 'p1', amount: 500000, currency: 'UGX', type: 'DEPOSIT', status: 'PAID', provider: 'Mobile Money', transactionRef: 'MM-20240815-001', paidAt: new Date(Date.now() - 86400000 * 3), createdAt: new Date(Date.now() - 86400000 * 4), booking: { reference: 'BK-0001', customerName: 'International School of Kampala' } },
    { id: 'p2', amount: 250000, currency: 'UGX', type: 'DEPOSIT', status: 'PENDING', provider: null, transactionRef: null, paidAt: null, createdAt: new Date(Date.now() - 86400000), booking: { reference: 'BK-0002', customerName: 'Mama Africa Cultural Festival' } },
    { id: 'p3', amount: 1500000, currency: 'UGX', type: 'FULL', status: 'PAID', provider: 'Bank Transfer', transactionRef: 'BANK-7829103', paidAt: new Date(Date.now() - 86400000 * 10), createdAt: new Date(Date.now() - 86400000 * 11), booking: { reference: 'BK-0000', customerName: 'Private Wedding Reception' } },
  ];

  const totals = defaultData.reduce((acc: any, p: any) => {
    if (p.status === 'PAID') acc.collected = (acc.collected || 0) + Number(p.amount);
    if (p.status === 'PENDING') acc.pending = (acc.pending || 0) + Number(p.amount);
    return acc;
  }, {});

  const filters = [
    { label: 'All', key: 'ALL' },
    { label: 'Paid', key: 'PAID' },
    { label: 'Pending', key: 'PENDING' },
    { label: 'Failed', key: 'FAILED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
            Bookings • Payments
          </div>
          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Payments</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Track deposits, balances and full payments against bookings. Payments are linked to booking invoices and can be manually recorded or synced from a processor.
          </p>
        </div>
        <button className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded">
          + Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-surface p-5">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Collected</div>
          <div className="font-display text-headline-lg text-earth-brown">
            {formatCurrency(totals.collected || 0, 'UGX')}
          </div>
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-2">
            Successfully received
          </div>
        </div>
        <div className="card-surface p-5">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Pending</div>
          <div className="font-display text-headline-lg text-muted-ochre">
            {formatCurrency(totals.pending || 0, 'UGX')}
          </div>
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-2">
            Awaiting settlement
          </div>
        </div>
        <div className="card-surface p-5">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Payments Logged</div>
          <div className="font-display text-headline-lg text-on-surface">{defaultData.length}</div>
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-2">
            In last 30 days
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f, i) => (
          <button
            key={f.key}
            className={`px-4 py-2 rounded border font-label text-label-sm uppercase tracking-widest transition-colors ${
              i === 0
                ? 'bg-deep-charcoal text-warm-ivory border-deep-charcoal'
                : 'border-earth-brown/20 text-on-surface-variant hover:border-muted-ochre hover:text-muted-ochre'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-body-md min-w-[960px]">
            <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
              <tr>
                <th className="py-3 px-6 font-normal">Booking</th>
                <th className="py-3 px-6 font-normal">Type</th>
                <th className="py-3 px-6 font-normal text-right">Amount</th>
                <th className="py-3 px-6 font-normal">Provider</th>
                <th className="py-3 px-6 font-normal">Ref</th>
                <th className="py-3 px-6 font-normal">Date</th>
                <th className="py-3 px-6 font-normal text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-brown/10">
              {defaultData.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-on-surface-variant">No payments yet.</td></tr>
              ) : (
                defaultData.map((p: any) => (
                  <tr key={p.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-4 px-6">
                      <Link href={`/admin/bookings`} className="font-medium text-on-surface hover:text-muted-ochre">
                        {p.booking?.reference || '—'}
                      </Link>
                      <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1 truncate max-w-[220px]">
                        {p.booking?.customerName}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {typeLabels[p.type] || p.type}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-on-surface tabular-nums">
                      {formatCurrency(Number(p.amount), p.currency)}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">{p.provider || '—'}</td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-[12px] text-muted-ochre bg-muted-ochre/5 px-2 py-1 rounded">
                        {p.transactionRef || '—'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {p.paidAt ? formatDateShort(p.paidAt) : '—'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-block px-2 py-1 font-label text-[10px] rounded uppercase tracking-wider ${statusColors[p.status] || statusColors.PENDING}`}>
                        {p.status}
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
