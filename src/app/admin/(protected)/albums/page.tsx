import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateShort } from '@/lib/utils';

export const metadata = { title: 'Albums' };

export default async function AdminAlbumsPage() {
  const albums = await prisma.album.findMany({
    orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
    include: { _count: { select: { music: true } } },
  });

  const items = albums.length > 0
    ? albums
    : [
        {
          id: 'a1',
          title: 'Roots of Uganda',
          slug: 'roots-of-uganda',
          year: 2024,
          _count: { music: 8 },
          cover: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a2',
          title: 'Live at the National Theatre',
          slug: 'live-national-theatre',
          year: 2023,
          _count: { music: 12 },
          cover: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
            Music • Albums
          </div>
          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
            Albums &amp; Releases
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Manage albums, EPs and collections. Assign tracks, upload cover art and set release details.
          </p>
        </div>
        <Link
          href="/admin/albums/new"
          className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
        >
          + New Album
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((a: any) => (
          <div key={a.id} className="card-surface p-5 flex flex-col md:flex-row gap-5 hover:shadow-lg transition-all">
            <div className="w-full md:w-32 aspect-square rounded-lg bg-gradient-to-br from-earth-brown/20 via-muted-ochre/10 to-deep-charcoal/10 border border-earth-brown/15 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {a.cover?.url ? (
                <img src={a.cover.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl opacity-40">💿</span>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-label text-[10px] uppercase tracking-widest text-muted-ochre">
                    {a.year || '—'}
                  </span>
                </div>
                <h3 className="font-headline text-headline-md text-on-surface tracking-tight leading-tight">
                  {a.title}
                </h3>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                  {a._count.music} track{a._count.music !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4 mt-auto">
                <Link href={`/admin/albums/${a.id}/edit`} className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest">
                  Edit
                </Link>
                <Link href="/listen" target="_blank" className="text-on-surface-variant hover:text-on-surface font-label text-label-sm uppercase tracking-widest">
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
