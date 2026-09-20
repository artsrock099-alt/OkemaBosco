import Link from 'next/link';
import { format } from 'date-fns';
import { getUpcomingEvents } from '@/lib/queries';

type MarqueeItem = {
  key: string;
  href: string;
  date: string;
  place: string;
  title: string;
};

/**
 * Scrolling ticker of upcoming dates, pulled from the Event table.
 * When the database has no upcoming dates yet, it falls back to a few
 * evergreen links so the homepage still has a live band under the hero.
 */
export default async function EventsMarquee() {
  let events: any[] = [];

  try {
    events = await getUpcomingEvents(8);
  } catch (error) {
    console.warn('Events marquee could not load events:', error);
  }

  const items: MarqueeItem[] = events.map((ev) => ({
    key: ev.id,
    href: `/events/${ev.slug}`,
    date: format(new Date(ev.startDate), 'd MMM').toUpperCase(),
    place: ev.venue || ev.location || 'Location to be confirmed',
    title: ev.title,
  }));

  const list: MarqueeItem[] =
    items.length > 0
      ? items
      : [
          {
            key: 'fallback-search',
            href: '/events',
            date: 'SOON',
            place: 'Kampala, Uganda',
            title: 'New dates are being confirmed',
          },
          {
            key: 'fallback-book',
            href: '/book',
            date: 'BOOK',
            place: 'Anywhere',
            title: 'Bring Bosco to your community',
          },
          {
            key: 'fallback-listen',
            href: '/listen',
            date: 'LISTEN',
            place: 'Everywhere',
            title: 'Live recordings and new releases',
          },
        ];

  return (
    <div className="marquee-shell relative overflow-hidden bg-deep-charcoal text-warm-ivory border-y border-muted-ochre/25">
      <div className="flex items-stretch">
        <div className="relative z-20 flex shrink-0 items-center gap-3 bg-muted-ochre px-4 md:px-6 py-3">
          <span className="w-2 h-2 rounded-full bg-deep-charcoal" />
          <span className="font-label text-label-sm uppercase tracking-widest text-white whitespace-nowrap">
            Upcoming
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
                {list.map((item) => (
                  <Link
                    key={`${copy}-${item.key}`}
                    href={item.href}
                    className="group flex items-center gap-3 px-6 py-3 whitespace-nowrap hover:text-muted-ochre transition-colors"
                  >
                    <span className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
                      {item.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-surface-variant/50" />
                    <span className="font-body text-body-md text-warm-ivory group-hover:text-muted-ochre transition-colors">
                      {item.title}
                    </span>
                    <span className="font-label text-label-sm uppercase tracking-widest text-surface-variant">
                      {item.place}
                    </span>
                    <span className="text-muted-ochre">→</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-deep-charcoal to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-deep-charcoal to-transparent" />
        </div>

        <Link
          href="/events"
          className="relative z-20 hidden md:flex shrink-0 items-center px-6 py-3 font-label text-label-sm uppercase tracking-widest text-surface-variant hover:text-muted-ochre transition-colors border-l border-surface-variant/20"
        >
          All dates
        </Link>
      </div>
    </div>
  );
}
