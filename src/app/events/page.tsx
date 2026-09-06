import type { Metadata } from 'next';
import Link from 'next/link';
import { EventCard } from '@/components/public/EventCard';
import { getAllEvents, getUpcomingEvents, getPastEvents } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'View upcoming and past performances, concerts, workshops, and cultural events with Bosco Okema.',
};

export default async function EventsPage() {
  const [allEvents, upcoming, past] = await Promise.all([
    getAllEvents(),
    getUpcomingEvents(20),
    getPastEvents(20),
  ]);

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-surface-container">
        <div className="container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            EVENTS
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight leading-tight mb-6">
            Performances & Engagements
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            From intimate community gatherings to festival stages — find out where Bosco is
            performing next, and explore past events.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <div className="flex items-end justify-between mb-10 md:mb-14 border-b border-earth-brown/20 pb-4">
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Upcoming Events
            </h2>
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
              {upcoming.length} events
            </div>
          </div>

          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcoming.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          ) : (
            <div className="card-surface p-12 text-center">
              <h3 className="font-headline text-headline-md text-on-surface mb-3">
                No upcoming events scheduled yet.
              </h3>
              <p className="font-body text-body-md text-on-surface-variant">
                Check back soon, or{' '}
                <Link href="/book" className="text-muted-ochre hover:underline">
                  book Bosco
                </Link>{' '}
                for a private event.
              </p>
            </div>
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="section-y bg-surface-container">
          <div className="container-x">
            <div className="flex items-end justify-between mb-10 md:mb-14 border-b border-earth-brown/20 pb-4">
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                Past Events
              </h2>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
                {past.length} events
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {past.map((ev) => (
                <EventCard key={ev.id} event={ev} />
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
