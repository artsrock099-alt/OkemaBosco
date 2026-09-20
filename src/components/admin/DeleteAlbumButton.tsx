'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAlbum } from '@/lib/actions';

type Props = { id: string; title: string; trackCount: number };

/** Two-step delete, so an album cannot disappear on a single stray click. */
export default function DeleteAlbumButton({ id, title, trackCount }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    setBusy(true);
    setError('');
    const result = await deleteAlbum(id);
    setBusy(false);

    if (!result.success) {
      setError(result.error || result.message || 'Could not delete the album.');
      return;
    }
    startTransition(() => {
      router.push('/admin/albums');
      router.refresh();
    });
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="px-4 py-2.5 border border-error/40 text-error font-label text-label-sm uppercase tracking-widest rounded hover:bg-error/5 transition-colors"
      >
        DELETE ALBUM
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <p className="font-body text-body-md text-on-surface">
        Delete <strong>{title}</strong>
        {trackCount > 0
          ? `? Its ${trackCount} track${trackCount === 1 ? '' : 's'} will be kept as standalone releases.`
          : '?'}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={remove}
          disabled={busy || pending}
          className="px-4 py-2.5 bg-error text-warm-ivory font-label text-label-sm uppercase tracking-widest rounded disabled:opacity-50"
        >
          {busy || pending ? 'Deleting…' : 'YES, DELETE IT'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={busy || pending}
          className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
      {error && <p className="font-body text-body-md text-error">{error}</p>}
    </div>
  );
}
