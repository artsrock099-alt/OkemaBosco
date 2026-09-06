'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent, type FormState } from '@/lib/actions';
import { slugify } from '@/lib/utils';

type Props = {
  categories: { id: string; name: string }[];
  mediaItems: { id: string; title: string; url: string }[];
  initial?: any;
  onSubmitAction?: any;
  submitLabel?: string;
};

export default function EventForm({
  categories,
  mediaItems,
  initial,
  onSubmitAction,
  submitLabel = 'Create Event',
}: Props) {
  const router = useRouter();
  const action = onSubmitAction || createEvent;
  const [state, formAction, isPending] = useFormState(action, {} as FormState);

  useEffect(() => {
    if (state?.success && !onSubmitAction) {
      router.push('/admin/events');
    }
  }, [state, router, onSubmitAction]);

  return (
    <form action={formAction} className="space-y-8 max-w-5xl">
      {state?.success && (
        <div className="p-4 bg-earth-brown/10 text-earth-brown rounded font-body text-body-md">
          ✓ Changes saved.
        </div>
      )}
      {state?.error && (
        <div className="p-4 bg-error-container text-on-error-container rounded font-body text-body-md">
          {state.message || state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Event Title *
            </label>
            <input
              name="title"
              type="text"
              required
              defaultValue={initial?.title}
              className="input-field text-headline-md font-headline"
              placeholder="e.g. Kampala Arts Festival — Main Stage"
              onBlur={(e) => {
                const slugField = document.querySelector('[name="slug"]') as HTMLInputElement;
                if (slugField && !slugField.value) {
                  slugField.value = slugify(e.currentTarget.value);
                }
              }}
            />
          </div>
          <div>
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Slug
            </label>
            <input
              name="slug"
              type="text"
              defaultValue={initial?.slug}
              className="input-field"
              placeholder="auto-generated"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Start Date *
              </label>
              <input
                name="startDate"
                type="date"
                required
                defaultValue={initial?.startDate ? new Date(initial.startDate).toISOString().split('T')[0] : undefined}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                End Date
              </label>
              <input
                name="endDate"
                type="date"
                defaultValue={initial?.endDate ? new Date(initial.endDate).toISOString().split('T')[0] : undefined}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Time
              </label>
              <input
                name="time"
                type="time"
                defaultValue={initial?.time}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Category
              </label>
              <select
                name="categoryId"
                defaultValue={initial?.categoryId}
                className="input-field appearance-none"
              >
                <option value="">— Select category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Short Description
            </label>
            <textarea
              name="shortDescription"
              rows={2}
              defaultValue={initial?.shortDescription}
              className="input-field resize-none"
              placeholder="1-2 sentences used on listings and cards"
            />
          </div>
          <div>
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Full Description
            </label>
            <textarea
              name="description"
              rows={8}
              defaultValue={initial?.description}
              className="input-field resize-y"
              placeholder="Full event description, lineup, programme notes, etc."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Ticket URL
              </label>
              <input
                name="ticketUrl"
                type="url"
                defaultValue={initial?.ticketUrl}
                className="input-field"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Registration URL
              </label>
              <input
                name="registrationUrl"
                type="url"
                defaultValue={initial?.registrationUrl}
                className="input-field"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Video URL (YouTube, Vimeo embed)
              </label>
              <input
                name="videoUrl"
                type="url"
                defaultValue={initial?.videoUrl}
                className="input-field"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Map URL
              </label>
              <input
                name="mapUrl"
                type="url"
                defaultValue={initial?.mapUrl}
                className="input-field"
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-surface p-5 space-y-4">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
              Location
            </div>
            <div>
              <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                Venue
              </label>
              <input
                name="venue"
                type="text"
                defaultValue={initial?.venue}
                className="input-field"
                placeholder="National Theatre Main Stage"
              />
            </div>
            <div>
              <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                City / Country
              </label>
              <input
                name="location"
                type="text"
                defaultValue={initial?.location}
                className="input-field"
                placeholder="Kampala, Uganda"
              />
            </div>
          </div>
          <div className="card-surface p-5 space-y-4">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
              Media
            </div>
            <div>
              <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                Featured Image ID
              </label>
              <input
                name="imageId"
                type="text"
                defaultValue={initial?.imageId}
                className="input-field"
                placeholder="From Media Library"
                list="media-list"
              />
              <datalist id="media-list">
                {mediaItems.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </datalist>
            </div>
          </div>
          <div className="card-surface p-5 space-y-4">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
              Visibility
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                name="isPublished"
                type="checkbox"
                defaultChecked={initial?.isPublished}
                className="w-4 h-4 accent-earth-brown"
              />
              <span className="font-body text-body-md text-on-surface">Published</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                name="isFeatured"
                type="checkbox"
                defaultChecked={initial?.isFeatured}
                className="w-4 h-4 accent-earth-brown"
              />
              <span className="font-body text-body-md text-on-surface">Featured (homepage)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-earth-brown/10">
        <Link href="/admin/events" className="btn-ghost">
          ← Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary disabled:opacity-50 !px-10"
        >
          {isPending ? 'SAVING...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
