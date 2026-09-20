import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';
import { publicPathForPage } from '@/lib/site-image-slots';

export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json();
    const pageSlug = String(body?.pageSlug || '').replace(/^\/+/, '');
    if (!pageSlug) {
      return NextResponse.json({ message: 'A page is required.' }, { status: 400 });
    }

    const imageUrl = String(body?.imageUrl || '').trim() || null;
    const videoUrl = String(body?.videoUrl || '').trim() || null;
    const overlayRaw = Number(body?.overlay);
    const overlay = Number.isFinite(overlayRaw) ? Math.min(Math.max(overlayRaw, 0), 95) : 50;

    const saved = await prisma.heroBackground.upsert({
      where: { pageSlug },
      create: { pageSlug, imageUrl, videoUrl, overlay },
      update: { imageUrl, videoUrl, overlay },
    });

    await createAuditLog('UPDATE', 'HERO_BACKGROUND', saved.id, guard.session.user.id, {
      pageSlug,
      hasImage: Boolean(imageUrl),
      hasVideo: Boolean(videoUrl),
    });

    revalidatePath(publicPathForPage(pageSlug));
    return NextResponse.json({ success: true, background: saved });
  } catch (error) {
    return handleApiError(error, 'Failed to save the hero background');
  }
}

export async function DELETE(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json().catch(() => ({}));
    const pageSlug = String(body?.pageSlug || '').replace(/^\/+/, '');
    if (!pageSlug) {
      return NextResponse.json({ message: 'A page is required.' }, { status: 400 });
    }

    await prisma.heroBackground.deleteMany({ where: { pageSlug } });
    await createAuditLog('DELETE', 'HERO_BACKGROUND', pageSlug, guard.session.user.id, { pageSlug });

    revalidatePath(publicPathForPage(pageSlug));
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to reset the hero background');
  }
}

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const backgrounds = await prisma.heroBackground.findMany();
    return NextResponse.json({ success: true, backgrounds });
  } catch (error) {
    return handleApiError(error, 'Failed to load hero backgrounds');
  }
}
