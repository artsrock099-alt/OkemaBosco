import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json();
    const { pageId, type, order, content, settings, isVisible } = body;

    if (!pageId || !type) {
      return NextResponse.json({ message: 'pageId and type are required' }, { status: 400 });
    }

    const section = await prisma.pageSection.create({
      data: {
        pageId,
        type,
        order: Number(order ?? 0),
        isVisible: isVisible !== false,
        content: content ?? {},
        settings: settings ?? {},
      },
    });

    await createAuditLog('CREATE', 'PAGE_SECTION', section.id, guard.session.user.id, {
      pageId,
      type,
    });

    return NextResponse.json({ success: true, id: section.id });
  } catch (error) {
    return handleApiError(error, 'Failed to create section');
  }
}
