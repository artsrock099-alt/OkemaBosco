import Link from 'next/link';
import { prisma } from '@/lib/db';
import { createAlbum } from '@/lib/actions';
import AlbumForm from '@/components/admin/AlbumForm';

export const metadata = { title: 'New Album' };

export default async function AdminAlbumNewPage() {
  const media = await prisma.media
    .findMany({
      where: { type: 'IMAGE' },
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: { id: true, title: true, url: true },
    })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 flex-wrap font-label text-label-sm uppercase tracking-widest mb-3">
          <Link href="/admin/albums" className="text-muted-ochre hover:text-earth-brown">
            ← Albums
          </Link>
        </div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Music • New Album
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Add an album
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Create the release first, then assign tracks to it from the Music section.
        </p>
      </div>

      <AlbumForm action={createAlbum} media={media} submitLabel="CREATE ALBUM" />
    </div>
  );
}
