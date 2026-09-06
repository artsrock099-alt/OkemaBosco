'use client';

import { useState } from 'react';
import { formatDateShort } from '@/lib/utils';

type Subscriber = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt: Date | null;
};

type Props = {
  initialSubscribers: Subscriber[];
};

export default function NewsletterSubscribersManager({ initialSubscribers }: Props) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'UNSUBSCRIBED'>('ALL');
  const [exportLoading, setExportLoading] = useState(false);

  const filtered = subscribers.filter((s) => {
    const matchesSearch =
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.firstName?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (s.lastName?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesFilter =
      filter === 'ALL' ? true : filter === 'ACTIVE' ? s.isActive : !s.isActive;
    return matchesSearch && matchesFilter;
  });

  const activeCount = subscribers.filter((s) => s.isActive).length;
  const unsubscribedCount = subscribers.length - activeCount;

  const handleExport = async () => {
    setExportLoading(true);
    const headers = ['Email', 'First Name', 'Last Name', 'Status', 'Subscribed At'];
    const rows = subscribers.map((s) => [
      s.email,
      s.firstName || '',
      s.lastName || '',
      s.isActive ? 'Active' : 'Unsubscribed',
      new Date(s.subscribedAt).toISOString().split('T')[0],
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportLoading(false);
  };

  const toggleStatus = async (id: string) => {
    const sub = subscribers.find((s) => s.id === id);
    if (!sub) return;
    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${id}/toggle`, { method: 'POST' });
      if (res.ok) {
        setSubscribers((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  isActive: !s.isActive,
                  unsubscribedAt: s.isActive ? new Date() : null,
                }
              : s
          )
        );
      }
    } catch (e) {
      setSubscribers((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                isActive: !s.isActive,
                unsubscribedAt: s.isActive ? new Date() : null,
              }
            : s
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subscriber?')) return;
    try {
      await fetch(`/api/admin/newsletter/subscribers/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-surface p-5">
          <div className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Total
          </div>
          <div className="font-display text-headline-lg text-on-surface">{subscribers.length}</div>
        </div>
        <div className="card-surface p-5">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
            Active
          </div>
          <div className="font-display text-headline-lg text-muted-ochre">{activeCount}</div>
        </div>
        <div className="card-surface p-5">
          <div className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Unsubscribed
          </div>
          <div className="font-display text-headline-lg text-on-surface-variant">{unsubscribedCount}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'ACTIVE', 'UNSUBSCRIBED'] as const).map((f, i) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded border font-label text-label-sm uppercase tracking-widest transition-colors ${
                filter === f
                  ? 'bg-deep-charcoal text-warm-ivory border-deep-charcoal'
                  : 'border-earth-brown/20 text-on-surface-variant hover:border-muted-ochre hover:text-muted-ochre'
              }`}
            >
              {f === 'ALL' ? 'All' : f === 'ACTIVE' ? 'Active' : 'Unsubscribed'}
              <span className="ml-1.5 opacity-70 text-[10px]">
                ({f === 'ALL' ? subscribers.length : f === 'ACTIVE' ? activeCount : unsubscribedCount})
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscribers..."
            className="input-field !w-64"
          />
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="px-4 py-2.5 border border-earth-brown/20 hover:bg-surface-container font-label text-label-sm uppercase tracking-widest rounded text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
          >
            {exportLoading ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-body-md min-w-[720px]">
            <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
              <tr>
                <th className="py-3 px-6 font-normal">Email</th>
                <th className="py-3 px-6 font-normal">Name</th>
                <th className="py-3 px-6 font-normal">Subscribed</th>
                <th className="py-3 px-6 font-normal">Status</th>
                <th className="py-3 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-brown/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-on-surface-variant">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-4 px-6 text-on-surface font-medium">{s.email}</td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {[s.firstName, s.lastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {formatDateShort(s.subscribedAt)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-1 font-label text-[10px] rounded uppercase tracking-wider ${
                          s.isActive
                            ? 'bg-muted-ochre/20 text-earth-brown border border-muted-ochre/30'
                            : 'bg-surface-container-high text-on-surface-variant border border-earth-brown/20'
                        }`}
                      >
                        {s.isActive ? 'ACTIVE' : 'UNSUBSCRIBED'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button
                        onClick={() => toggleStatus(s.id)}
                        className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest"
                      >
                        {s.isActive ? 'Unsubscribe' : 'Subscribe'}
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-error hover:opacity-80 font-label text-label-sm uppercase tracking-widest"
                      >
                        Delete
                      </button>
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
