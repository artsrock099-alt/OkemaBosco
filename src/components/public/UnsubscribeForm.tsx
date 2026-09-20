'use client';

import { useState } from 'react';

type Props = { token: string };

/** Confirms (rather than performs on page load) an unsubscribe request. */
export default function UnsubscribeForm({ token }: Props) {
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async () => {
    setState('working');
    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState('error');
        setMessage(data.message || 'We could not unsubscribe this address.');
        return;
      }
      setState('done');
    } catch {
      setState('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (state === 'done') {
    return (
      <div className="space-y-3">
        <p className="font-body text-body-lg text-on-surface">
          You have been removed from the mailing list.
        </p>
        <p className="font-body text-body-md text-on-surface-variant">
          You will not receive any further newsletter emails. Booking and contact replies you
          started yourself are not affected.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="font-body text-body-md text-on-surface-variant">
        Click the button below and we will stop sending you the newsletter. Nothing else changes
        and there is no need to explain why.
      </p>
      <button
        type="button"
        onClick={submit}
        disabled={state === 'working'}
        className="btn-primary disabled:opacity-50"
      >
        {state === 'working' ? 'One moment…' : 'UNSUBSCRIBE ME'}
      </button>
      {state === 'error' && (
        <p className="font-body text-body-md text-error">{message}</p>
      )}
    </div>
  );
}
