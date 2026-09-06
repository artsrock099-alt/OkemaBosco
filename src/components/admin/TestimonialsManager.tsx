'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import { createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/actions';
import { formatDateShort } from '@/lib/utils';

type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  organization?: string | null;
  role?: string | null;
  order: number;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: Date;
};

type Props = {
  testimonials: TestimonialItem[];
};

export default function TestimonialsManager({ testimonials }: Props) {
  const [items, setItems] = useState<TestimonialItem[]>(testimonials);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    const res = await deleteTestimonial(id);
    if (res.success) {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <p className="font-body text-body-md text-on-surface-variant">
            Manage testimonials from audiences, clients and communities.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
          }}
          className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
        >
          + Add Testimonial
        </button>
      </div>

      {showForm && !editingId && (
        <TestimonialForm
          onClose={() => setShowForm(false)}
          onSuccess={(t) => {
            setItems((prev) => [t, ...prev]);
            setShowForm(false);
          }}
        />
      )}

      {editingId && (
        <TestimonialForm
          initial={items.find((t) => t.id === editingId)}
          onClose={() => setEditingId(null)}
          onSuccess={(t) => {
            setItems((prev) => prev.map((x) => (x.id === t.id ? { ...t, createdAt: x.createdAt } : x)));
            setEditingId(null);
          }}
          isEditing
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full card-surface p-16 text-center">
            <h3 className="font-headline text-headline-md text-on-surface mb-3">
              No testimonials yet.
            </h3>
            <p className="font-body text-body-md text-on-surface-variant mb-6 max-w-xl mx-auto">
              Add your first testimonial above — they will appear across the public site homepage, events page and booking flow.
            </p>
          </div>
        ) : (
          items.map((t) => (
            <div
              key={t.id}
              className={`card-surface p-6 flex flex-col gap-4 ${
                !t.isVisible ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap gap-2">
                  {t.isFeatured && (
                    <span className="px-2 py-0.5 bg-muted-ochre/10 text-muted-ochre font-label text-[10px] rounded uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                  {!t.isVisible && (
                    <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant font-label text-[10px] rounded uppercase tracking-wider">
                      Hidden
                    </span>
                  )}
                </div>
                <span className="font-label text-label-sm text-on-surface-variant">
                  {formatDateShort(t.createdAt)}
                </span>
              </div>
              <blockquote className="font-body text-body-md text-on-surface line-clamp-5 whitespace-pre-wrap">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-auto pt-4 border-t border-earth-brown/10 space-y-1">
                <div className="font-headline text-body-lg text-on-surface">{t.name}</div>
                {t.role && (
                  <div className="font-label text-label-sm text-on-surface-variant">{t.role}</div>
                )}
                {t.organization && (
                  <div className="font-label text-label-sm text-muted-ochre uppercase tracking-wider">
                    {t.organization}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setEditingId(t.id);
                    setShowForm(false);
                  }}
                  className="font-label text-label-sm uppercase tracking-widest text-muted-ochre hover:text-earth-brown"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="font-label text-label-sm uppercase tracking-widest text-error hover:opacity-80 ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TestimonialForm({
  initial,
  onClose,
  onSuccess,
  isEditing = false,
}: {
  initial?: TestimonialItem | undefined;
  onClose: () => void;
  onSuccess: (t: TestimonialItem) => void;
  isEditing?: boolean;
}) {
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const boundAction = isEditing && initial
    ? (prev: any, fd: FormData) => updateTestimonial(initial.id, prev, fd)
    : createTestimonial;

  const [state, formAction, isPending] = useFormState(boundAction as any, {});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res: any = await (boundAction as any)({}, fd);
    if (res?.success) {
      setMsg({ type: 'ok', text: res.message || 'Saved.' });
      setTimeout(() => {
        onSuccess({
          id: '1',
          quote: fd.get('quote') as string,
          name: fd.get('name') as string,
          organization: fd.get('organization') as string,
          role: fd.get('role') as string,
          order: parseInt(fd.get('order') as string) || 0,
          isFeatured: fd.get('isFeatured') === 'on',
          isVisible: fd.get('isVisible') !== 'off',
          createdAt: new Date(),
        });
      }, 500);
    } else if (res?.error) {
      setMsg({ type: 'err', text: res.message || res.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-6 space-y-5 border-2 border-muted-ochre/20">
      <div className="flex justify-between items-center">
        <h3 className="font-headline text-headline-md text-on-surface">
          {isEditing ? 'Edit Testimonial' : 'New Testimonial'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
        >
          ✕ Close
        </button>
      </div>

      {msg && (
        <div
          className={`p-3 rounded font-body text-sm ${
            msg.type === 'ok'
              ? 'bg-earth-brown/10 text-earth-brown'
              : 'bg-error-container text-on-error-container'
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Quote *
          </label>
          <textarea
            name="quote"
            rows={4}
            defaultValue={initial?.quote}
            required
            className="input-field resize-y"
            placeholder="What did they say about Bosco's performance or program?"
          />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Person Name *
          </label>
          <input name="name" type="text" defaultValue={initial?.name} required className="input-field" />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Organization
          </label>
          <input
            name="organization"
            type="text"
            defaultValue={initial?.organization || undefined}
            className="input-field"
          />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Role / Title
          </label>
          <input name="role" type="text" defaultValue={initial?.role || undefined} className="input-field" />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Sort Order
          </label>
          <input
            name="order"
            type="number"
            defaultValue={initial?.order ?? 0}
            className="input-field"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-5 items-center pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            name="isFeatured"
            type="checkbox"
            defaultChecked={initial?.isFeatured}
            className="w-4 h-4 accent-earth-brown"
          />
          <span className="font-body text-body-md text-on-surface">Featured on homepage</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            name="isVisible"
            type="checkbox"
            defaultChecked={initial?.isVisible !== false}
            className="w-4 h-4 accent-earth-brown"
          />
          <span className="font-body text-body-md text-on-surface">Visible on site</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-earth-brown/10">
        <button type="button" onClick={onClose} className="btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-50 !px-8">
          {isPending ? 'SAVING...' : isEditing ? 'Update' : 'Add Testimonial'}
        </button>
      </div>
    </form>
  );
}
