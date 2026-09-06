import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Live Performance',
  description:
    'Live performances of Ugandan traditional and contemporary music — solo, small ensemble or full band for concerts, festivals, weddings and cultural celebrations.',
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
    blurb: '2–4 performers',
    description:
      'A richer sound with additional percussion, vocals and melodic instruments. Ideal for mid-size venues and community events.',
  },
  {
    title: 'Full Band',
    blurb: '5+ performers',
    description:
      'The full experience — traditional and modern instrumentation, harmonies, rhythm section. For festivals, large halls and major events.',
  },
];

const idealFor = [
  'Concerts & Recitals',
  'Festivals & Cultural Days',
  'Weddings & Ceremonies',
  'Fundraisers & Galas',
  'Churches & Places of Worship',
  'Community Events',
  'Private Parties & Celebrations',
  'Corporate & Organizational Events',
];

export default function LivePerformancePage() {
  return (
    <>
      <section className="relative min-h-[70vh] flex flex-col justify-end pt-32 pb-16 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&q=80"
            alt="Live music performance stage with warm lighting"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal via-deep-charcoal/60 to-transparent" />
        </div>
        <div className="relative z-10 container-x max-w-4xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            LIVE PERFORMANCE
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-8">
            Live music. Real connection.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mb-8">
            From the traditional Adungu harp to contemporary original compositions — experience
            the sound of Uganda live. Solo, small ensemble or full band.
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
                Bosco&apos;s performances draw from the deep wellsprings of Ugandan traditional music
                and storytelling — reimagined with a contemporary sensibility that speaks to
                audiences of every background.
              </p>
              <p>
                Rooted in the sounds of the Adungu (bow harp), thumb piano, percussion, and voice
                — each performance is an invitation into a living musical culture, where songs
                carry stories, rhythms carry joy, and the audience becomes part of the music.
              </p>
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <div className="relative aspect-[4/5] overflow-hidden rounded-tl-3xl rounded-br-3xl">
              <img
                src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1000&q=80"
                alt="Hands playing traditional stringed instrument"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-container">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
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
        </div>
      </section>

      <section className="section-y">
        <div className="container-x card-surface p-8 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                IDEAL FOR
              </div>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8 leading-tight">
                The perfect soundtrack for your moment.
              </h2>
              <p className="font-body text-body-md text-on-surface-variant mb-6">
                Every performance is tailored to the occasion — whether you need quiet, ambient
                sets, energetic dance music, or a full concert program.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {idealFor.map((s) => (
                <li key={s} className="flex items-start gap-3 p-4 bg-surface-container rounded">
                  <svg className="w-5 h-5 text-muted-ochre flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span className="font-body text-body-md text-on-surface">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-container-low">
        <div className="container-x">
          <div className="relative aspect-video w-full max-w-5xl mx-auto overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80"
              alt="Live performance thumbnail"
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
        <div className="container-x card-surface p-10 md:p-20 text-center">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8 max-w-3xl mx-auto">
            Ready to bring live Ugandan music to your event?
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
            Tell Bosco about your vision. He will respond with format options, availability and
            tailored pricing.
          </p>
          <Link href="/book" className="btn-primary">
            REQUEST A PERFORMANCE
          </Link>
        </div>
      </section>
    </>
  );
}
