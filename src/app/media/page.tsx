import type { Metadata } from 'next';
import Link from 'next/link';
import { getGalleryImages, getArticles, getPressItems } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Media',
  description:
    'Photos, videos, press features and articles about Bosco Okema — a visual archive of performances, events and cultural moments.',
};

const tabs = [
  { slug: 'photos', label: 'Photos', href: '/media/photos' },
  { slug: 'videos', label: 'Videos', href: '/media/videos' },
  { slug: 'press', label: 'Press', href: '/media/press' },
  { slug: 'articles', label: 'Articles', href: '/media/articles' },
];

export default async function MediaPage() {
  const [photos, videosInMedia, articles, press] = await Promise.all([
    getGalleryImages('image'),
    getGalleryImages('video'),
    getArticles(3),
    getPressItems(),
  ]);

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-surface-container">
        <div className="container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            MEDIA
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight leading-tight mb-6">
            Images, Stories & Sounds
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            A visual archive of performances, cultural moments, and stories — from the stage to
            the classroom.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-20 z-30 bg-surface/90 backdrop-blur-md border-b border-earth-brown/10">
        <div className="container-x flex overflow-x-auto py-4 gap-2 md:gap-4 no-scrollbar">
          {tabs.map((tab) => (
            <Link
              key={tab.slug}
              href={tab.href}
              className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-muted-ochre transition-colors whitespace-nowrap px-4 py-2"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Photos Preview */}
      <section className="section-y">
        <div className="container-x">
          <div className="flex items-end justify-between mb-10 md:mb-12">
            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
                PHOTOS
              </div>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                Performance & Behind-the-scenes
              </h2>
            </div>
            <Link href="/media/photos" className="btn-ghost">
              VIEW ALL →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {photos.slice(0, 8).length > 0 ? (
              photos.slice(0, 8).map((img, i) => (
                <div
                  key={img.id}
                  className={`relative overflow-hidden bg-surface-container-high group ${
                    i === 0 || i === 5 ? 'aspect-[3/4] row-span-2' : 'aspect-square'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || `Photo ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))
            ) : (
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden bg-surface-container-high group ${
                    i === 0 || i === 5 ? 'aspect-[3/4] row-span-2' : 'aspect-square'
                  }`}
                >
                  <img
                    src={`https://images.unsplash.com/photo-${
                      ['1511671782779-c97d3d27a1d4', '1514320291840-2e0a9bf2a9ae', '1501612780327-b48eda3e7b56', '1470229722913-7c0e2dbbafd3', '1501612780327-b48eda3e7b56', '1459749411175-04bf5292ceea', '1510915361894-db8b60106cb1', '1493225457124-a3eb161ffa5f'][i]
                    }?w=800&q=80`}
                    alt={`Performance photo ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Videos Preview */}
      <section className="section-y bg-surface-container">
        <div className="container-x">
          <div className="flex items-end justify-between mb-10 md:mb-12">
            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
                VIDEOS
              </div>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                Live & In-studio
              </h2>
            </div>
            <Link href="/media/videos" className="btn-ghost">
              VIEW ALL →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {videosInMedia.slice(0, 2).length > 0 ? (
              videosInMedia.slice(0, 2).map((v) => (
                <div key={v.id} className="relative aspect-video overflow-hidden group">
                  <img src={v.url} alt={v.altText || 'Video'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <button className="absolute inset-0 flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full bg-warm-ivory/90 text-deep-charcoal flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-muted-ochre group-hover:text-white">
                      <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>
                </div>
              ))
            ) : (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="relative aspect-video overflow-hidden group cursor-pointer">
                  <img
                    src={`https://images.unsplash.com/photo-${
                      i === 0 ? '1470229722913-7c0e2dbbafd3' : '1511671782779-c97d3d27a1d4'
                    }?w=1200&q=80`}
                    alt={`Video ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <button className="absolute inset-0 flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full bg-warm-ivory/90 text-deep-charcoal flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-muted-ochre group-hover:text-white">
                      <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-deep-charcoal/80 to-transparent">
                    <h3 className="font-headline text-headline-md text-warm-ivory">
                      {i === 0 ? 'Live at Kampala National Theatre' : 'Festival Headline Set'}
                    </h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Press Preview */}
      {press.length > 0 && (
        <section className="section-y">
          <div className="container-x">
            <div className="flex items-end justify-between mb-10 md:mb-12">
              <div>
                <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
                  PRESS
                </div>
                <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                  In the news.
                </h2>
              </div>
              <Link href="/media/press" className="btn-ghost">
                VIEW ALL →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {press.slice(0, 3).map((p) => (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="card-surface p-6 h-full flex flex-col group">
                  <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
                    {p.publication}
                  </div>
                  <h3 className="font-headline text-headline-md text-on-surface mb-4 group-hover:text-muted-ochre transition-colors">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="font-body text-body-md text-on-surface-variant mb-4 line-clamp-3">
                      {p.description}
                    </p>
                  )}
                  <div className="mt-auto flex justify-between items-center">
                    <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-widest">
                      {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="font-label text-label-sm text-muted-ochre uppercase tracking-widest">
                      READ →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Preview */}
      {articles.length > 0 && (
        <section className="section-y bg-surface-container">
          <div className="container-x">
            <div className="flex items-end justify-between mb-10 md:mb-12">
              <div>
                <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
                  ARTICLES & STORIES
                </div>
                <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                  From the journal.
                </h2>
              </div>
              <Link href="/media/articles" className="btn-ghost">
                READ MORE →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {articles.map((a) => (
                <Link key={a.id} href={`/media/articles/${a.slug}`} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden mb-5 bg-surface-container-high">
                    {a.featuredImage ? (
                      <img src={a.featuredImage.url} alt={a.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-6xl text-on-surface-variant/30">
                          {a.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    {a.category && (
                      <span className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
                        {a.category.name}
                      </span>
                    )}
                    {a.publishDate && (
                      <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-widest">
                        {new Date(a.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h3 className="font-headline text-headline-md text-on-surface mb-3 group-hover:text-muted-ochre transition-colors leading-tight">
                    {a.title}
                  </h3>
                  {a.excerpt && (
                    <p className="font-body text-body-md text-on-surface-variant line-clamp-2">
                      {a.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
