'use client';

import { usePathname } from 'next/navigation';

/**
 * Renders the public Header + Footer only on public (non-admin) routes.
 * Admin and auth routes get a clean, chrome-free canvas so the admin
 * sidebar/topbar can stand on their own.
 */
export default function PublicFrame({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname() || '';
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="min-h-screen">{children}</main>
      {footer}
    </>
  );
}
