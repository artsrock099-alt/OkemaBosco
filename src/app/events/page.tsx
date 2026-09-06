import type { Metadata } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import { getUpcomingEvents, getPastEvents } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'View upcoming and past performances, concerts, workshops, and cultural events with Bosco Okema.',
};

type EventRowData = {
  id: string;
  slug: string;
  title: string;
  startDate: Date;
  time?: string | null;
  venue?: string | null;
  location?: string | null;
  shortDescription?: string | null;
  category?: { name: string } | null;
};

function EventRow({ event }: { event: EventRowData }) {
  const start = new Date(event.startDate);
  const month = format(start, 'MMM').toUpperCase();
  const day = format(start, 'd');
  const year = format(start, 'yyyy');
  const meta = [event.time, event.venue || event.location].filter(Boolean).join(' • ');

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-8 py-8 md:py-10 items-start border-b border-earth-brown/15">
      <div className="col-span-12 md:col-span-3 lg:col-span-2 flex items-baseline gap-3 md:flex-col md:items-start md:gap-0">
        <span className="font-label text-label-sm text-muted-ochre uppercase tracking-widest">
          {month}
        </span>
        <span className="font-display text-headline-lg md:text-display-lg text-on-surface leading-none">
          {day}
        </span>
        <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-widest md:mt-2">
          {year}
        </span>
      </div>

      <div className="col-span-12 md:col-span-9 lg:col-span-10">
        {event.category && (
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
            {event.category.name}
          </div>
        )}
        <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight leading-tight">
          <Link href={`/events/${event.slug}`} className="hover:text-muted-ochre transition-colors">
            {event.title}
          </Link>
        </h2>
        {event.shortDescription && (
          <p className="font-body text-body-md text-on-surface-variant mt-3 max-w-2xl line-clamp-2">
            {event.shortDescription}
          </p>
        )}
        {meta && (
          <div className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant mt-4">
            {meta}
          </div>
        )}
        <Link
          href={`/events/${event.slug}`}
          className="inline-block font-label text-label-sm uppercase tracking-widest text-muted-ochre hover:underline mt-4"
        >
          View Event →
        </Link>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card-surface p-14 md:p-20 text-center rounded-xl">
      <h3 className="font-headline text-headline-md text-on-surface mb-3">
        No events scheduled yet.
      </h3>
      <p className="font-body text-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
        Check back soon for upcoming performances — or bring Bosco to your community.
      </p>
      <Link href="/book" className="btn-primary">
        BOOK BOSCO
      </Link>
    </div>
  );
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(20),
    getPastEvents(20),
  ]);

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-deep-charcoal text-warm-ivory">
        <div className="container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            EVENTS
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6">
            Performances & Engagements
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mx-auto">
            From intimate community gatherings to festival stages — find out where Bosco is
            performing next.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <div className="flex items-end justify-between mb-4 border-b border-earth-brown/30 pb-5">
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Upcoming Events
            </h2>
            <span className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
              {upcoming.length} {upcoming.length === 1 ? 'event' : 'events'}
            </span>
          </div>

          {upcoming.length > 0 ? (
            <div className="border-t border-earth-brown/15">
              {upcoming.map((ev) => (
                <EventRow key={ev.id} event={ev} />
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState />
            </div>
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="section-y bg-surface-container">
          <div className="container-x">
            <div className="flex items-end justify-between mb-4 border-b border-earth-brown/30 pb-5">
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                Past Events
              </h2>
              <span className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
                {past.length} {past.length === 1 ? 'event' : 'events'}
              </span>
            </div>
            <div className="border-t border-earth-brown/15">
              {past.map((ev) => (
                <EventRow key={ev.id} event={ev} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-y">
        <div className="container-x text-center">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8 max-w-2xl mx-auto">
            Want Bosco at your next event?
          </h2>
          <Link href="/book" className="btn-primary">
            BOOK BOSCO
          </Link>
        </div>
      </section>
    </>
  );
}
