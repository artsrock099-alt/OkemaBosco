import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateShort } from '@/lib/utils';

export const metadata = { title: 'New Track' };

export default async function AdminMusicNewPage() {
  const [albums, platforms] = await Promise.all([
    prisma.album.findMany({ orderBy: { year: 'desc' }, take: 50 }).catch(() => []),
    prisma.musicPlatform.findMany({ orderBy: { name: 'asc' } }).catch(() => []),
  ]);

  const albumsOk = albums.length > 0 ? albums : [
    { id: 'a1', title: 'Roots of Uganda', year: 2024 },
  ];
  const platformsOk = platforms.length > 0 ? platforms : [
    { id: '1', name: 'Spotify' },
    { id: '2', name: 'Apple Music' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 flex-wrap font-label text-label-sm uppercase tracking-widest mb-3">
          <Link href="/admin/music" className="text-muted-ochre hover:text-earth-brown">
            ← Music Library
          </Link>
        </div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Music • New Track
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Add New Track
        </h1>
      </div>

      <form className="card-surface p-6 md:p-8 space-y-6 border-2 border-muted-ochre/20" action="#">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-5">
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Track Title *</label>
              <input name="title" type="text" required className="input-field font-display text-headline-md tracking-tight" placeholder="Song / track title" />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Description / Credits</label>
              <textarea name="description" rows={4} className="input-field resize-y" placeholder="Writer credits, featured artists, recording info..." />
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Status</label>
              <select name="status" defaultValue="DRAFT" className="input-field">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Album</label>
              <select name="albumId" defaultValue="" className="input-field">
                <option value="">— Single / Standalone —</option>
                {albumsOk.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.title}{a.year ? ` (${a.year})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Track Order (in album)</label>
              <input name="order" type="number" defaultValue={1} className="input-field" />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Duration (seconds)</label>
              <input name="duration" type="number" placeholder="240" className="input-field" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-earth-brown/10">
          <h3 className="font-headline text-headline-md text-on-surface mb-4">Audio Files & Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Audio File</label>
              <input type="file" accept="audio/*" className="input-field" />
            </div>
            {platformsOk.map((p: any) => (
              <div key={p.id}>
                <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">{p.name} URL</label>
                <input type="url" name={`platform-${p.id}`} placeholder={`${p.name} link...`} className="input-field" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-earth-brown/10">
          <Link href="/admin/music" className="btn-ghost">Cancel</Link>
          <button type="submit" className="btn-primary !px-10">Save Track</button>
        </div>
      </form>
    </div>
  );
}
