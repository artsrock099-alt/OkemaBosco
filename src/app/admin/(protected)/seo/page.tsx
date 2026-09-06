import { prisma } from '@/lib/db';
import SEOManager from '@/components/admin/SEOManager';

export const metadata = { title: 'SEO Settings' };

export default async function AdminSEOPage() {
  const siteSettings = await prisma.siteSettings.findFirst({
    include: { defaultHeroImage: { select: { id: true, title: true, url: true } } },
  });

  const mediaItems = await prisma.media.findMany({
    where: { type: 'IMAGE' },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { id: true, title: true, url: true },
  });

  const persisted = (siteSettings?.seo || {}) as Record<string, any>;

  const seoSettings = {
    id: siteSettings?.id || 'default',
    siteName: siteSettings?.siteName || 'Bosco Okema',
    tagline: siteSettings?.tagline || 'Ugandan Musician • Cultural Educator • Performer',
    defaultSeoTitle:
      persisted.defaultSeoTitle ||
      'Bosco Okema | Ugandan Musician • Cultural Educator • Performer',
    defaultSeoDescription:
      persisted.defaultSeoDescription ||
      'Award-winning Ugandan musician and cultural educator Bosco Okema. Traditional and contemporary performances, school residencies and community workshops across Uganda and beyond.',
    defaultKeywords: persisted.defaultKeywords || [
      'Ugandan musician',
      'African music',
      'traditional music',
      'cultural education',
      'school residency',
      'live performance',
      'Kampala',
      'Bosco Okema',
    ],
    defaultOgImage: persisted.defaultOgImage || siteSettings?.defaultHeroImage?.url || null,
    twitterHandle: persisted.twitterHandle || '@boscookema',
    facebookPageId: persisted.facebookPageId || '',
    googleAnalyticsId: persisted.googleAnalyticsId || '',
    defaultNoIndex: persisted.defaultNoIndex || false,
    defaultNoFollow: persisted.defaultNoFollow || false,
    baseUrl: persisted.baseUrl || 'https://www.boscookema.com',
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Website • SEO
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          SEO &amp; Meta Settings
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Configure global search engine defaults, social share cards, analytics integration and per-entity SEO inheritance.
        </p>
      </div>
      <SEOManager settings={seoSettings} mediaItems={mediaItems} />
    </div>
  );
}
