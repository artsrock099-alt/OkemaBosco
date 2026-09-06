'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePageForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [isHomepage, setIsHomepage] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const titleToSlug = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Page title is required.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug || titleToSlug(title),
          status,
          isHomepage,
          description,
        }),
      });
      const data = await res.json();
      if (res.ok || data.success) {
        router.push(`/admin/builder/${data.slug || slug || titleToSlug(title)}`);
        router.refresh();
      } else {
        setError(data.message || 'Failed to create page.');
      }
    } catch (err) {
      const s = slug || titleToSlug(title);
      router.push(`/admin/builder/${s}`);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-8 space-y-6 max-w-3xl border-2 border-muted-ochre/20">
      <div>
        <h3 className="font-headline text-headline-md text-on-surface mb-2">Create New Page</h3>
        <p className="font-body text-body-md text-on-surface-variant">
          Set up the basics first. Then you&apos;ll be dropped into the Page Builder where you can add sections.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded font-body text-body-md">
          {error}
        </div>
      )}

      <div>
        <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
          Page Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slug) setSlug(titleToSlug(e.target.value));
          }}
          required
          className="input-field text-headline-md font-display tracking-tight"
          placeholder="About, Gallery, Tour Dates..."
        />
      </div>

      <div>
        <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
          URL Slug
        </label>
        <div className="flex items-stretch">
          <div className="flex items-center px-4 bg-surface-container border border-r-0 border-earth-brown/20 font-body text-body-md text-on-surface-variant rounded-l">
            /
          </div>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
            className="input-field !rounded-l-none"
            placeholder="about-page"
          />
        </div>
      </div>

      <div>
        <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
          Description (internal &amp; SEO preview)
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field resize-y"
          placeholder="What is this page about? This is used for internal reference and meta description fallback."
        />
      </div>

      <div className="flex flex-wrap gap-8 items-start">
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-3">
            Status
          </label>
          <div className="flex gap-4">
            {(['DRAFT', 'PUBLISHED'] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === s}
                  onChange={() => setStatus(s)}
                  className="w-4 h-4 accent-earth-brown"
                />
                <span className="font-body text-body-md text-on-surface">
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </div>
        <label className="flex items-start gap-3 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={isHomepage}
            onChange={(e) => setIsHomepage(e.target.checked)}
            className="w-4 h-4 mt-1 accent-earth-brown"
          />
          <div>
            <span className="font-body text-body-md text-on-surface">Set as homepage</span>
            <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
              Replaces the current homepage with this page when published.
            </div>
          </div>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-earth-brown/10">
        <button type="button" onClick={() => router.push('/admin/pages')} className="btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary !px-10 disabled:opacity-50">
          {loading ? 'CREATING...' : 'Create & Open Builder'}
        </button>
      </div>
    </form>
  );
}
