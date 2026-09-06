import { redirect } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { auth } from '@/lib/auth';
import { ALL_ADMIN_ROLES } from '@/lib/rbac';

export const metadata = {
  title: {
    default: 'Admin • Bosco Okema',
    template: '%s • Admin • Bosco Okema',
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) redirect('/admin/login');
  if (!ALL_ADMIN_ROLES.includes(session.user.role)) redirect('/admin/403');

  return (
    <SessionProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </SessionProvider>
  );
}
