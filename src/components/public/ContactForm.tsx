'use client';

import { useState } from 'react';
import { contactSchema } from '@/lib/validations';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Capture the form element up-front — React nulls `e.currentTarget`
    // after the first await, so referencing it later throws.
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() || '';
        errs[key] = issue.message;
      });
      setErrors(errs);
      return;
    }

    setErrors({});
    setState('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (res.ok) {
        setState('success');
        form.reset();
      } else {
        const d = await res.json().catch(() => ({}));
        setMessage(d.message || 'Something went wrong. Please try again.');
        setState('error');
      }
    } catch {
      setMessage('Network error. Please try again.');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-earth-brown/10 text-muted-ochre flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-headline text-headline-md text-on-surface mb-3">
          Message sent — thank you!
        </h3>
        <p className="font-body text-body-md text-on-surface-variant mb-6">
          I usually respond within 2–3 business days.
        </p>
        <button
          onClick={() => setState('idle')}
          className="btn-ghost"
        >
          SEND ANOTHER MESSAGE →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Name *
          </label>
          <input name="name" type="text" className="input-field" required />
          {errors.name && <p className="mt-2 text-sm text-error">{errors.name}</p>}
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Organization
          </label>
          <input name="organization" type="text" className="input-field" />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Email *
          </label>
          <input name="email" type="email" className="input-field" required />
          {errors.email && <p className="mt-2 text-sm text-error">{errors.email}</p>}
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Phone
          </label>
          <input name="phone" type="tel" className="input-field" />
        </div>
      </div>
      <div>
        <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
          Subject *
        </label>
        <input name="subject" type="text" className="input-field" required />
        {errors.subject && <p className="mt-2 text-sm text-error">{errors.subject}</p>}
      </div>
      <div>
        <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
          Message *
        </label>
        <textarea name="message" rows={6} className="input-field resize-none" required />
        {errors.message && <p className="mt-2 text-sm text-error">{errors.message}</p>}
      </div>

      {state === 'error' && (
        <div className="p-4 bg-error-container text-on-error-container rounded font-body text-body-md">
          {message || 'Something went wrong.'}
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
      </button>
    </form>
  );
}
