import { prisma } from '@/lib/db';
import MediaManager from '@/components/admin/MediaManager';

export const metadata = { title: 'Documents' };

export default async function AdminMediaDocumentsPage() {
  const docs = await prisma.media.findMany({
    where: { type: 'DOCUMENT' },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Media Library • Documents
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Documents &amp; Press Kits
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Press kits (EPKs), rider documents, contracts, technical specifications and other PDF or DOC assets available for download.
        </p>
      </div>
      <MediaManager type="DOCUMENT" items={docs as any} />
    </div>
  );
}
