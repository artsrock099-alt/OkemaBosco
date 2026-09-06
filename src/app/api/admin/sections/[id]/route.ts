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
    const { content, settings, order, isVisible, type } = body;

    // Coerce string content into JSON when it looks like JSON, so the public
    // SectionRenderer can consume structured content.
    let resolvedContent = content;
    if (typeof content === 'string' && content.trim() !== '') {
      try {
        resolvedContent = JSON.parse(content);
      } catch {
        resolvedContent = content;
      }
    }

    const section = await prisma.pageSection.update({
      where: { id: params.id },
      data: {
        ...(resolvedContent !== undefined ? { content: resolvedContent } : {}),
        ...(settings !== undefined ? { settings } : {}),
        ...(order !== undefined ? { order: Number(order) } : {}),
        ...(isVisible !== undefined ? { isVisible } : {}),
        ...(type ? { type } : {}),
      },
    });

    await createAuditLog('UPDATE', 'PAGE_SECTION', section.id, guard.session.user.id, {
      type: section.type,
    });

    return NextResponse.json({ success: true, id: section.id });
  } catch (error) {
    return handleApiError(error, 'Failed to update section');
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    await prisma.pageSection.delete({ where: { id: params.id } });
    await createAuditLog('DELETE', 'PAGE_SECTION', params.id, guard.session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to delete section');
  }
}
