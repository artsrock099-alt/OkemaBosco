import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';

type Props = { params: { id: string } };

export async function PATCH(request: Request, { params }: Props) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json();
    const { label, url, isExternal, order, isVisible, parentId } = body;

    const data: Record<string, any> = {};
    if (label !== undefined) data.label = label;
    if (url !== undefined) data.url = url;
    if (isExternal !== undefined) data.isExternal = isExternal;
    if (order !== undefined) data.order = Number(order);
    if (isVisible !== undefined) data.isVisible = isVisible;
    if (parentId !== undefined) data.parentId = parentId || null;

    const item = await prisma.navigationItem.update({
      where: { id: params.id },
      data,
    });

    await createAuditLog('UPDATE', 'NAVIGATION_ITEM', item.id, guard.session.user.id, {
      label: item.label,
    });

    return NextResponse.json({ success: true, id: item.id });
  } catch (error) {
    return handleApiError(error, 'Failed to update navigation item');
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    await prisma.navigationItem.delete({ where: { id: params.id } });
    await createAuditLog('DELETE', 'NAVIGATION_ITEM', params.id, guard.session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to delete navigation item');
  }
}
