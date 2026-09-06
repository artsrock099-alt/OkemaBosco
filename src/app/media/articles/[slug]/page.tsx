import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { getArticleBySlug, getArticles } from '@/lib/queries';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

const fallbackContent: Record<string, any> = {
  'the-story-of-the-adungu': {
    title: 'The Story of the Adungu',
    category: { name: 'Culture' },
    publishDate: new Date('2025-06-10'),
    author: { name: 'Bosco Okema' },
    featuredImage: { url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1600&q=80' },
    excerpt:
      'An instrument passed down through generations — how the bow harp carries the voices of my ancestors, and what it means to play it today.',
    body: [
      'The Adungu is not merely an instrument to me. It is a library, a teacher, and a conversation partner rolled into one.',
      'I was seven when my grandfather first placed one in my hands — not the smaller children\u2019s version, but his own. The wood was worn smooth where his fingers had rested for forty years, and the strings hummed even before I touched them, as if they remembered every song he had ever played.',
      'That is the thing about the Adungu: it is made of living things. Wood from a tree that stood by a river. Strings that were once animal hide. And when you play it, you are not playing alone. Every musician who has ever held that same shape, every elder who sang along to the same tuning, every child who danced while their parent played — they are all in the room with you.',
      'This is what I try to teach when I visit classrooms. The Adungu is not a curiosity from a faraway place. It is proof that music is memory, made audible. The moment you pluck its lowest string, you are part of a song that began long before you were born, and will continue long after.',
      'When I tour abroad, I am sometimes asked: "Is this traditional music, or modern music?" My answer is always the same. It is both. It is the sound of my grandfather teaching me a song in the language of his parents, and me writing new verses for my daughter — in the same tuning, on the same wood, under the same Ugandan sky.',
      'If you ever find yourself holding an Adungu, press your palm to the wood first. Listen for a moment. It is already playing something. Your job is simply to join in.',
    ],
  },
};

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);

  const fallback = fallbackContent[params.slug];
  if (!article && !fallback) notFound();

  const data: any = article || fallback;

  const related = (await getArticles(4)).filter(
    (a: any) => a.slug !== params.slug && a.id !== (data.id || params.slug)
  ).slice(0, 3);

  return (
    <>
      <article>
        <header className="pt-32 pb-16 md:pt-40 md:pb-24 bg-deep-charcoal text-warm-ivory">
          <div className="container-x max-w-3xl text-center">
            <Link
              href="/media/articles"
              className="font-label text-label-sm uppercase tracking-widest text-surface-variant hover:text-muted-ochre transition-colors inline-flex mb-8"
            >
              ← BACK TO ARTICLES
            </Link>
            {data.category && (
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                {data.category.name}
              </div>
            )}
            <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-8">
              {data.title}
            </h1>
            <div className="flex items-center justify-center gap-6 font-label text-label-sm text-surface-variant uppercase tracking-widest">
              {data.author?.name && <span>By {data.author.name}</span>}
              {data.publishDate && <span>{formatDate(data.publishDate)}</span>}
            </div>
          </div>
        </header>

        {data.featuredImage && (
          <div className="container-x max-w-5xl -mt-8 md:-mt-12 mb-12 md:mb-20">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={data.featuredImage.url} alt={data.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <section className="pb-section-gap">
          <div className="container-x max-w-3xl">
            {data.excerpt && (
              <p className="font-display text-headline-md md:text-headline-lg text-on-surface leading-relaxed mb-10">
                {data.excerpt}
              </p>
            )}
            <div className="space-y-6 font-body text-body-md md:text-body-lg text-on-surface-variant leading-relaxed">
              {(data.body || (data.content ? [data.content] : [])).map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-20 pt-8 border-t border-earth-brown/20 flex items-center justify-between">
              <Link href="/media/articles" className="btn-ghost">
                ← MORE ARTICLES
              </Link>
              <Link href="/book" className="btn-outline text-primary !py-2 !px-5 text-sm">
                BOOK BOSCO
              </Link>
            </div>
          </div>
        </section>
      </article>

      {related.length > 0 && (
        <section className="section-y bg-surface-container">
          <div className="container-x">
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-12 text-center">
              Keep reading.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((a: any) => (
                <Link key={a.id || a.slug} href={`/media/articles/${a.slug}`} className="group h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden mb-5 bg-surface-container-high">
                    {a.featuredImage ? (
                      <img src={a.featuredImage.url} alt={a.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-6xl text-on-surface-variant/30">{a.title.charAt(0)}</span>
                      </div>
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
