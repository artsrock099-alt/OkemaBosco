import type { Metadata } from 'next';
import Link from 'next/link';
import InstrumentGallery from '@/components/public/InstrumentGallery';
import SectionRenderer from '@/components/public/SectionRenderer';
import HeroMedia from '@/components/public/HeroMedia';
import { getCmsSections } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Instrument Gallery',
  description:
    'Traditional Ugandan instruments made and played by Bosco Okema. Hand-carved tools of sound, plus a look at the music in motion.',
};

export default async function InstrumentsPage() {
  const cmsSections = await getCmsSections('media/instruments');
  if (cmsSections) return <SectionRenderer sections={cmsSections} />;

  return (
    <>
      {/* HEADER */}
      <section className="relative min-h-[62vh] md:min-h-[72vh] flex flex-col justify-center pt-32 pb-16 md:pb-20 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <HeroMedia
          slug="media/instruments"
          defaultImage="/OKema/pic8.png"
          defaultOverlay={15}
          gradient="from-deep-charcoal via-deep-charcoal/40 to-transparent"
        />
        <div className="relative z-10 container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
        
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6">
            The Instruments
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mx-auto">
            Bosco builds and plays his own traditional Ugandan instruments from wood, gourds and
            animal skins. Each one is a beautiful, one-off piece of art. Keep scrolling to see the
            collection come to life.
          </p>
        </div>
      </section>

      {/* INSTRUMENTS SLIDESHOW */}
      <InstrumentGallery />

      {/* VIDEO, BELOW THE ANIMATION */}
      <section className="section-y bg-surface-container" id="watch">
        <div className="container-x">
          <div className="text-center mb-10 md:mb-14">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              THE MUSIC IN MOTION
            </div>
          </div>

          <div className="relative aspect-video w-full max-w-5xl mx-auto overflow-hidden rounded-xl bg-deep-charcoal shadow-2xl">
            <video
              className="w-full h-full object-contain"
              autoPlay
              muted
              loop
              controls
              playsInline
            >
              <source src="/OKema/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* BOTTOM NAV */}
      <section className="section-y border-t border-earth-brown/10">
        <div className="container-x grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/media/photos"
            className="group flex flex-col p-8 card-surface h-full"
          >
            <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">
              ← Previous
            </span>
            <span className="font-display text-headline-md text-on-surface group-hover:text-muted-ochre transition-colors">
              Gallery
            </span>
          </Link>
          <Link
            href="/media"
            className="group flex flex-col p-8 card-surface h-full text-right"
          >
            <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">
              All Media →
            </span>
            <span className="font-display text-headline-md text-on-surface group-hover:text-muted-ochre transition-colors">
              Back to Media
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
