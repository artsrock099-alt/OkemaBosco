'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createArticle, type FormState } from '@/lib/actions';
import { slugify } from '@/lib/utils';

type Props = {
  categories: { id: string; name: string }[];
};

export default function NewArticleForm({ categories }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useFormState(createArticle, {} as FormState);

  useEffect(() => {
    if (state?.success && state?.data?.slug) {
      router.push(`/admin/articles/${state.data.id}/edit`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-8 max-w-4xl">
      {state?.success && state.data && (
        <div className="p-4 bg-earth-brown/10 text-earth-brown rounded font-body text-body-md">
          ✓ Article created.
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
              Title *
            </label>
            <input
              name="title"
              type="text"
              required
              className="input-field text-headline-md font-headline"
              placeholder="A meaningful title that captures the story"
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
            <input name="slug" type="text" className="input-field" placeholder="auto-generated-from-title" />
          </div>
          <div>
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Excerpt (short description)
            </label>
            <textarea
              name="excerpt"
              rows={2}
              className="input-field resize-none"
              placeholder="A one- or two-sentence summary used in previews"
            />
          </div>
          <div>
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Content
            </label>
            <textarea
              name="content"
              rows={16}
              className="input-field resize-y"
              placeholder="Write the full article here. Markdown and HTML content are accepted by the CMS."
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="card-surface p-5 space-y-4">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
              Publishing
            </div>
            <div>
              <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                Status
              </label>
              <select name="status" defaultValue="DRAFT" className="input-field appearance-none">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Publish now</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                Publish Date
              </label>
              <input name="publishDate" type="date" className="input-field" />
            </div>
          </div>
          <div className="card-surface p-5 space-y-4">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
              Classification
            </div>
            <div>
              <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                Category
              </label>
              <select name="categoryId" className="input-field appearance-none">
                <option value="">— Uncategorised —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                Featured Image ID (from Media Library)
              </label>
              <input
                name="featuredImageId"
                type="text"
                placeholder="e.g. clynabc123..."
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-earth-brown/10">
        <Link href="/admin/articles" className="btn-ghost">
          ← Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary disabled:opacity-50 !px-10"
        >
          {isPending ? 'SAVING...' : 'Create Article'}
        </button>
      </div>
    </form>
  );
}
