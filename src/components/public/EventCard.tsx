import Image from 'next/image';
import Link from 'next/link';
import { formatDateShort } from '@/lib/utils';
import type { Event, EventCategory, Media } from '@prisma/client';

type EventWithRelations = Event & {
  category?: EventCategory | null;
  image?: Media | null;
};

type Props = {
  event: EventWithRelations;
  variant?: 'default' | 'compact';
};

export function EventCard({ event, variant = 'default' }: Props) {
  const date = formatDateShort(event.startDate);
  const [month, day, year] = date.split(' ');

  if (variant === 'compact') {
    return (
      <Link
        href={`/events/${event.slug}`}
        className="flex gap-4 p-4 card-surface items-center group"
      >
        <div className="flex flex-col items-center justify-center min-w-[3rem] text-center">
          <span className="font-label text-label-sm text-muted-ochre uppercase">
            {month.replace(',', '')}
          </span>
          <span className="font-headline text-headline-md text-on-surface leading-none">{day}</span>
        </div>
        <div className="h-10 w-px bg-earth-brown/20" />
        <div className="flex-1 min-w-0">
          <h3 className="font-body text-body-md font-bold text-on-surface truncate group-hover:text-muted-ochre transition-colors">
            {event.title}
          </h3>
          <p className="font-label text-label-sm text-on-surface-variant mt-1 truncate">
            {event.venue || event.location}
            {event.time ? `, ${event.time}` : ''}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block overflow-hidden card-surface"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {event.image ? (
          <Image
            src={event.image.url}
            alt={event.image.altText || event.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
            <span className="font-display text-headline-md text-on-surface-variant">
              {event.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-warm-ivory text-deep-charcoal px-3 py-2 rounded">
          <div className="font-label text-label-sm uppercase leading-none">
            {month.replace(',', '')}
          </div>
          <div className="font-headline text-headline-md leading-none">{day}</div>
        </div>
      </div>
      <div className="p-6">
        {event.category && (
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
            {event.category.name}
          </div>
        )}
        <h3 className="font-headline text-headline-md text-on-surface mb-3 group-hover:text-muted-ochre transition-colors">
          {event.title}
        </h3>
        {event.shortDescription && (
          <p className="font-body text-body-md text-on-surface-variant line-clamp-2 mb-4">
            {event.shortDescription}
          </p>
        )}
        <div className="flex items-center gap-2 text-on-surface-variant font-body text-body-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{event.venue || event.location || 'Location TBA'}</span>
        </div>
      </div>
    </Link>
  );
}
