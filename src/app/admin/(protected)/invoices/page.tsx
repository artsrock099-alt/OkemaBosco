import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateShort, formatCurrency } from '@/lib/utils';

export const metadata = { title: 'Invoices' };

const statusColors: Record<string, string> = {
  PENDING: 'bg-warm-ivory text-earth-brown border border-muted-ochre/30',
  PAID: 'bg-earth-brown/10 text-earth-brown',
  OVERDUE: 'bg-error-container text-on-error-container',
  CANCELLED: 'bg-surface-container-high text-on-surface-variant border border-earth-brown/20',
};

export default async function AdminInvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      booking: { select: { reference: true, customerName: true, customerEmail: true } },
      payments: { select: { id: true, amount: true, status: true } },
    },
  }).catch(() => [] as any[]);

  const defaultInvoices = invoices.length > 0 ? invoices : [
    {
      id: 'i1', number: 'INV-2026-0003', status: 'PAID', amount: 1500000, dueDate: new Date(Date.now() + 86400000 * 5), issuedAt: new Date(Date.now() - 86400000 * 14), paidAt: new Date(Date.now() - 86400000 * 10),
      createdAt: new Date(), notes: 'Full payment — private wedding reception',
      booking: { reference: 'BK-0000', customerName: 'Private Wedding Reception', customerEmail: 'events@weddings.com' },
      payments: [{ id: '1', amount: 1500000, status: 'PAID' }],
    },
    {
      id: 'i2', number: 'INV-2026-0004', status: 'PENDING', amount: 1000000, dueDate: new Date(Date.now() + 86400000 * 7), issuedAt: new Date(Date.now() - 86400000 * 2), paidAt: null,
      createdAt: new Date(), notes: '50% deposit required to confirm',
      booking: { reference: 'BK-0001', customerName: 'International School of Kampala', customerEmail: 'arts@isk.ac.ug' },
      payments: [{ id: '2', amount: 500000, status: 'PAID' }],
    },
    {
      id: 'i3', number: 'INV-2026-0005', status: 'PENDING', amount: 750000, dueDate: new Date(Date.now() - 86400000 * 2), issuedAt: new Date(Date.now() - 86400000 * 10), paidAt: null,
      createdAt: new Date(), notes: null,
      booking: { reference: 'BK-0002', customerName: 'Mama Africa Cultural Festival', customerEmail: 'bookings@mamafrica.org' },
      payments: [],
    },
  ];

  const totals = defaultInvoices.reduce(
    (acc: any, inv: any) => {
      acc.total = (acc.total || 0) + Number(inv.amount);
      if (inv.status === 'PAID') acc.paid = (acc.paid || 0) + Number(inv.amount);
      if (inv.status === 'PENDING' || inv.status === 'OVERDUE') acc.outstanding = (acc.outstanding || 0) + Number(inv.amount);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
            Bookings • Invoices
          </div>
          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Invoices</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Invoices are generated automatically when a booking is confirmed. Mark as paid, download PDF or send customer-facing links.
          </p>
        </div>
        <button className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded">
          + New Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-surface p-5 md:col-span-1">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Total Issued</div>
          <div className="font-display text-headline-lg text-on-surface">
            {formatCurrency(totals.total || 0, 'UGX')}
          </div>
        </div>
        <div className="card-surface p-5 md:col-span-1">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Collected</div>
          <div className="font-display text-headline-lg text-earth-brown">
            {formatCurrency(totals.paid || 0, 'UGX')}
          </div>
        </div>
        <div className="card-surface p-5 md:col-span-1">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Outstanding</div>
          <div className="font-display text-headline-lg text-muted-ochre">
            {formatCurrency(totals.outstanding || 0, 'UGX')}
          </div>
        </div>
        <div className="card-surface p-5 md:col-span-1">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Invoices</div>
          <div className="font-display text-headline-lg text-on-surface">{defaultInvoices.length}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ['All', 'ALL'],
          ['Outstanding', 'PENDING'],
          ['Paid', 'PAID'],
          ['Overdue', 'OVERDUE'],
          ['Cancelled', 'CANCELLED'],
        ].map(([label, key], i) => (
          <button
            key={key as string}
            className={`px-4 py-2 rounded border font-label text-label-sm uppercase tracking-widest transition-colors ${
              i === 0
                ? 'bg-deep-charcoal text-warm-ivory border-deep-charcoal'
                : 'border-earth-brown/20 text-on-surface-variant hover:border-muted-ochre hover:text-muted-ochre'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-body-md min-w-[960px]">
            <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
              <tr>
                <th className="py-3 px-6 font-normal">Invoice</th>
                <th className="py-3 px-6 font-normal">Client</th>
                <th className="py-3 px-6 font-normal text-right">Amount</th>
                <th className="py-3 px-6 font-normal">Issued</th>
                <th className="py-3 px-6 font-normal">Due</th>
                <th className="py-3 px-6 font-normal text-right">Status</th>
                <th className="py-3 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-brown/10">
              {defaultInvoices.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-on-surface-variant">No invoices yet.</td></tr>
              ) : (
                defaultInvoices.map((inv: any) => {
                  const paidAmt = inv.payments?.reduce((s: number, p: any) => s + (p.status === 'PAID' ? Number(p.amount) : 0), 0) || 0;
                  const isOverdue = inv.status === 'PENDING' && inv.dueDate && new Date(inv.dueDate) < new Date();
                  const status = isOverdue ? 'OVERDUE' : inv.status;
                  return (
                    <tr key={inv.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-mono text-[13px] font-medium text-on-surface">{inv.number}</div>
                        <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                          {inv.booking?.reference || ''}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-on-surface">{inv.booking?.customerName || '—'}</div>
                        <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant truncate max-w-[220px]">
                          {inv.booking?.customerEmail}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="font-medium text-on-surface tabular-nums">
                          {formatCurrency(Number(inv.amount), 'UGX')}
                        </div>
                        {paidAmt > 0 && paidAmt < Number(inv.amount) && (
                          <div className="font-label text-[10px] uppercase tracking-widest text-muted-ochre mt-1">
                            {formatCurrency(paidAmt, 'UGX')} paid
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">
                        {inv.issuedAt ? formatDateShort(inv.issuedAt) : '—'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={isOverdue ? 'text-error' : 'text-on-surface-variant'}>
                          {inv.dueDate ? formatDateShort(inv.dueDate) : '—'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-block px-2 py-1 font-label text-[10px] rounded uppercase tracking-wider ${statusColors[status] || statusColors.PENDING}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <button className="text-on-surface-variant hover:text-on-surface font-label text-label-sm uppercase tracking-widest">
                          PDF
                        </button>
                        <button className="text-on-surface-variant hover:text-on-surface font-label text-label-sm uppercase tracking-widest">
                          Send
                        </button>
                        <Link href={`/admin/invoices/${inv.id}`} className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
