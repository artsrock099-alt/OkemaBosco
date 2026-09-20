import type { Metadata } from 'next';
import Link from 'next/link';
import SectionRenderer from '@/components/public/SectionRenderer';
import HeroMedia from '@/components/public/HeroMedia';
import { getCmsSections } from '@/lib/cms';
import { getSiteImages } from '@/lib/site-images';

export const metadata: Metadata = {
  title: 'Live Performance',
  description:
    'Live performances of Ugandan traditional and contemporary music. Solo, small ensemble or full band for concerts, festivals, weddings and cultural celebrations.',
};

const formats = [
  {
    title: 'Solo Performance',
    blurb: 'Intimate & personal',
    description:
      'Adungu, thumb piano, percussion and voice. Perfect for smaller venues, house concerts, intimate ceremonies, or warm-up sets.',
  },
  {
    title: 'Small Ensemble',
    blurb: '2 to 4 performers',
    description:
      'A richer sound with additional percussion, vocals and melodic instruments. Ideal for mid-size venues and community events.',
  },
  {
    title: 'Full Band',
    blurb: '5+ performers',
    description:
      'The full experience, with traditional and modern instrumentation, harmonies and a rhythm section. For festivals, large halls and major events.',
  },
];

const setLengths = [
  { time: '20 min', label: 'Feature Set' },
  { time: '45 min', label: 'Standard Show' },
  { time: '60 min', label: 'Extended Set' },
  { time: '90 min', label: 'Full Concert' },
];

const included = [
  {
    title: 'Solo or Ensemble',
    description:
      'Performed solo, or with percussion and supporting musicians, scaled to your event size and budget.',
  },
  {
    title: 'Story & Sound',
    description:
      'Each piece comes with context: where the instrument is from, what it means and how it is played. Music as education.',
  },
  {
    title: 'Audience Connection',
    description:
      'Live demonstration segments, call-and-response and time for questions. Audiences leave as participants, not spectators.',
  },
  {
    title: 'Flexible Length',
    description:
      'From a 20 minute feature set to a full 90 minute concert with intermission. We fit your programme, not the other way around.',
  },
];

const venues = [
  {
    title: 'Community Events & Festivals',
    description:
      'Outdoor stages, heritage celebrations and world music showcases, with high-energy sets plus quieter pieces that draw listeners in.',
    tags: 'Outdoor · Festival · Heritage',
  },
  {
    title: 'Museums, Libraries & Galleries',
    description:
      'Exhibit openings, artist talks and educational series, where the music sits alongside talks about craftsmanship, oral tradition and cultural migration.',
    tags: 'Education · Culture · Q&A',
  },
  {
    title: 'Private Events & Receptions',
    description:
      'Weddings, dinners, fundraisers and corporate events, where live thumb piano and adungu add warmth without overpowering the conversation.',
    tags: 'Weddings · Corporate · Intimate',
  },
  {
    title: 'Faith Communities & Cultural Centres',
    description:
      'Music that honours tradition and builds bridges, for interfaith events, diaspora celebrations and community healing gatherings.',
    tags: 'Interfaith · Community · Healing',
  },
];

const instrumentsPlayed = [
  {
    name: 'Thumb Piano',
    subtitle: 'The kalimba',
    image: '/OKema/pic7.png',
    description:
      'Soft, bell-like tones that layer and loop. Intimate and meditative, with each note ringing out clearly, music you can feel in your chest.',
  },
  {
    name: 'Adungu',
    subtitle: 'Ugandan bow harp',
    image: '/OKema/pic5.png',
    description:
      'A flowing, harp-like sound that fills a room without amplification. The adungu carries centuries of oral tradition in every string it vibrates.',
  },
  {
    name: 'Percussion',
    subtitle: 'The heartbeat',
    image: '/OKema/pic9.png',
    description:
      'Traditional rhythms that ground the melodies and invite movement, the pulse that connects every listener to something deeper than words.',
  },
];

