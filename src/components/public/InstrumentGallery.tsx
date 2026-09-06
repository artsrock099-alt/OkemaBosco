'use client';

import { useEffect } from 'react';

const instruments = [
  '/OKema/pic5.png',
  '/OKema/pic6.png',
  '/OKema/pic7.png',
  '/OKema/pic8.png',
  '/OKema/pic9.png',
  '/OKema/pic10.png',
  '/OKema/pic11.png',
];

/**
 * Gallery of Bosco's handmade instruments. As each tile scrolls into view it
 * "pops" in (scale + fade, staggered) — see the .pop-in keyframes in globals.css.
 */
export default function InstrumentGallery() {
  useEffect(() => {
    const tiles = Array.from(document.querySelectorAll<HTMLElement>('.pop-tile'));
    if (!('IntersectionObserver' in window)) {
      tiles.forEach((el) => el.classList.add('pop-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('pop-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    tiles.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-deep-charcoal text-warm-ivory overflow-hidden">
      <div className="container-x py-14 md:py-20">
        <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
            THE INSTRUMENTS
          </div>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-warm-ivory tracking-tight">
            Handmade tools of sound
          </h2>
          <p className="font-body text-body-md text-surface-variant mt-4">
            Each instrument is crafted by hand from wood, gourds and animal skins — keep
            scrolling and watch the collection pop to life.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {instruments.map((src, i) => (
            <figure
              key={src}
              className={`pop-tile opacity-0 scale-75 group relative aspect-square overflow-hidden rounded-xl bg-black ${
                i === 6 ? 'col-span-2 md:col-span-1' : ''
              }`}
              style={{ animationDelay: `${(i % 4) * 90}ms` }}
            >
              <img
                src={src}
                alt={`Traditional instrument ${i + 1} of ${instruments.length}`}
                className="w-full h-full object-cover contrast-105 transition-all duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute top-3 left-3 font-label text-label-sm text-warm-ivory/70 uppercase tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </figcaption>
              <div className="absolute inset-0 ring-1 ring-inset ring-warm-ivory/0 group-hover:ring-warm-ivory/20 transition-all duration-500 rounded-xl" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
