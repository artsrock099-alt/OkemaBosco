'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

/** Marks every notification as read, then refreshes the server data. */
export default function MarkAllReadButton({ count }: { count: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const markAll = async () => {
    setBusy(true);
    await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => undefined);
    setBusy(false);
    startTransition(() => router.refresh());
  };

  return (
    <button
      type="button"
      onClick={markAll}
      disabled={busy || pending}
      className="btn-primary !px-6 disabled:opacity-50"
    >
      {busy || pending ? 'Working…' : `MARK ${count} AS READ`}
    </button>
  );
}
