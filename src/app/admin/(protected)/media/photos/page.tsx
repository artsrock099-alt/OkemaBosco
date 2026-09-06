import { prisma } from '@/lib/db';
import MediaManager from '@/components/admin/MediaManager';

export const metadata = { title: 'Photo Library' };

export default async function AdminMediaPhotosPage() {
  const photos = await prisma.media.findMany({
    where: { type: 'IMAGE' },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const defaultPhotos = photos.length > 0
    ? photos
    : [
        {
          id: 'p1',
          type: 'IMAGE' as const,
          title: 'Bosco on stage live',
          filename: 'bosco-stage.jpg',
          url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80',
          mimeType: 'image/jpeg',
          size: 1_200_000,
          width: 1200,
          height: 800,
          createdAt: new Date(),
        },
      ];

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Media Library • Photos
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Photo Library
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Photography for the site — portraits, performance shots, rehearsal and behind-the-scenes photos. Photos can be inserted anywhere in the Page Builder and CMS modules.
        </p>
      </div>
      <MediaManager type="IMAGE" items={defaultPhotos as any} />
    </div>
  );
}
