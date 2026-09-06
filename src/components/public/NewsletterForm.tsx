'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { newsletterSchema } from '@/lib/validations';

type Props = {
  variant?: 'light' | 'dark';
};

export default function NewsletterForm({ variant = 'light' }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStatus('loading');

    try {
      newsletterSchema.shape.email.parse(email);

      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Subscription failed. Please try again.');
        setStatus('error');
      }
    } catch {
      setError('Please enter a valid email address.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          disabled={status === 'loading' || status === 'success'}
          className={cn(
            'w-full px-4 py-3 font-body text-body-md border rounded-full outline-none transition-colors',
            variant === 'light'
              ? 'bg-surface border-earth-brown/20 text-on-surface focus:border-muted-ochre placeholder:text-outline-variant'
              : 'bg-warm-ivory/10 border-surface-variant/30 text-warm-ivory focus:border-muted-ochre placeholder:text-surface-variant'
          )}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className={cn(
          'w-full font-label text-label-sm uppercase tracking-widest px-6 py-3 rounded-full transition-colors duration-300',
          variant === 'light'
            ? 'bg-primary text-on-primary hover:bg-muted-ochre disabled:opacity-50'
            : 'bg-warm-ivory text-deep-charcoal hover:bg-muted-ochre hover:text-white disabled:opacity-50'
        )}
      >
        {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed ✓' : 'Subscribe'}
      </button>
      {error && (
        <p className="font-body text-sm text-error">{error}</p>
      )}
      {status === 'success' && (
        <p className={cn(
          'font-body text-sm',
          variant === 'light' ? 'text-earth-brown' : 'text-muted-ochre'
        )}>
          Thank you for subscribing!
        </p>
      )}
    </form>
  );
}
