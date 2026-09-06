'use client';

import { useState } from 'react';
import { formatDateShort } from '@/lib/utils';

type Campaign = {
  id: string;
  subject: string;
  previewText: string | null;
  content: string | null;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT';
  scheduledAt: Date | null;
  sentAt: Date | null;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  createdAt: Date;
  updatedAt: Date;
};

type Props = {
  initialCampaigns: Campaign[];
  subscriberCount: number;
};

const statusColors: Record<string, string> = {
  DRAFT: 'bg-surface-container-high text-on-surface-variant border border-earth-brown/20',
  SCHEDULED: 'bg-warm-ivory text-earth-brown border border-muted-ochre/30',
  SENDING: 'bg-muted-ochre/20 text-earth-brown border border-muted-ochre/30',
  SENT: 'bg-earth-brown/10 text-earth-brown',
};

export default function NewsletterCampaignsManager({ initialCampaigns, subscriberCount }: Props) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'SCHEDULED' | 'SENT'>('ALL');

  const filtered = campaigns.filter((c) => filter === 'ALL' ? true : c.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 min-w-[300px]">
          <div className="card-surface p-4">
            <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Total Campaigns</div>
            <div className="font-display text-headline-md text-on-surface">{campaigns.length}</div>
          </div>
          <div className="card-surface p-4">
            <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Subscribers</div>
            <div className="font-display text-headline-md text-muted-ochre">{subscriberCount}</div>
          </div>
          <div className="card-surface p-4">
            <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Drafts</div>
            <div className="font-display text-headline-md text-on-surface">{campaigns.filter(c => c.status === 'DRAFT').length}</div>
          </div>
          <div className="card-surface p-4">
            <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Sent</div>
            <div className="font-display text-headline-md text-earth-brown">{campaigns.filter(c => c.status === 'SENT').length}</div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
        >
          + New Campaign
        </button>
      </div>

      {showForm && (
        <CampaignForm
          onClose={() => setShowForm(false)}
          onSuccess={(c) => {
            setCampaigns((prev) => [c, ...prev]);
            setShowForm(false);
          }}
        />
      )}

      <div className="flex flex-wrap gap-2">
        {(['ALL', 'DRAFT', 'SCHEDULED', 'SENT'] as const).map((f, i) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded border font-label text-label-sm uppercase tracking-widest transition-colors ${
              filter === f
                ? 'bg-deep-charcoal text-warm-ivory border-deep-charcoal'
                : 'border-earth-brown/20 text-on-surface-variant hover:border-muted-ochre hover:text-muted-ochre'
            }`}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-body-md min-w-[900px]">
            <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
              <tr>
                <th className="py-3 px-6 font-normal">Subject</th>
                <th className="py-3 px-6 font-normal">Status</th>
                <th className="py-3 px-6 font-normal">Scheduled / Sent</th>
                <th className="py-3 px-6 font-normal text-right">Sent</th>
                <th className="py-3 px-6 font-normal text-right">Opened</th>
                <th className="py-3 px-6 font-normal text-right">Clicked</th>
                <th className="py-3 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-brown/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-on-surface-variant">
                    No campaigns yet — create your first above.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-on-surface">{c.subject}</div>
                      {c.previewText && (
                        <div className="font-label text-label-sm text-on-surface-variant mt-1 line-clamp-1">
                          {c.previewText}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2 py-1 font-label text-[10px] rounded uppercase tracking-wider ${statusColors[c.status] || statusColors.DRAFT}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {c.sentAt ? formatDateShort(c.sentAt) : c.scheduledAt ? formatDateShort(c.scheduledAt) : '—'}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-on-surface">{c.totalSent}</td>
                    <td className="py-4 px-6 text-right text-muted-ochre">
                      {c.totalSent > 0 ? `${Math.round((c.totalOpened / c.totalSent) * 100)}%` : '—'}
                    </td>
                    <td className="py-4 px-6 text-right text-earth-brown">
                      {c.totalSent > 0 ? `${Math.round((c.totalClicked / c.totalSent) * 100)}%` : '—'}
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      {c.status === 'DRAFT' && (
                        <button className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest">
                          Send
                        </button>
                      )}
                      <button className="text-on-surface-variant hover:text-on-surface font-label text-label-sm uppercase tracking-widest">
                        Edit
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

function CampaignForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (c: Campaign) => void;
}) {
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = fd.get('subject') as string;
    const previewText = fd.get('previewText') as string;
    const content = fd.get('content') as string;

    if (!subject || !content) {
      setMsg({ type: 'err', text: 'Subject and content are required.' });
      return;
    }

    try {
      const res = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, previewText, content }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setMsg({ type: 'ok', text: 'Campaign created as draft.' });
        setTimeout(() => {
          onSuccess({
            id: data.id || Math.random().toString(36).slice(2),
            subject,
            previewText,
            content,
            status: 'DRAFT',
            scheduledAt: null,
            sentAt: null,
            totalSent: 0,
            totalOpened: 0,
            totalClicked: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }, 600);
      } else {
        setMsg({ type: 'err', text: data.message || 'Failed to create campaign.' });
      }
    } catch (err) {
      const newCampaign: Campaign = {
        id: Math.random().toString(36).slice(2),
        subject,
        previewText,
        content,
        status: 'DRAFT',
        scheduledAt: null,
        sentAt: null,
        totalSent: 0,
        totalOpened: 0,
        totalClicked: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      onSuccess(newCampaign);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-6 space-y-5 border-2 border-muted-ochre/20">
      <div className="flex justify-between items-center">
        <h3 className="font-headline text-headline-md text-on-surface">New Newsletter Campaign</h3>
        <button type="button" onClick={onClose} className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface">
          ✕ Close
        </button>
      </div>
      {msg && (
        <div className={`p-3 rounded font-body text-sm ${msg.type === 'ok' ? 'bg-earth-brown/10 text-earth-brown' : 'bg-error-container text-on-error-container'}`}>
          {msg.text}
        </div>
      )}
      <div>
        <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Subject Line *</label>
        <input name="subject" type="text" required className="input-field" placeholder="Something that gets opened..." />
      </div>
      <div>
        <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Preview Text</label>
        <input name="previewText" type="text" className="input-field" placeholder="Short preview line shown in inbox..." />
      </div>
      <div>
        <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Email Content *</label>
        <textarea
          name="content"
          rows={12}
          required
          className="input-field resize-y font-mono text-sm"
          placeholder="Write your email content here. HTML supported."
        />
      </div>
      <div className="flex justify-end gap-3 pt-3 border-t border-earth-brown/10">
        <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        <button type="submit" className="btn-primary !px-8">Save as Draft</button>
      </div>
    </form>
  );
}
