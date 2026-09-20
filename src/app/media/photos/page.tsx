import type { Metadata } from 'next';
import Link from 'next/link';
import SectionRenderer from '@/components/public/SectionRenderer';
import HeroMedia from '@/components/public/HeroMedia';
import { getCmsSections } from '@/lib/cms';
import { prisma, isDatabaseConfigured } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Photos',
  description:
    'Photos of Bosco Okema in performance, in workshops, and in cultural moments from across Uganda and beyond.',
};

/**
 * The gallery is driven by the photo library, so anything uploaded under
 * Admin -> Media -> Photos shows up here straight away. These are the
 * photographs shown while the library is still empty.
 */
const fallbackPhotos: { src: string; label: string; aspect: string; href?: string }[] = [
  { src: '/OKema/AboutOkema.jpg', label: 'Portrait', aspect: 'aspect-[3/4]' },
  { src: '/OKema/pic4.jpeg', label: 'Bosco with his instruments', aspect: 'aspect-square' },
  { src: '/OKema/IMG_4864.JPG', label: 'Live at the theatre', aspect: 'aspect-[16/10]' },
  { src: '/OKema/culturePerformance.JPG', label: 'Cultural performance', aspect: 'aspect-square' },
  { src: '/OKema/liveperformance1.JPG', label: 'On stage', aspect: 'aspect-[4/3]' },
  { src: '/OKema/liveperformance2.JPG', label: 'Performing with the band', aspect: 'aspect-[4/3]' },
  { src: '/OKema/schoolresidency2.jpg', label: 'School residency', aspect: 'aspect-[4/3]' },
  { src: '/OKema/schoolresidency3.jpg', label: 'Learning the instruments', aspect: 'aspect-[3/4]' },
  { src: '/OKema/schoolresidency4.jpeg', label: 'Classroom workshop', aspect: 'aspect-[4/3]' },
  { src: '/OKema/schoolresidency6.jpeg', label: 'Hands-on session', aspect: 'aspect-[4/3]' },
  { src: '/OKema/PrimRoseElders6.jpeg', label: 'Elderly visits', aspect: 'aspect-[4/3]' },
  { src: '/OKema/ElderFlower1.jpeg', label: 'Music for residents', aspect: 'aspect-[4/3]' },
  { src: '/OKema/pic7.png', label: 'Handmade instruments', aspect: 'aspect-[3/4]', href: '/media/instruments' },
];

/**
 * Instrument photographs have their own gallery at /media/instruments, so they
 * stay out of this one to avoid showing the same picture twice.
 */
const INSTRUMENT_PHOTO = /\/pic(?:5|6|7|8|9|10|11)\.png$/i;

const ASPECTS = ['aspect-[2/3]', 'aspect-square', 'aspect-[4/3]', 'aspect-[16/10]'];

/**
 * Frame each photo to match its own shape, so nothing gets cropped: tall
 * photos get a tall frame, wide ones a wide frame, and squares a square.
 */
function aspectFor(width?: number | null, height?: number | null, index = 0) {
  if (!width || !height) return ASPECTS[index % ASPECTS.length];
  const ratio = width / height;
  if (ratio < 0.85) return 'aspect-[2/3]';
  if (ratio < 1.15) return 'aspect-square';
  if (ratio < 1.5) return 'aspect-[4/3]';
  return 'aspect-[16/10]';
}

async function getLibraryPhotos() {
  if (!isDatabaseConfigured) return [];
  try {
    const rows = await prisma.media.findMany({
      where: { type: 'IMAGE' },
      orderBy: { createdAt: 'asc' },
      take: 120,
    });
    return rows
      .filter((row) => !INSTRUMENT_PHOTO.test(row.url))
      .map((row, i) => ({
        src: row.url,
        label: row.title || 'Photograph',
        aspect: aspectFor(row.width, row.height, i),
      }));
  } catch (error) {
    console.warn('Photo library could not be loaded, using the built-in gallery:', error);
    return [];
  }
}

const tabs = [
  { slug: 'photos', label: 'Photos', href: '/media/photos' },
  { slug: 'videos', label: 'Videos', href: '/media/videos' },
  { slug: 'instruments', label: 'Instrument Gallery', href: '/media/instruments' },
  { slug: 'press', label: 'Press', href: '/media/press' },
  { slug: 'articles', label: 'Articles', href: '/media/articles' },
];

export default async function PhotosPage() {
  const cmsSections = await getCmsSections('media/photos');
  if (cmsSections) return <SectionRenderer sections={cmsSections} />;

  const libraryPhotos = await getLibraryPhotos();
  const photos: { src: string; label: string; aspect: string; href?: string }[] =
    libraryPhotos.length > 0 ? libraryPhotos : fallbackPhotos;

  return (
    <>
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center pt-32 pb-12 md:pb-16 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <HeroMedia
          slug="media/photos"
          defaultImage="/OKema/schoolresidency15.jpeg"
          defaultOverlay={50}
          gradient="from-deep-charcoal via-deep-charcoal/50 to-deep-charcoal/25"
        />
        <div className="relative z-10 container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
        
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
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/70 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <span className="font-label text-label-sm text-warm-ivory uppercase tracking-widest">
                      {photo.label}
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
