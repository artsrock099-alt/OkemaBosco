import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Sign in to the Bosco Okema admin dashboard.',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-deep-charcoal text-warm-ivory flex flex-col md:flex-row">
      {/* Brand / Hero Side */}
      <div className="md:w-1/2 relative flex flex-col justify-between p-8 md:p-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-deep-charcoal via-deep-charcoal/60 to-deep-charcoal" />
        </div>
        <div className="relative z-10">
          <Link href="/" className="font-display text-headline-lg text-warm-ivory tracking-tighter">
            BOSCO OKEMA
          </Link>
        </div>
        <div className="relative z-10 max-w-md my-16">
          <h1 className="font-display text-headline-lg-mobile md:text-display-lg-mobile text-warm-ivory leading-tight tracking-tight mb-6">
            The stage management is behind the curtain.
          </h1>
          <p className="font-body text-body-md text-surface-variant leading-relaxed">
            Welcome back. Sign in to manage events, bookings, content and everything that keeps
            the music playing.
          </p>
        </div>
        <div className="relative z-10 font-label text-label-sm text-surface-variant opacity-80 uppercase tracking-widest">
          © {new Date().getFullYear()} BOSCO OKEMA
        </div>
      </div>

      {/* Form Side */}
      <div className="md:w-1/2 bg-surface text-on-surface flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
              ADMIN PORTAL
            </div>
            <h2 className="font-display text-headline-lg text-on-surface tracking-tight leading-tight mb-2">
              Welcome back.
            </h2>
            <p className="font-body text-body-md text-on-surface-variant">
              Sign in with your administrator credentials.
            </p>
          </div>
          <Suspense fallback={<div className="py-8 text-center text-on-surface-variant">Loading…</div>}>
            <LoginForm />
          </Suspense>
          <div className="mt-10 p-5 bg-surface-container border border-earth-brown/10">
            <div className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Demo credentials
            </div>
            <p className="font-body text-body-md text-on-surface mb-1">
              <span className="font-label text-muted-ochre">Email:</span> admin@boscookema.com
            </p>
            <p className="font-body text-body-md text-on-surface">
              <span className="font-label text-muted-ochre">Password:</span> admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
