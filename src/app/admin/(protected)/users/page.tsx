import { prisma } from '@/lib/db';
import UsersManager from '@/components/admin/UsersManager';

export const metadata = { title: 'Users & Roles' };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const defaultUsers = users.length > 0 ? users : [
    {
      id: '1',
      name: 'Bosco Okema',
      email: 'admin@boscookema.com',
      role: 'SUPER_ADMIN' as const,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          System • Users & Roles
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Users &amp; Permissions
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Manage team members and assign permission levels (RBAC). Role-based access controls are enforced server-side on every API route and server action.
        </p>
      </div>
      <UsersManager initialUsers={defaultUsers as any} />
    </div>
  );
}
