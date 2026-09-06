import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Media',
  description:
    'Photos, videos, press features and articles about Bosco Okema — a visual archive of performances, events and cultural moments.',
};

const collections = [
  {
    title: 'Gallery',
    caption: 'Performance & behind-the-scenes',
    href: '/media/photos',
    image: '/OKema/pic2.jpeg',
  },
  {
    title: 'Videos',
    caption: 'Live & in-studio',
    href: '/media/videos',
    image: '/OKema/IMG_4864.JPG',
  },
  {
    title: 'Instrument Gallery',
    caption: 'Handmade tools of sound',
    href: '/media/instruments',
    image: '/OKema/pic7.png',
  },
  {
    title: 'Press',
    caption: 'In the news',
    href: '/media/press',
    image: '/OKema/IMG_2190.jpeg',
  },
];

export default function MediaPage() {
  return (
    <>
      {/* HERO */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-16 bg-deep-charcoal text-warm-ivory">
        <div className="container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            MEDIA
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6">
            Images, Stories & Sounds
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mx-auto">
            A visual archive of performances, cultural moments, and stories — from the stage to
            the classroom.
          </p>
        </div>
      </section>

      {/* COLLECTION TILES */}
      <section className="py-16 md:py-24 bg-deep-charcoal text-warm-ivory">
        <div className="container-x grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
          {collections.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-inverse-surface">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="text-center mt-5">
                <h2 className="font-label text-label-sm uppercase tracking-widest text-warm-ivory group-hover:text-muted-ochre transition-colors">
                  {c.title}
                </h2>
                <p className="font-body text-body-md text-surface-variant mt-1">{c.caption}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ARTICLES BANNER */}
      <section className="pb-16 md:pb-24 bg-deep-charcoal">
        <div className="container-x">
          <Link
            href="/media/articles"
            className="group relative block overflow-hidden rounded-xl aspect-[16/7] md:aspect-[21/6]"
          >
            <img
              src="/OKema/pic3.jpeg"
              alt="Stories & articles"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-deep-charcoal via-deep-charcoal/70 to-transparent" />
            <div className="relative h-full flex flex-col justify-center p-8 md:p-16 max-w-xl">
              <span className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
                STORIES
              </span>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-warm-ivory tracking-tight">
                From the journal.
              </h2>
              <p className="font-body text-body-md text-surface-variant mt-3 mb-6">
                Articles and features about the music, the culture and the journey.
              </p>
              <span className="font-label text-label-sm uppercase tracking-widest text-muted-ochre group-hover:underline">
                READ THE JOURNAL →
              </span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
