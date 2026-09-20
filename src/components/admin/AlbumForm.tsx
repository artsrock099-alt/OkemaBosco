'use client';

import { useFormState } from 'react-dom';
import type { FormState } from '@/lib/actions';

type MediaOption = { id: string; title: string; url: string };

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  media: MediaOption[];
  initial?: {
    id: string;
    title: string;
    slug: string;
    year: number | null;
    coverId: string | null;
  } | null;
  submitLabel: string;
};

/**
 * Create / edit form for an album. The tracks themselves are managed from the
 * Music section; this only covers the release itself.
 */
export default function AlbumForm({ action, media, initial = null, submitLabel }: Props) {
  const [state, formAction, pending] = useFormState(action, {} as FormState);

  return (
    <form action={formAction} className="card-surface p-6 md:p-8 space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          <div>
            <label
              htmlFor="album-title"
              className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2"
            >
              Album title *
            </label>
            <input
              id="album-title"
              name="title"
              type="text"
              required
              defaultValue={initial?.title || ''}
              placeholder="Roots of Uganda"
              className="input-field font-display text-headline-md tracking-tight"
            />
          </div>

          <div>
            <label
              htmlFor="album-slug"
              className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2"
            >
              Web address
            </label>
            <input
              id="album-slug"
              name="slug"
              type="text"
              defaultValue={initial?.slug || ''}
              placeholder="left blank, built from the title"
              className="input-field"
            />
            <p className="font-body text-body-sm text-on-surface-variant mt-2">
              Optional. A duplicate address gets a number added automatically, so nothing is ever
              overwritten.
            </p>
          </div>

          <div>
            <label
              htmlFor="album-cover"
              className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2"
            >
              Cover artwork
            </label>
            <select
              id="album-cover"
              name="coverId"
              defaultValue={initial?.coverId || ''}
              className="input-field"
            >
              <option value="">No cover yet</option>
              {media.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
            <p className="font-body text-body-sm text-on-surface-variant mt-2">
              Upload new artwork under Media first, then pick it here.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="album-year"
              className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2"
            >
              Release year
            </label>
            <input
              id="album-year"
              name="year"
              type="number"
              min={1900}
              max={2100}
              defaultValue={initial?.year ?? undefined}
              placeholder={String(new Date().getFullYear())}
              className="input-field"
            />
          </div>

          {initial && (
            <div className="p-4 bg-surface-container border border-earth-brown/10">
              <div className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-1">
                Link name
              </div>
              <div className="font-body text-body-sm text-on-surface break-all">
                {initial.slug}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-earth-brown/10">
        <button type="submit" disabled={pending} className="btn-primary !px-8 disabled:opacity-50">
          {pending ? 'Saving…' : submitLabel}
        </button>

        {state?.success && (
          <span className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
            {state.message || 'Saved'}
          </span>
        )}
        {!state?.success && state?.error && (
          <span className="font-body text-body-md text-error">{state.error}</span>
        )}
      </div>
    </form>
  );
}
