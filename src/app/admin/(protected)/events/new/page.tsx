import EventForm from '@/components/admin/EventForm';
import { prisma } from '@/lib/db';

export const metadata = { title: 'Create Event' };

export default async function NewEventPage() {
  const [categories, mediaItems] = await Promise.all([
    prisma.eventCategory.findMany({ orderBy: { name: 'asc' } }),
    prisma.media.findMany({
      where: { type: 'IMAGE' },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { id: true, title: true, url: true },
    }),
  ]);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Create Event
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2">
          Add a new performance, workshop, festival or engagement.
        </p>
      </div>
      <EventForm categories={categories} mediaItems={mediaItems} />
    </div>
  );
}
