'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * A small "Back" control for public pages. It returns to the previous page when
 * there is history to go back to, otherwise it falls back to the parent section
 * of the current route (for example /media/photos goes to /media).
 * Hidden on the homepage.
 */
export default function BackButton() {
  const pathname = usePathname() || '/';
  const router = useRouter();

  if (pathname === '/') return null;

  const parts = pathname.split('/').filter(Boolean);
  const fallback = parts.length > 1 ? `/${parts.slice(0, -1).join('/')}` : '/';

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallback);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Go back to the previous page"
      className="fixed left-4 md:left-8 top-20 md:top-24 z-40 inline-flex items-center gap-2 rounded-full border border-earth-brown/25 bg-surface/85 backdrop-blur-md px-3.5 py-2 font-label text-label-sm uppercase tracking-widest text-on-surface-variant shadow-sm transition-colors hover:border-muted-ochre hover:text-muted-ochre"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}
