import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateShort, formatFileSize } from '@/lib/utils';

export const metadata = { title: 'Media Library' };

const typeMeta = {
  IMAGE: { label: 'Photos', href: '/admin/media/photos', icon: '🖼️', desc: 'Images for hero, galleries and editorial' },
  VIDEO: { label: 'Videos', href: '/admin/media/videos', icon: '🎬', desc: 'Performance and promotional video' },
  AUDIO: { label: 'Audio', href: '/admin/media/audio', icon: '🎵', desc: 'Tracks, recordings and samples' },
  DOCUMENT: { label: 'Documents', href: '/admin/media/documents', icon: '📄', desc: 'Press kits, PDFs and files' },
} as const;

export default async function AdminMediaPage() {
  const [media, counts] = await Promise.all([
    prisma.media.findMany({ orderBy: { createdAt: 'desc' }, take: 24 }),
    prisma.media.groupBy({ by: ['type'], _count: { _all: true } }),
  ]);

  const total = media.length;
  const countByType = Object.fromEntries(counts.map((c) => [c.type, c._count._all]));
  const totalAll = counts.reduce((acc, c) => acc + c._count._all, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
            Media Library
          </div>
          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Media Library</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Upload, organize and reuse images, videos, audio and documents across the site.
          </p>
        </div>
        <Link
          href="/admin/media/photos"
          className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
        >
          ⬆ Upload Files
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(typeMeta).map(([type, meta]) => (
          <Link key={type} href={meta.href} className="card-surface p-5 hover:border-muted-ochre/40 transition-colors block">
            <div className="text-2xl mb-3">{meta.icon}</div>
            <div className="font-display text-headline-md text-on-surface">{countByType[type] || 0}</div>
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mt-1">{meta.label}</div>
            <div className="font-body text-body-sm text-on-surface-variant mt-2">{meta.desc}</div>
          </Link>
        ))}
      </div>

      <div className="card-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-earth-brown/10 flex justify-between items-center">
          <h2 className="font-headline text-headline-md text-on-surface">Recent Uploads</h2>
          <span className="font-label text-label-sm text-on-surface-variant">{totalAll} total items</span>
        </div>
        {total === 0 ? (
          <div className="p-10 text-center">
            <p className="font-body text-body-md text-on-surface-variant mb-4">
              No media uploaded yet. Photos, videos, audio and documents you upload will appear here
              and can be reused across the Page Builder, Events and Articles.
            </p>
            <Link href="/admin/media/photos" className="btn-primary inline-flex">
              Upload Your First File
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
            {media.map((m) => (
              <div key={m.id} className="group relative">
                <div className="relative aspect-square overflow-hidden bg-surface-container rounded cursor-pointer border border-earth-brown/10 hover:border-muted-ochre/40 transition-colors">
                  {m.type === 'IMAGE' && m.url ? (
                    <img src={m.url} alt={m.altText || m.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl bg-surface-container-low">
                      {typeMeta[m.type].icon}
                    </div>
                  )}
                </div>
                <div className="mt-2 min-w-0">
                  <div className="text-on-surface text-body-md truncate">{m.title}</div>
                  <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {typeMeta[m.type].label} • {m.size ? formatFileSize(m.size) : ''} • {formatDateShort(m.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
