import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ALL_ADMIN_ROLES } from '@/lib/rbac';
import { prisma } from '@/lib/db';
import { storeFile, getMediaType, getImageDimensions } from '@/lib/storage';
import { createAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !ALL_ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const fileEntry = formData.get('file');
    const title = (formData.get('title') as string) || '';
    const folderId = (formData.get('folderId') as string) || undefined;
    const altText = (formData.get('altText') as string) || undefined;
    const description = (formData.get('description') as string) || undefined;
    const credit = (formData.get('credit') as string) || undefined;

    if (!fileEntry || !(fileEntry instanceof File)) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    if (fileEntry.size > 100 * 1024 * 1024) {
      return NextResponse.json({ message: 'File too large (max 100MB)' }, { status: 400 });
    }

    const arrayBuffer = await fileEntry.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const stored = await storeFile(buffer, fileEntry.name, fileEntry.type);
    const type = getMediaType(fileEntry.type);

    const dimensions = type === 'IMAGE' ? getImageDimensions(buffer) : {};

    const media = await prisma.media.create({
      data: {
        type,
        title: title || fileEntry.name,
        filename: stored.filename,
        url: stored.url,
        mimeType: stored.mimeType,
        size: stored.size,
        width: dimensions.width,
        height: dimensions.height,
        altText,
        description,
        credit,
        folderId,
      },
    });

    await createAuditLog(
      'CREATE',
      'MEDIA',
      media.id,
      session.user.id,
      {
        filename: media.filename,
        type: media.type,
        size: media.size,
      }
    );

    return NextResponse.json({
      success: true,
      media: {
        id: media.id,
        url: media.url,
        title: media.title,
        type: media.type,
        width: media.width,
        height: media.height,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session || !ALL_ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { folder: true },
    });
    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error('Media list error:', error);
    return NextResponse.json({ message: 'Failed to load media' }, { status: 500 });
  }
}
