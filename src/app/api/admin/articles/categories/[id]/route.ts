import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';

type Props = { params: { id: string } };

export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  try {
    await prisma.articleCategory.delete({ where: { id: params.id } });
    await createAuditLog('DELETE', 'ARTICLE_CATEGORY', params.id, guard.session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to delete article category');
  }
}
