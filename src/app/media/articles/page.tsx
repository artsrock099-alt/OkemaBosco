import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles } from '@/lib/queries';
import { formatDate } from '@/lib/utils';
import SectionRenderer from '@/components/public/SectionRenderer';
import HeroMedia from '@/components/public/HeroMedia';
import { getCmsSections } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Stories, reflections and writing from Bosco Okema about music, culture, education and life in Uganda.',
};

export default async function ArticlesPage() {
  const cmsSections = await getCmsSections('media/articles');
  if (cmsSections) return <SectionRenderer sections={cmsSections} />;

  const articles = await getArticles(20);

  const fallbackArticles = [
    {
      id: '1',
      slug: 'the-story-of-the-adungu',
      title: 'The Story of the Adungu',
      excerpt:
        'An instrument passed down through generations, and what it means to play it today.',
      category: { name: 'Culture' },
      publishDate: new Date('2025-06-10'),
      featuredImage: { url: '/OKema/pic3.jpeg' },
    },
    {
      id: '2',
      slug: 'music-in-the-classroom',
      title: 'Music in the Classroom: Five Things I Learned',
      excerpt:
        'From the shyest student to a room full of drummers, ten years of school residencies have taught me more than I ever expected.',
      category: { name: 'Education' },
      publishDate: new Date('2025-04-22'),
      featuredImage: { url: '/OKema/schoolresidency6.jpeg' },
    },
    {
      id: '3',
      slug: 'why-i-play-for-seniors',
      title: 'Why I Play for Seniors',
      excerpt:
        'The most attentive audience I have ever known. A letter from a daughter, a room in silence, and the song that opened a memory.',
      category: { name: 'Community' },
      publishDate: new Date('2025-02-14'),
      featuredImage: { url: '/OKema/PrimRoseElders4.jpeg' },
    },
    {
      id: '4',
      slug: 'festival-season-2025',
      title: 'Festival Season 2025: A Journal',
      excerpt:
        'Four stages, three countries, one unforgettable night under the stars in Gulu. Notes from the road, from the dressing room, and from the crowd.',
      category: { name: 'Tour Diary' },
      publishDate: new Date('2024-12-30'),
      featuredImage: { url: '/OKema/liveperformance2.JPG' },
    },
    {
      id: '5',
      slug: 'interview-making-of-sounds-of-uganda',
      title: 'Interview: The Making of Sounds of Uganda',
      excerpt:
        'A track-by-track walk through my latest album: where each song began, who it honors, and why it had to be recorded live.',
      category: { name: 'Music' },
      publishDate: new Date('2024-10-05'),
      featuredImage: { url: '/OKema/pic4.jpeg' },
    },
    {
      id: '6',
      slug: 'what-culture-actually-is',
      title: 'What Culture Actually Is',
      excerpt:
        'It is not a costume. It is not a performance. It is the small decisions, made every day, that carry us forward together.',
      category: { name: 'Culture' },
      publishDate: new Date('2024-08-18'),
      featuredImage: { url: '/OKema/culturePerformance.JPG' },
    },
  ];

  const items = articles.length > 0 ? articles : fallbackArticles;

  return (
    <>
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <HeroMedia slug="media/articles" gradient="from-deep-charcoal via-deep-charcoal/50 to-deep-charcoal/25" />
        <div className="relative z-10 container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
        
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6">
            Articles & Stories
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mx-auto">
            Writing on music, culture, education, and the journey behind the performances.
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
                tab.slug === 'articles'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((a: any) => (
              <Link key={a.id} href={`/media/articles/${a.slug}`} className="group h-full flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden mb-5 bg-surface-container-high flex-shrink-0">
                  {a.featuredImage ? (
                    <img src={a.featuredImage.url} alt={a.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-6xl text-on-surface-variant/30">{a.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    {a.category && (
                      <span className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
                        {a.category.name}
                      </span>
                    )}
                    {a.publishDate && (
                      <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-widest">
                        {formatDate(a.publishDate)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-headline text-headline-md text-on-surface mb-3 group-hover:text-muted-ochre transition-colors leading-tight">
                    {a.title}
                  </h3>
                  {a.excerpt && (
                    <p className="font-body text-body-md text-on-surface-variant line-clamp-3 flex-1 mb-4">
                      {a.excerpt}
                    </p>
                  )}
                  <span className="font-label text-label-sm text-muted-ochre uppercase tracking-widest group-hover:translate-x-1 transition-transform w-fit">
                    READ ARTICLE →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
