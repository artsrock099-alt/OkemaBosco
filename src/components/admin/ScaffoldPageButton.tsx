'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Creates (or seeds) the CMS page for a built-in route, then opens the builder.
 */
export default function ScaffoldPageButton({
  slug,
  label = 'Make editable',
  variant = 'solid',
}: {
  slug: string;
  label?: string;
  variant?: 'solid' | 'link';
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const run = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/pages/scaffold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (res.ok && data.slug) {
        router.push(`/admin/builder/${data.slug}`);
      } else {
        setError(data.message || 'Could not prepare this page.');
        setLoading(false);
      }
    } catch {
      setError('Could not prepare this page.');
      setLoading(false);
    }
  };

  if (variant === 'link') {
    return (
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest disabled:opacity-50"
      >
        {loading ? 'Preparing…' : label}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="px-3 py-2 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded disabled:opacity-50"
      >
        {loading ? 'Preparing…' : label}
      </button>
      {error && <span className="font-body text-body-sm text-error">{error}</span>}
    </span>
  );
}
