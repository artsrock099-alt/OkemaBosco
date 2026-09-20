import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';
import { getSiteImageSlot, publicPathForPage } from '@/lib/site-image-slots';

/** Save a picture for one section of the site. */
export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json();
    const key = String(body?.key || '').trim();
    const slot = getSiteImageSlot(key);
    if (!slot) {
      return NextResponse.json({ message: 'Unknown image slot.' }, { status: 400 });
    }

    const url = String(body?.url || '').trim() || null;
    const altText = String(body?.altText || '').trim() || null;

    const saved = await prisma.siteImage.upsert({
      where: { key },
      create: { key, pageSlug: slot.pageSlug, label: slot.label, url, altText },
      update: { pageSlug: slot.pageSlug, label: slot.label, url, altText },
    });

    await createAuditLog('UPDATE', 'SITE_IMAGE', saved.id, guard.session.user.id, {
      key,
      hasImage: Boolean(url),
    });

    revalidatePath(publicPathForPage(slot.pageSlug));
    return NextResponse.json({ success: true, image: saved });
  } catch (error) {
    return handleApiError(error, 'Failed to save the image');
  }
}

/** Reset one section back to the photograph the layout ships with. */
export async function DELETE(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json().catch(() => ({}));
    const key = String(body?.key || '').trim();
    const slot = getSiteImageSlot(key);
    if (!slot) {
      return NextResponse.json({ message: 'Unknown image slot.' }, { status: 400 });
    }

    await prisma.siteImage.deleteMany({ where: { key } });
    await createAuditLog('DELETE', 'SITE_IMAGE', key, guard.session.user.id, { key });

    revalidatePath(publicPathForPage(slot.pageSlug));
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to reset the image');
  }
}

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const images = await prisma.siteImage.findMany();
    return NextResponse.json({ success: true, images });
  } catch (error) {
    return handleApiError(error, 'Failed to load the site images');
  }
}
