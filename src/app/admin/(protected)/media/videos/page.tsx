import { prisma } from '@/lib/db';
import MediaManager from '@/components/admin/MediaManager';

export const metadata = { title: 'Video Library' };

export default async function AdminMediaVideosPage() {
  const videos = await prisma.media.findMany({
    where: { type: 'VIDEO' },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Media Library • Videos
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Video Library
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Performance footage, interviews, behind-the-scenes and promotional videos. Embed hosted videos directly into pages and articles.
        </p>
      </div>
      <MediaManager type="VIDEO" items={videos as any} />
    </div>
  );
}
