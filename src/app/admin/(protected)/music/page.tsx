import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateShort, formatDuration } from '@/lib/utils';

export const metadata = { title: 'Music Library' };

const statusColors: Record<string, string> = {
  DRAFT: 'bg-surface-container-high text-on-surface-variant border border-earth-brown/20',
  PUBLISHED: 'bg-earth-brown/10 text-earth-brown',
};

export default async function AdminMusicPage() {
  const tracks = await prisma.music.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    take: 100,
    include: { album: { select: { title: true } } },
  });
  const items = tracks.length > 0
    ? tracks
    : [
        {
          id: 't1',
          title: 'Nabiryo Nakazadde',
          slug: 'nabiryo-nakazadde',
          status: 'PUBLISHED' as const,
          isSingle: true,
          order: 1,
          duration: 245,
          audioUrl: '#',
          createdAt: new Date(),
          album: { title: 'Single Release' },
        },
        {
          id: 't2',
          title: 'Engoma Y\'Oluganda',
          slug: 'engoma-oluganda',
          status: 'PUBLISHED' as const,
          isSingle: false,
          order: 1,
          duration: 312,
          audioUrl: '#',
          createdAt: new Date(),
          album: { title: 'Roots of Uganda' },
        },
      ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
            Music • Tracks
          </div>
          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
            Music Library
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Manage tracks, singles and releases. Assign to albums, add streaming platform links and control publication.
          </p>
        </div>
        <Link
          href="/admin/music/new"
          className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
        >
          + Add Track
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-surface p-4">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Total Tracks</div>
          <div className="font-display text-headline-lg text-on-surface">{items.length}</div>
        </div>
        <div className="card-surface p-4">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Published</div>
          <div className="font-display text-headline-lg text-muted-ochre">{items.filter(t => t.status === 'PUBLISHED').length}</div>
        </div>
        <div className="card-surface p-4">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Singles</div>
          <div className="font-display text-headline-lg text-earth-brown">{items.filter((t: any) => t.isSingle).length}</div>
        </div>
        <div className="card-surface p-4">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Runtime</div>
          <div className="font-display text-headline-lg text-on-surface">
            {formatDuration(items.reduce((a, b: any) => a + (b.duration || 0), 0))}
          </div>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-body-md min-w-[900px]">
            <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
              <tr>
                <th className="py-3 px-6 font-normal">#</th>
                <th className="py-3 px-6 font-normal">Track</th>
                <th className="py-3 px-6 font-normal">Album</th>
                <th className="py-3 px-6 font-normal">Duration</th>
                <th className="py-3 px-6 font-normal">Status</th>
                <th className="py-3 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-brown/10">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-on-surface-variant">
                    No tracks yet. Add your first release above.
                  </td>
                </tr>
              ) : (
                items.map((t: any, idx) => (
                  <tr key={t.id} className="hover:bg-surface-container/30 transition-colors group">
                    <td className="py-4 px-6 text-on-surface-variant font-label text-label-sm tabular-nums">
                      <span className="group-hover:hidden">{t.order || idx + 1}</span>
                      <span className="hidden group-hover:inline text-muted-ochre">▶</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-on-surface">{t.title}</div>
                      <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                        {t.slug}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {t.isSingle ? (
                        <span className="px-2 py-0.5 bg-muted-ochre/10 text-muted-ochre font-label text-[10px] rounded uppercase tracking-wider">
                          Single
                        </span>
                      ) : (
                        <span>{t.album?.title || '—'}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant font-label text-label-sm tabular-nums">
                      {formatDuration(t.duration || 0)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2 py-1 font-label text-[10px] rounded uppercase tracking-wider ${statusColors[t.status] || statusColors.DRAFT}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <Link href={`/admin/music/${t.id}/edit`} className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest">
                        Edit
                      </Link>
                      <Link href="/listen" target="_blank" className="text-on-surface-variant hover:text-on-surface font-label text-label-sm uppercase tracking-widest">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
