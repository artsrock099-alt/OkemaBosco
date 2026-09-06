import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json();
    const { title, slug, status, isHomepage, description } = body;

    if (!title || !slug) {
      return NextResponse.json({ message: 'Title and slug are required' }, { status: 400 });
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        status: status || 'DRAFT',
        isHomepage: Boolean(isHomepage),
        description: description || undefined,
      },
    });

    await createAuditLog('CREATE', 'PAGE', page.id, guard.session.user.id, {
      title: page.title,
      slug: page.slug,
    });

    return NextResponse.json({ success: true, id: page.id, slug: page.slug });
  } catch (error) {
    return handleApiError(error, 'Failed to create page');
  }
}
