import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';
import { getSitePageTemplate } from '@/lib/site-pages';

/**
 * Turns a built-in (code-designed) page into an editable CMS page.
 * The page is created as a DRAFT so nothing changes on the public site until
 * it is published from the Page Builder.
 */
export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json();
    const slug = String(body?.slug || '').replace(/^\/+/, '');
    const template = getSitePageTemplate(slug);

    if (!template) {
      return NextResponse.json({ message: 'That page is not in the site map.' }, { status: 400 });
    }

    const existing = await prisma.page.findUnique({
      where: { slug: template.slug },
      include: { sections: true },
    });

    if (existing) {
      if (existing.sections.length === 0) {
        await prisma.pageSection.createMany({
          data: template.sections.map((section, index) => ({
            pageId: existing.id,
            type: section.type as any,
            order: index,
            isVisible: true,
            content: section.content,
          })),
        });
        await createAuditLog('UPDATE', 'PAGE', existing.id, guard.session.user.id, {
          slug: template.slug,
          action: 'seeded sections',
        });
      }
      return NextResponse.json({ success: true, slug: existing.slug, created: false });
    }

    const page = await prisma.page.create({
      data: {
        title: template.title,
        slug: template.slug,
        description: template.summary,
        status: 'DRAFT',
        isHomepage: false,
      },
    });

    await prisma.pageSection.createMany({
      data: template.sections.map((section, index) => ({
        pageId: page.id,
        type: section.type as any,
        order: index,
        isVisible: true,
        content: section.content,
      })),
    });

    await createAuditLog('CREATE', 'PAGE', page.id, guard.session.user.id, {
      slug: template.slug,
      scaffoldedFrom: 'built-in page',
    });

    return NextResponse.json({ success: true, slug: page.slug, created: true });
  } catch (error) {
    return handleApiError(error, 'Failed to prepare this page for editing');
  }
}
