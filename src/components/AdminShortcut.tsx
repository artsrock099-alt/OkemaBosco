'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Global keyboard shortcut (Ctrl + Alt + B) that opens the admin sign-in page.
 * Mounted once in the root layout so it works from every page, then the
 * admin signs in to reach the dashboard.
 */
export default function AdminShortcut() {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCtrlAltB =
        e.ctrlKey &&
        e.altKey &&
        (e.key === 'b' || e.key === 'B');

      if (isCtrlAltB) {
        e.preventDefault();
        router.push('/admin/login');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [router]);

  return null;
}