export default async function LivePerformancePage() {
  const cmsSections = await getCmsSections('live-performance');
  if (cmsSections) return <SectionRenderer sections={cmsSections} />;

  const images = await getSiteImages();

  return (
    <>
      <section className="relative min-h-[78vh] md:min-h-[88vh] flex flex-col justify-end pt-32 pb-16 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <HeroMedia
          slug="live-performance"
          defaultImage="/OKema/pic3.jpeg"
          defaultOverlay={50}
          gradient="from-deep-charcoal via-deep-charcoal/60 to-transparent"
        />
        <div className="relative z-10 container-x max-w-4xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
          
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-8">
            Live music. Real connection.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mb-8">
            From intimate gatherings to cultural festivals, the sound of the thumb piano, adungu
            and African rhythms carried to any stage. Music, storytelling and audience connection
            in one experience.
          </p>
          <Link href="/book" className="btn-primary-light inline-flex">
            REQUEST A PERFORMANCE
          </Link>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              ABOUT THE MUSIC
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight leading-tight mb-8">
              A bridge between tradition and today.
            </h2>
            <div className="space-y-6 font-body text-body-md text-on-surface-variant">
              <p>
                Bosco&apos;s performances draw on the deep wellsprings of Ugandan traditional music
                and storytelling, then shape them for a room that has never heard them before.
              </p>
              <p>
                Rooted in the sound of the Adungu (bow harp), thumb piano, percussion and voice,
                every performance is an invitation into a living musical culture. Songs carry
                stories, rhythms carry joy, and the audience ends up part of the music.
              </p>
              <p>
                Every piece comes with its context: where the instrument is from, what it means,
                and how it is played. The music does the entertaining, and it teaches at the same
                time.
              </p>
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-tl-3xl rounded-br-3xl">
              <img
                src={images['live-performance-story'].url}
                alt={images['live-performance-story'].alt}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-container">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              PERFORMANCE FORMATS
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Choose the sound that fits your event.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {formats.map((f, i) => (
              <div key={f.title} className="relative card-surface p-8 md:p-10 flex flex-col h-full">
                <div className="absolute top-6 right-6 font-display text-6xl text-on-surface/5 pointer-events-none">
                  {i + 1}
                </div>
                <div className="font-label text-label-sm text-muted-ochre uppercase tracking-widest mb-3">
                  {f.blurb}
                </div>
                <h3 className="font-headline text-headline-md text-on-surface mb-4">{f.title}</h3>
                <p className="font-body text-body-md text-on-surface-variant flex-1">{f.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 md:mt-10">
            {setLengths.map((length) => (
              <div key={length.label} className="card-surface p-6 text-center">
                <div className="font-display text-headline-md md:text-headline-lg text-on-surface leading-none">
                  {length.time}
                </div>
                <div className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant mt-3">
                  {length.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              WHAT A PERFORMANCE INCLUDES
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Every set is intentional.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {included.map((item) => (
              <div key={item.title} className="card-surface p-8 flex flex-col h-full">
                <h3 className="font-headline text-headline-md text-on-surface mb-4">{item.title}</h3>
                <p className="font-body text-body-md text-on-surface-variant flex-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-container-low">
        <div className="container-x card-surface p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                WHERE WE PLAY
              </div>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8 leading-tight">
                Every stage has a story.
              </h2>
              <p className="font-body text-body-md text-on-surface-variant mb-6">
                From outdoor festival stages to intimate rooms. Every performance is shaped around
                the occasion, whether you need quiet ambient sets, energetic dance music or a full
                concert programme.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-3">
              {venues.map((venue) => (
                <li key={venue.title} className="flex items-start gap-3 p-4 bg-surface-container rounded">
                  <svg className="w-5 h-5 text-muted-ochre flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <div>
                    <div className="font-headline text-body-lg text-on-surface">{venue.title}</div>
                    <p className="font-body text-body-md text-on-surface-variant mt-1">
                      {venue.description}
                    </p>
                    <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mt-2">
                      {venue.tags}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              THE INSTRUMENTS
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Ancient voices, living sound.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {instrumentsPlayed.map((instrument) => (
              <div key={instrument.name} className="group">
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-container mb-5">
                  <img
                    src={instrument.image}
                    alt={instrument.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
                  {instrument.subtitle}
                </div>
                <h3 className="font-headline text-headline-md text-on-surface mb-3">{instrument.name}</h3>
                <p className="font-body text-body-md text-on-surface-variant">{instrument.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-deep-charcoal text-warm-ivory">
        <div className="container-x max-w-4xl text-center">
          <blockquote className="font-display text-headline-lg-mobile md:text-headline-lg text-warm-ivory leading-tight italic">
            &ldquo;Together they create a sound that is both ancient and new. Audiences describe it
            as water, memory, and music you can feel.&rdquo;
          </blockquote>
          <div className="mt-8 font-label text-label-sm uppercase tracking-widest text-muted-ochre">
            Okema Bosco, on live African music
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-container-low">
        <div className="container-x">
          <div className="relative aspect-video w-full max-w-5xl mx-auto overflow-hidden">
            <img
              src={images['live-performance-video-thumbnail'].url}
              alt={images['live-performance-video-thumbnail'].alt}
              className="w-full h-full object-cover"
            />
            <button className="absolute inset-0 flex items-center justify-center group">
              <span className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-warm-ivory/90 text-deep-charcoal flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-muted-ochre group-hover:text-white">
                <svg className="w-10 h-10 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </div>
          <div className="text-center mt-10">
            <Link href="/listen" className="btn-ghost">
              MORE LIVE FOOTAGE →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x card-surface p-8 md:p-12 text-center">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8 max-w-3xl mx-auto">
            Ready to bring live Ugandan music to your event?
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
            Tell me about your audience, your space and what kind of set fits best, and I will come
            back with format options, availability and tailored pricing. Every booking is a
            collaboration.
          </p>
          <Link href="/book" className="btn-primary">
            REQUEST A PERFORMANCE
          </Link>
        </div>
      </section>
    </>
  );
}
