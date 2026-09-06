import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Photos',
  description:
    'Photo gallery — Bosco Okema in performance, workshops, and cultural moments from across Uganda and beyond.',
};

const photos = [
  { src: '/OKema/Pic1.jpeg', label: 'Live performance', aspect: 'aspect-[3/4]' },
  { src: '/OKema/pic2.jpeg', label: 'Portrait', aspect: 'aspect-[3/4]' },
  { src: '/OKema/pic3.jpeg', label: 'On stage', aspect: 'aspect-square' },
  { src: '/OKema/IMG_2190.jpeg', label: 'School residency', aspect: 'aspect-[4/3]' },
  { src: '/OKema/PrimRoseElders6.jpeg', label: 'Elderly visits', aspect: 'aspect-[4/3]' },
  { src: '/OKema/IMG_4864.JPG', label: 'Live at the theatre', aspect: 'aspect-[16/10]' },
  { src: '/OKema/pic7.png', label: 'Handmade instruments', aspect: 'aspect-[3/4]', href: '/media/instruments' },
];

const tabs = [
  { slug: 'photos', label: 'Photos', href: '/media/photos' },
  { slug: 'videos', label: 'Videos', href: '/media/videos' },
  { slug: 'instruments', label: 'Instrument Gallery', href: '/media/instruments' },
  { slug: 'press', label: 'Press', href: '/media/press' },
  { slug: 'articles', label: 'Articles', href: '/media/articles' },
];

export default function PhotosPage() {
  return (
    <>
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-deep-charcoal text-warm-ivory">
        <div className="container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            MEDIA • GALLERY
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6">
            Photos
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mx-auto">
            On stage, in the classroom, and behind the scenes.
          </p>
        </div>
      </section>

      {/* TABS */}
      <div className="sticky top-20 z-30 bg-surface/90 backdrop-blur-md border-b border-earth-brown/10">
        <div className="container-x flex overflow-x-auto py-4 gap-2 md:gap-4 no-scrollbar">
          {tabs.map((tab) => (
            <Link
              key={tab.slug}
              href={tab.href}
              className={`font-label text-label-sm uppercase tracking-widest whitespace-nowrap px-4 py-2 transition-colors ${
                tab.slug === 'photos'
                  ? 'text-muted-ochre border-b-2 border-muted-ochre'
                  : 'text-on-surface-variant hover:text-muted-ochre'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* MASONRY GALLERY */}
      <section className="section-y">
        <div className="container-x">
          <div className="columns-2 md:columns-3 gap-4 md:gap-5 [column-fill:_balance]">
            {photos.map((photo, i) => {
              const inner = (
                <>
                  <img
                    src={photo.src}
                    alt={photo.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/70 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <span className="font-label text-label-sm text-warm-ivory uppercase tracking-widest">
                      {String(i + 1).padStart(2, '0')} — {photo.label}
                    </span>
                  </figcaption>
                </>
              );
              return photo.href ? (
                <Link
                  key={photo.src + i}
                  href={photo.href}
                  className={`group relative block overflow-hidden rounded-xl mb-4 md:mb-5 break-inside-avoid ${photo.aspect}`}
                >
                  {inner}
                </Link>
              ) : (
                <figure
                  key={photo.src + i}
                  className={`group relative overflow-hidden rounded-xl mb-4 md:mb-5 break-inside-avoid cursor-pointer ${photo.aspect}`}
                >
                  {inner}
                </figure>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
