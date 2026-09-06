import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Videos',
  description:
    'Watch performances, interviews, and behind-the-scenes videos featuring Bosco Okema.',
};

const sampleVideos = [
  {
    title: 'Live at Kampala National Theatre',
    date: 'Mar 12, 2025',
    duration: '12:34',
    img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
  },
  {
    title: 'Adungu Solo — Full Session',
    date: 'Feb 02, 2025',
    duration: '8:12',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80',
  },
  {
    title: 'Kampala Arts Festival Headline',
    date: 'Dec 18, 2024',
    duration: '45:06',
    img: 'https://images.unsplash.com/photo-1501612780327-b48eda3e7b56?w=1200&q=80',
  },
  {
    title: 'Interview: The Story of the Adungu',
    date: 'Nov 04, 2024',
    duration: '14:22',
    img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1200&q=80',
  },
  {
    title: 'School Residency Documentary',
    date: 'Oct 10, 2024',
    duration: '22:50',
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
  },
  {
    title: 'Sounds of Uganda Ensemble',
    date: 'Aug 21, 2024',
    duration: '31:15',
    img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80',
  },
];

export default function VideosPage() {
  return (
    <>
      <section className="pt-32 pb-12 md:pt-40 md:pb-20 bg-surface-container">
        <div className="container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            MEDIA • VIDEOS
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight leading-tight mb-6">
            Videos
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Live performances, interviews, and stories captured on film.
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
      <section className="pb-section-gap">
        <div className="container-x grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sampleVideos.map((v, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-video overflow-hidden mb-5 bg-surface-container-high">
                <img src={v.img} alt={v.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <button className="absolute inset-0 flex items-center justify-center">
                  <span className="w-16 h-16 rounded-full bg-warm-ivory/90 text-deep-charcoal flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-muted-ochre group-hover:text-white">
                    <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
                <span className="absolute bottom-4 right-4 bg-deep-charcoal/90 text-warm-ivory px-3 py-1 font-label text-label-sm rounded">
                  {v.duration}
                </span>
              </div>
              <h3 className="font-headline text-headline-md text-on-surface mb-2 group-hover:text-muted-ochre transition-colors leading-tight">
                {v.title}
              </h3>
              <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-widest">
                {v.date}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
