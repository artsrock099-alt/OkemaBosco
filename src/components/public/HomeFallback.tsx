import Link from 'next/link';
import Image from 'next/image';
import { EventCard } from '@/components/public/EventCard';
import { TestimonialCard } from '@/components/public/TestimonialCard';
import NewsletterForm from '@/components/public/NewsletterForm';
import { getUpcomingEvents, getTestimonials, getInstruments } from '@/lib/queries';

const services = [
  {
    slug: 'live-performance',
    href: '/live-performance',
    title: 'LIVE PERFORMANCE',
    subtitle: 'Experience the Music of Uganda',
    description:
      'Traditional instruments, vocals, rhythm, storytelling and contemporary musical expression for festivals, concerts and special events.',
    image: '/OKema/pic3.jpeg',
  },
  {
    slug: 'school-residency',
    href: '/education/school-residency',
    title: 'SCHOOL RESIDENCY',
    subtitle: 'Bring African Music Into Your Classroom',
    description:
      'Interactive music, traditional instruments, storytelling, rhythm and cultural learning for students of all ages.',
    image: '/OKema/IMG_2190.jpeg',
  },
  {
    slug: 'elderly-visits',
    href: '/education/elderly-visits',
    title: 'ELDERLY VISITS',
    subtitle: 'Music That Creates Connection',
    description:
      'Live musical experiences for senior communities, assisted living facilities, nursing homes and senior centers.',
    image: '/OKema/PrimRoseElders6.jpeg',
  },
];

