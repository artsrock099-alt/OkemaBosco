import { prisma } from '@/lib/db';
import MediaManager from '@/components/admin/MediaManager';

export const metadata = { title: 'Audio Library' };

export default async function AdminMediaAudioPage() {
  const audio = await prisma.media.findMany({
    where: { type: 'AUDIO' },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Media Library • Audio
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Audio Library
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Raw recordings, stems, samples, rehearsal takes and other audio assets. Use the Music module for published tracks and albums.
        </p>
      </div>
      <MediaManager type="AUDIO" items={audio as any} />
    </div>
  );
}
