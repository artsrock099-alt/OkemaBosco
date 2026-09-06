import { auth } from './auth';
import type { Role } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.user.role)) redirect('/admin/403');
  return session;
}

export const ALL_ADMIN_ROLES: Role[] = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'BOOKING_MANAGER'];

export function hasPermission(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole);
}

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: [
    'pages:manage',
    'media:manage',
    'events:manage',
    'articles:manage',
    'bookings:manage',
    'payments:manage',
    'newsletter:manage',
    'users:manage',
    'settings:manage',
    'navigation:manage',
    'testimonials:manage',
    'education:manage',
    'music:manage',
  ],
  ADMIN: [
    'pages:manage',
    'media:manage',
    'events:manage',
    'articles:manage',
    'bookings:manage',
    'payments:view',
    'newsletter:manage',
    'settings:manage',
    'navigation:manage',
    'testimonials:manage',
    'education:manage',
    'music:manage',
  ],
  EDITOR: [
    'pages:edit',
    'media:manage',
    'events:manage',
    'articles:manage',
    'testimonials:manage',
    'education:edit',
    'music:manage',
  ],
  BOOKING_MANAGER: [
    'bookings:manage',
    'payments:view',
    'events:view',
  ],
};