export default async function HomeFallback() {
  const [upcomingEvents, testimonials, instruments] = await Promise.all([
    getUpcomingEvents(3),
    getTestimonials(true, 6),
    getInstruments(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-end pt-32 pb-16 md:pb-24 bg-deep-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/OKema/Pic1.jpeg"
            alt="Bosco Okema performing live on stage with traditional Ugandan instruments, moody cinematic lighting"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal via-deep-charcoal/30 to-transparent" />
        </div>
        <div className="relative z-10 container-x grid grid-cols-1 md:grid-cols-12 gap-gutter items-end">
          <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
            <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tighter leading-none">
              BOSCO OKEMA
            </h1>
            <p className="font-headline text-headline-lg-mobile md:text-headline-md text-surface-variant font-light max-w-2xl">
              Ugandan Musician • Cultural Educator • Performer
            </p>
            <p className="font-body text-body-md md:text-body-lg text-surface-container-highest max-w-xl mb-2">
              Experience the music, stories and traditions of Uganda through live performance,
              cultural education and meaningful community experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/book" className="btn-primary-light">
                BOOK BOSCO
              </Link>
              <Link href="/listen" className="btn-outline text-warm-ivory">
                WATCH & LISTEN
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:col-span-4 lg:col-span-3 justify-end items-end pb-8">
            <div className="flex flex-col gap-4 text-right">
              {['INSTAGRAM', 'SPOTIFY', 'YOUTUBE', 'FACEBOOK'].map((s) => (
                <a key={s} href="#" className="nav-link text-surface-variant">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="section-y">
        <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-tl-3xl rounded-br-3xl">
              <img
                src="/OKema/pic2.jpeg"
                alt="Bosco Okema portrait holding traditional Adungu instrument"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7 order-1 md:order-2">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              MUSIC. CULTURE. CONNECTION.
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight leading-tight mb-8">
              Connecting people through the music, stories and traditions of Uganda.
            </h2>
            <div className="space-y-6">
              <p className="font-body text-body-lg text-on-surface-variant">
                Bosco Okema is a Ugandan musician, performer and cultural educator whose work
                connects people through music, storytelling and cultural experience.
              </p>
              <p className="font-body text-body-md text-on-surface-variant">
                From classrooms and senior communities to festivals, concerts and special events,
                Bosco brings the sounds and stories of Uganda to diverse audiences across the
                globe.
              </p>
            </div>
            <Link href="/about" className="btn-ghost mt-10">
              DISCOVER BOSCO →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="section-y bg-surface-container">
        <div className="container-x">
          <div className="text-center mb-16 md:mb-24 max-w-2xl mx-auto">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              OFFERINGS
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Experiences that bring Uganda to you.
            </h2>
          </div>

          <div className="space-y-24 md:space-y-32">
            {services.map((s, i) => (
              <div
                key={s.slug}
                className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${
                  i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="md:col-span-7">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.subtitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-5 md:px-8">
                  <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                    {s.title}
                  </div>
                  <h3 className="font-display text-headline-md md:text-headline-lg text-on-surface leading-tight mb-6">
                    {s.subtitle}
                  </h3>
                  <p className="font-body text-body-md text-on-surface-variant mb-8">
                    {s.description}
                  </p>
                  <Link href={s.href} className="btn-ghost">
                    EXPLORE {s.title.split(' ').slice(1).join(' ')} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOUNDS OF UGANDA / INSTRUMENTS */}
      {instruments.length > 0 && (
        <section className="section-y">
          <div className="container-x">
            <div className="text-center mb-16 md:mb-20 max-w-2xl mx-auto">
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                SOUNDS OF UGANDA
              </div>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                Traditional instruments that carry the heartbeat of a nation.
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
              {instruments.map((inst) => (
                <div key={inst.id} className="group">
                  <div className="relative aspect-square overflow-hidden bg-surface-container mb-4">
                    {inst.image ? (
                      <Image
                        src={inst.image.url}
                        alt={inst.image.altText || inst.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-5xl text-on-surface-variant/30">
                          {inst.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-headline text-headline-md text-on-surface mb-2 group-hover:text-muted-ochre transition-colors">
                    {inst.name}
                  </h3>
                  {inst.description && (
                    <p className="font-body text-body-md text-on-surface-variant line-clamp-3">
                      {inst.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING EVENTS */}
      <section className="section-y bg-surface-container-low">
        <div className="container-x">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                UPCOMING EVENTS
              </div>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                Where to find Bosco.
              </h2>
            </div>
            <Link href="/events" className="btn-ghost">
              VIEW ALL EVENTS →
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          ) : (
            <div className="card-surface p-16 text-center">
              <h3 className="font-headline text-headline-md text-on-surface mb-2">
                Stay tuned for upcoming performances.
              </h3>
              <p className="font-body text-body-md text-on-surface-variant mb-6">
                New dates are being added for 2025 and beyond. Subscribe to be the first to know.
              </p>
              <div className="max-w-md mx-auto">
                <NewsletterForm />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURED TESTIMONIAL */}
      {testimonials.length > 0 && (
        <section className="section-y">
          <div className="container-x">
            <div className="text-center mb-12 md:mb-16">
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                WHAT PEOPLE ARE SAYING
              </div>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                Kind words from communities.
              </h2>
            </div>
            {testimonials[0] && <TestimonialCard testimonial={testimonials[0]} variant="featured" />}
            {testimonials.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-16">
                {testimonials.slice(1, 4).map((t) => (
                  <TestimonialCard key={t.id} testimonial={t} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FEATURED VIDEO */}
      <section className="section-y bg-deep-charcoal text-warm-ivory">
        <div className="container-x">
          <div className="text-center mb-12 md:mb-16">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              EXPERIENCE THE MUSIC
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-warm-ivory tracking-tight max-w-3xl mx-auto">
              Live performance at the Kampala National Theatre.
            </h2>
          </div>
          <div className="relative aspect-video w-full max-w-5xl mx-auto overflow-hidden">
            <img
              src="/OKema/IMG_4864.JPG"
              alt="Video thumbnail - Bosco Okema performing live"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/listen" className="btn-outline text-warm-ivory">
              MORE PERFORMANCES
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-y">
        <div className="container-x">
          <div className="card-surface p-10 md:p-20 text-center">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              BRING BOSCO TO YOUR COMMUNITY
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-display-lg text-on-surface tracking-tight leading-tight mb-10 max-w-4xl mx-auto">
              School programs • Senior communities • Festivals • Concerts • Cultural events •
              Private events
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="btn-primary">
                BOOK BOSCO
              </Link>
              <Link href="/contact" className="btn-outline text-primary">
                GET IN TOUCH
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
