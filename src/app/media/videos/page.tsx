import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Videos',
  description:
    'Watch performances, interviews, and behind-the-scenes videos featuring Bosco Okema.',
};

const tabs = [
  { slug: 'photos', label: 'Photos', href: '/media/photos' },
  { slug: 'videos', label: 'Videos', href: '/media/videos' },
  { slug: 'instruments', label: 'Instrument Gallery', href: '/media/instruments' },
  { slug: 'press', label: 'Press', href: '/media/press' },
  { slug: 'articles', label: 'Articles', href: '/media/articles' },
];

export default function VideosPage() {
  return (
    <>
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-deep-charcoal text-warm-ivory">
        <div className="container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            MEDIA • VIDEOS
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6">
            Videos
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mx-auto">
            Live performances, interviews, and stories captured on film.
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
                tab.slug === 'videos'
                  ? 'text-muted-ochre border-b-2 border-muted-ochre'
                  : 'text-on-surface-variant hover:text-muted-ochre'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* FEATURED VIDEO */}
      <section className="section-y">
        <div className="container-x">
          <div className="text-center mb-10 md:mb-14">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
              FEATURED
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-4">
              Live at the Kampala National Theatre
            </h2>
            <p className="font-body text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Bosco in full flow — hear the adungu and the ensemble come alive on stage.
            </p>
          </div>

          <div className="relative aspect-video w-full max-w-5xl mx-auto overflow-hidden rounded-xl bg-deep-charcoal shadow-2xl">
            <video
              className="w-full h-full object-contain"
              controls
              playsInline
              preload="metadata"
              poster="/OKema/IMG_4864.JPG"
            >
              <source src="/OKema/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="mt-12 text-center">
            <Link href="/listen" className="btn-ghost">
              MORE PERFORMANCES →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
