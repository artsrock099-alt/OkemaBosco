'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('admin@boscookema.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full bg-surface border border-earth-brown/20 p-4 font-body text-body-md text-on-surface focus:ring-0 focus:border-earth-brown outline-none transition-colors placeholder:text-outline-variant"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full bg-surface border border-earth-brown/20 p-4 font-body text-body-md text-on-surface focus:ring-0 focus:border-earth-brown outline-none transition-colors placeholder:text-outline-variant"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded font-body text-body-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex justify-center items-center font-label text-label-sm text-warm-ivory bg-deep-charcoal px-8 py-4 rounded-full hover:bg-muted-ochre transition-colors duration-300 uppercase tracking-widest cursor-pointer active:opacity-70 disabled:opacity-50"
      >
        {loading ? 'SIGNING IN...' : 'SIGN IN'}
      </button>
    </form>
  );
}
