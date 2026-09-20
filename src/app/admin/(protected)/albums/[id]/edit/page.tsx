import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { updateAlbum } from '@/lib/actions';
import AlbumForm from '@/components/admin/AlbumForm';
import DeleteAlbumButton from '@/components/admin/DeleteAlbumButton';

export const metadata = { title: 'Edit Album' };

type Props = { params: { id: string } };

export default async function AdminAlbumEditPage({ params }: Props) {
  const [album, media] = await Promise.all([
    prisma.album.findUnique({
      where: { id: params.id },
      include: { _count: { select: { music: true } }, music: { orderBy: { order: 'asc' } } },
    }),
    prisma.media
      .findMany({
        where: { type: 'IMAGE' },
        orderBy: { createdAt: 'desc' },
        take: 200,
        select: { id: true, title: true, url: true },
      })
      .catch(() => []),
  ]);

  if (!album) notFound();

  const updateWithId = updateAlbum.bind(null, album.id);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 flex-wrap font-label text-label-sm uppercase tracking-widest mb-3">
          <Link href="/admin/albums" className="text-muted-ochre hover:text-earth-brown">
            ← Albums
          </Link>
        </div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Music • Edit Album
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          {album.title}
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2">
          {album._count.music} track{album._count.music === 1 ? '' : 's'} assigned to this release.
        </p>
      </div>

      <AlbumForm
        action={updateWithId}
        media={media}
        submitLabel="SAVE CHANGES"
        initial={{
          id: album.id,
          title: album.title,
          slug: album.slug,
          year: album.year,
          coverId: album.coverId,
        }}
      />

      {album.music.length > 0 && (
        <div className="card-surface p-6 md:p-8 max-w-3xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            Tracks on this album
          </div>
          <ol className="space-y-2 font-body text-body-md text-on-surface">
            {album.music.map((track) => (
              <li key={track.id} className="flex items-center gap-3">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant w-6">
                  {track.order}
                </span>
                <span>{track.title}</span>
              </li>
            ))}
          </ol>
          <Link
            href="/admin/music"
            className="inline-block mt-5 font-label text-label-sm uppercase tracking-widest text-muted-ochre hover:text-earth-brown"
          >
            Manage tracks →
          </Link>
        </div>
      )}

      <div className="card-surface p-6 md:p-8 max-w-3xl border-error/20">
        <div className="font-label text-label-sm uppercase tracking-widest text-error mb-2">
          Delete album
        </div>
        <p className="font-body text-body-md text-on-surface-variant mb-5 max-w-xl">
          The album is removed. Any tracks on it are kept and simply become standalone releases, so
          nothing you have uploaded is lost.
        </p>
        <DeleteAlbumButton
          id={album.id}
          title={album.title}
          trackCount={album._count.music}
        />
      </div>
    </div>
  );
}
