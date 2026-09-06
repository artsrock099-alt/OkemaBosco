import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';

type Props = { params: { id: string } };

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'CONTRIBUTOR'] as const;

export async function PATCH(request: Request, { params }: Props) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json();
    const { email, name, role, password } = body;

    const data: Record<string, any> = {};
    if (email) data.email = email.toLowerCase().trim();
    if (name !== undefined) data.name = name || null;
    if (role) {
      if (!ALLOWED_ROLES.includes(role as any)) {
        return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
      }
      data.role = role;
    }
    if (password) data.password = await bcrypt.hash(password as string, 10);

    const user = await prisma.user.update({
      where: { id: params.id },
      data,
    });

    await createAuditLog('UPDATE', 'USER', user.id, guard.session.user.id, { email: user.email });

    return NextResponse.json({ success: true, id: user.id });
  } catch (error) {
    return handleApiError(error, 'Failed to update user');
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const target = await prisma.user.findUnique({ where: { id: params.id } });
    if (!target) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    if (target.role === 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Cannot delete a super admin' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: params.id } });
    await createAuditLog('DELETE', 'USER', params.id, guard.session.user.id, {
      email: target.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to delete user');
  }
}
