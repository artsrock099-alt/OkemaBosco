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
    const { title, slug, status, description, isHomepage } = body;

    if (slug) {
      const clash = await prisma.page.findFirst({
        where: { slug, NOT: { id: params.id } },
        select: { id: true },
      });
      if (clash) {
        return NextResponse.json({ message: 'Another page already uses that URL.' }, { status: 400 });
      }
    }

    if (isHomepage) {
      const current = await prisma.page.findFirst({
        where: { id: params.id },
        select: { id: true },
      });
      if (current) {
        await prisma.page.updateMany({
          where: { isHomepage: true, NOT: { id: params.id } },
          data: { isHomepage: false },
        });
      }
    }

    const page = await prisma.page.update({
      where: { id: params.id },
      data: {
        ...(title ? { title } : {}),
        ...(slug ? { slug } : {}),
        ...(status ? { status } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(isHomepage !== undefined ? { isHomepage: Boolean(isHomepage) } : {}),
      },
    });

    await createAuditLog('UPDATE', 'PAGE', page.id, guard.session.user.id, {
      slug: page.slug,
      status: page.status,
    });

    return NextResponse.json({ success: true, page: { id: page.id, slug: page.slug, status: page.status } });
  } catch (error) {
    return handleApiError(error, 'Failed to update page');
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    await prisma.page.delete({ where: { id: params.id } });
    await createAuditLog('DELETE', 'PAGE', params.id, guard.session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to delete page');
  }
}
