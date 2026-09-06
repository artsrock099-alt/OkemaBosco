import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json();
    const { navigationId, label, url, isExternal, order, isVisible, parentId } = body;

    if (!navigationId || !label || !url) {
      return NextResponse.json({ message: 'navigationId, label and url are required' }, { status: 400 });
    }

    const item = await prisma.navigationItem.create({
      data: {
        navigationId,
        label,
        url,
        isExternal: Boolean(isExternal),
        order: Number(order ?? 0),
        isVisible: isVisible !== false,
        parentId: parentId || undefined,
      },
    });

    await createAuditLog('CREATE', 'NAVIGATION_ITEM', item.id, guard.session.user.id, {
      label: item.label,
    });

    return NextResponse.json({ success: true, id: item.id });
  } catch (error) {
    return handleApiError(error, 'Failed to create navigation item');
  }
}
