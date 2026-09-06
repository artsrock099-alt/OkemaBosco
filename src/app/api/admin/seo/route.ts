import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';
import type { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json();
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ message: 'Site settings not found' }, { status: 404 });
    }

    const current = (settings.seo as Record<string, unknown>) || {};
    const seo = { ...current, ...body };

    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: { seo: seo as Prisma.InputJsonValue },
    });

    await createAuditLog('UPDATE', 'SEO', settings.id, guard.session.user.id, {
      fields: Object.keys(body),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to save SEO settings');
  }
}
