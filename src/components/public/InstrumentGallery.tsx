'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = { src: string };

const slides: Slide[] = [
  { src: '/OKema/pic5.png' },
  { src: '/OKema/pic6.png' },
  { src: '/OKema/pic7.png' },
  { src: '/OKema/pic8.png' },
  { src: '/OKema/pic9.png' },
  { src: '/OKema/pic10.png' },
  { src: '/OKema/pic11.png' },
];

/**
 * Carousel of Bosco's handmade instruments. One instrument is shown at a time
 * on a black stage and "pops" in (scale + fade with a springy ease) as it
 * becomes active — inspired by samuelnalangira.com/media/instrument-gallery.
 * The stage is tall and shows the full photo (object-contain) so no part of
 * an instrument is ever cropped.
 */
export default function InstrumentGallery() {
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + total) % total),
    [total]
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 4500);
    return () => clearInterval(t);
  }, [paused, total]);

  return (
    <section
      className="bg-deep-charcoal text-warm-ivory overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-x py-14 md:py-20">
        <div className="text-center mb-10 md:mb-12 max-w-2xl mx-auto">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
            THE INSTRUMENTS
          </div>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-warm-ivory tracking-tight">
            Handmade tools of sound
          </h2>
          <p className="font-body text-body-md text-surface-variant mt-4">
            Each instrument is crafted by hand from wood, gourds and animal skins — watch them
            pop to life, one at a time.
          </p>
        </div>

        {/* STAGE — one full instrument at a time */}
        <div className="relative w-full max-w-4xl mx-auto h-[68vh] sm:h-[76vh] md:h-[82vh] overflow-hidden rounded-2xl bg-black select-none">
          {slides.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={`Traditional instrument ${i + 1} of ${total}`}
              draggable={false}
              className={`absolute inset-0 w-full h-full object-contain p-3 md:p-8 contrast-105 transition-all duration-700 ${
                i === index
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-90 pointer-events-none'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
            />
          ))}

          {/* ARROWS */}
          <button
            type="button"
            aria-label="Previous instrument"
            onClick={() => go(-1)}
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-14 md:h-14 rounded-full border border-warm-ivory/30 text-warm-ivory bg-deep-charcoal/30 backdrop-blur-sm flex items-center justify-center hover:bg-muted-ochre hover:border-muted-ochre hover:text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            aria-label="Next instrument"
            onClick={() => go(1)}
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-14 md:h-14 rounded-full border border-warm-ivory/30 text-warm-ivory bg-deep-charcoal/30 backdrop-blur-sm flex items-center justify-center hover:bg-muted-ochre hover:border-muted-ochre hover:text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* DOTS */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Go to instrument ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-8 bg-muted-ochre'
                  : 'w-2 bg-surface-variant/40 hover:bg-surface-variant/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
