import type { Metadata } from 'next';
import Link from 'next/link';
import { getPressItems } from '@/lib/queries';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Press',
  description:
    'Press coverage, interviews, and media features about Bosco Okema.',
};

export default async function PressPage() {
  const pressItems = await getPressItems();

  const fallbackPress = [
    {
      id: '1',
      publication: 'The Kampala Post',
      title: 'Bringing Traditional Ugandan Music to the Modern Stage',
      date: new Date('2025-05-12'),
      url: '#',
      description:
        'An in-depth feature on how Bosco Okema is bridging generations through the Adungu and storytelling.',
      img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    },
    {
      id: '2',
      publication: 'Africa Arts Review',
      title: '10 Musicians Shaping the Future of African Folk',
      date: new Date('2025-03-01'),
      url: '#',
      description:
        'Bosco Okema is profiled among a new generation of artists honoring tradition while looking forward.',
      img: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&q=80',
    },
    {
      id: '3',
      publication: 'Education Today Uganda',
      title: 'The Classroom Becomes a Stage',
      date: new Date('2024-11-18'),
      url: '#',
      description:
        'How school residency programs are transforming cultural education — with a case study from Bosco.',
      img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    },
    {
      id: '4',
      publication: 'National Theatre Magazine',
      title: 'Interview: Music is my First Language',
      date: new Date('2024-09-06'),
      url: '#',
      description:
        'A wide-ranging conversation on heritage, mentorship and the meaning of home in every song.',
      img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    },
  ];

  const items = pressItems.length > 0 ? pressItems : fallbackPress;

  return (
    <>
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-deep-charcoal text-warm-ivory">
        <div className="container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            MEDIA • PRESS
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6">
            Press
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mx-auto">
            Interviews, features and media coverage from around the world.
          </p>
        </div>
      </section>
      <div className="sticky top-20 z-30 bg-surface/90 backdrop-blur-md border-b border-earth-brown/10 mb-12 md:mb-16">
        <div className="container-x flex overflow-x-auto py-4 gap-2 md:gap-4">
          {[
            { slug: 'photos', label: 'Photos', href: '/media/photos' },
            { slug: 'videos', label: 'Videos', href: '/media/videos' },
            { slug: 'instruments', label: 'Instrument Gallery', href: '/media/instruments' },
            { slug: 'press', label: 'Press', href: '/media/press' },
            { slug: 'articles', label: 'Articles', href: '/media/articles' },
          ].map((tab) => (
            <Link
              key={tab.slug}
              href={tab.href}
              className={`font-label text-label-sm uppercase tracking-widest whitespace-nowrap px-4 py-2 transition-colors ${
                tab.slug === 'press'
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
        <div className="container-x grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {items.map((p: any) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface overflow-hidden group flex flex-col md:flex-row"
            >
              <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto flex-shrink-0 bg-surface-container-high">
                <img
                  src={p.img || (p.image ? p.image.url : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80')}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
                  {p.publication}
                </div>
                <h3 className="font-headline text-headline-md text-on-surface mb-4 group-hover:text-muted-ochre transition-colors leading-tight">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="font-body text-body-md text-on-surface-variant mb-4 line-clamp-3 flex-1">
                    {p.description}
                  </p>
                )}
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-earth-brown/10">
                  <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-widest">
                    {formatDate(p.date)}
                  </span>
                  <span className="font-label text-label-sm text-muted-ochre uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    READ ARTICLE →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
