import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Photos',
  description:
    'Photo gallery — Bosco Okema in performance, workshops, and cultural moments from across Uganda and beyond.',
};

const sampleImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&q=80', span: 'row-span-2 col-span-1 aspect-[3/4]' },
  { id: '2', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1000&q=80', span: 'aspect-square' },
  { id: '3', url: 'https://images.unsplash.com/photo-1501612780327-b48eda3e7b56?w=1000&q=80', span: 'aspect-square' },
  { id: '4', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1000&q=80', span: 'aspect-square' },
  { id: '5', url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1000&q=80', span: 'aspect-[4/5]' },
  { id: '6', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1000&q=80', span: 'row-span-2 aspect-[3/4]' },
  { id: '7', url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1000&q=80', span: 'aspect-square' },
  { id: '8', url: 'https://images.unsplash.com/photo-1501612780327-b48eda3e7b56?w=1000&q=80', span: 'aspect-square' },
  { id: '9', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1000&q=80', span: 'aspect-[16/10] col-span-2' },
  { id: '10', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1000&q=80', span: 'aspect-square' },
  { id: '11', url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1000&q=80', span: 'aspect-square' },
  { id: '12', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&q=80', span: 'aspect-[4/3]' },
];

export default function PhotosPage() {
  return (
    <>
      <section className="pt-32 pb-12 md:pt-40 md:pb-20 bg-surface-container">
        <div className="container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            MEDIA • PHOTOS
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight leading-tight mb-6">
            Photos
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            On stage, in the classroom, and behind the scenes. Click any image to open the gallery.
          </p>
        </div>
      </section>
      <div className="sticky top-20 z-30 bg-surface/90 backdrop-blur-md border-b border-earth-brown/10 mb-12 md:mb-16">
        <div className="container-x flex overflow-x-auto py-4 gap-2 md:gap-4">
          {[
            { slug: 'photos', label: 'Photos', href: '/media/photos' },
            { slug: 'videos', label: 'Videos', href: '/media/videos' },
            { slug: 'press', label: 'Press', href: '/media/press' },
            { slug: 'articles', label: 'Articles', href: '/media/articles' },
          ].map((tab) => (
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
      <section className="pb-section-gap">
        <div className="container-x">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {sampleImages.map((img) => (
              <div
                key={img.id}
                className={`relative overflow-hidden bg-surface-container-high group cursor-pointer ${img.span}`}
              >
                <img
                  src={img.url}
                  alt="Gallery photo"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-deep-charcoal/0 group-hover:bg-deep-charcoal/20 transition-all duration-300 flex items-end p-4">
                  <svg className="w-6 h-6 text-warm-ivory opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
