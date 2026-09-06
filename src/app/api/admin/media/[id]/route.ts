import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';
import { deleteFile } from '@/lib/storage';

type Props = { params: { id: string } };

export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const media = await prisma.media.findUnique({ where: { id: params.id } });
    if (!media) {
      return NextResponse.json({ message: 'Media not found' }, { status: 404 });
    }

    await prisma.media.delete({ where: { id: params.id } });
    if (media.url) {
      await deleteFile(media.url).catch(() => {});
    }

    await createAuditLog('DELETE', 'MEDIA', params.id, guard.session.user.id, {
      filename: media.filename,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to delete media');
  }
}
