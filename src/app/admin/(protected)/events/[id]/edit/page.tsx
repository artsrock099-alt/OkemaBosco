import { updateEvent } from '@/lib/actions';
import EventForm from '@/components/admin/EventForm';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit Event' };

type Props = { params: { id: string } };

export default async function EditEventPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
  });
  if (!event) notFound();

  const [categories, mediaItems] = await Promise.all([
    prisma.eventCategory.findMany({ orderBy: { name: 'asc' } }),
    prisma.media.findMany({
      where: { type: 'IMAGE' },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { id: true, title: true, url: true },
    }),
  ]);

  const editAction = (prev: any, formData: FormData) => updateEvent(event.id, prev, formData);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Edit Event
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2">
          Updating: <span className="text-on-surface font-medium">{event.title}</span>
        </p>
      </div>
      <EventForm
        categories={categories}
        mediaItems={mediaItems}
        initial={event}
        onSubmitAction={editAction as any}
        submitLabel="Save Changes"
      />
    </div>
  );
}
