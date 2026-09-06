import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'CONTRIBUTOR'] as const;

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json();
    const { email, name, role, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }
    const normalizedRole = (role as string) || 'EDITOR';
    if (!ALLOWED_ROLES.includes(normalizedRole as any)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name || null,
        role: normalizedRole as any,
        password: hashedPassword,
      },
    });

    await createAuditLog('CREATE', 'USER', user.id, guard.session.user.id, { email: user.email });

    return NextResponse.json({ success: true, id: user.id });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ message: 'A user with that email already exists' }, { status: 409 });
    }
    return handleApiError(error, 'Failed to create user');
  }
}
