import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatDate, formatDateShort } from '@/lib/utils';
import { getEventBySlug, getUpcomingEvents } from '@/lib/queries';
import { EventCard } from '@/components/public/EventCard';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: 'Event Not Found' };
  return {
    title: event.title,
    description: event.shortDescription || event.description,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEventBySlug(params.slug);
  if (!event) notFound();

  const related = (await getUpcomingEvents(5)).filter((e) => e.id !== event.id).slice(0, 3);
  const [month, day, year] = formatDateShort(event.startDate).split(' ');

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[60vh] flex flex-col justify-end pt-32 pb-16 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <div className="absolute inset-0 z-0">
          {event.image ? (
            <Image
              src={event.image.url}
              alt={event.image.altText || event.title}
              fill
              className="object-cover opacity-40"
              priority
            />
          ) : (
            <div className="w-full h-full bg-surface-container-high" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal via-deep-charcoal/60 to-transparent" />
        </div>
        <div className="relative z-10 container-x">
          {event.category && (
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              {event.category.name}
            </div>
          )}
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6 max-w-4xl">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-6 font-body text-body-md md:text-body-lg text-surface-variant">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(event.startDate)}
            </div>
            {event.time && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-muted-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {event.time}
              </div>
            )}
            {(event.venue || event.location) && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-muted-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {[event.venue, event.location].filter(Boolean).join(' • ')}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8 space-y-8">
            {event.description && (
              <div className="prose prose-lg max-w-none">
                <p className="font-body text-body-lg text-on-surface whitespace-pre-line leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {event.videoUrl && (
              <div className="relative aspect-video bg-surface-container-high overflow-hidden">
                <iframe
                  src={event.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {(event.ticketUrl || event.registrationUrl) && (
              <div className="flex flex-wrap gap-4 pt-4">
                {event.ticketUrl && (
                  <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    GET TICKETS
                  </a>
                )}
                {event.registrationUrl && (
                  <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-primary">
                    REGISTER
                  </a>
                )}
              </div>
            )}
          </div>

          <aside className="md:col-span-4">
            <div className="card-surface p-8 sticky top-28">
              <div className="text-center pb-6 mb-6 border-b border-earth-brown/10">
                <div className="w-20 h-20 mx-auto bg-deep-charcoal text-warm-ivory rounded-lg flex flex-col items-center justify-center mb-4">
                  <span className="font-label text-label-sm uppercase">{month.replace(',', '')}</span>
                  <span className="font-display text-headline-lg leading-none">{day}</span>
                </div>
                <div className="font-label text-label-sm text-muted-ochre uppercase tracking-widest">{year}</div>
              </div>
              <dl className="space-y-4 font-body text-body-md">
                {event.time && (
                  <div>
                    <dt className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-1">Time</dt>
                    <dd className="text-on-surface">{event.time}</dd>
                  </div>
                )}
                {event.venue && (
                  <div>
                    <dt className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-1">Venue</dt>
                    <dd className="text-on-surface">{event.venue}</dd>
                  </div>
                )}
                {event.location && (
                  <div>
                    <dt className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-1">Location</dt>
                    <dd className="text-on-surface">{event.location}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-8 pt-6 border-t border-earth-brown/10 space-y-3">
                <Link href="/book" className="btn-primary w-full !py-3 text-sm">
                  BOOK SIMILAR EVENT
                </Link>
                <Link href="/contact" className="btn-ghost w-full">
                  ORGANIZER QUESTIONS?
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y bg-surface-container">
          <div className="container-x">
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-12">
              More Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
