import type { MetadataRoute } from 'next';
import { prisma, isDatabaseConfigured } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://boscookema.com';

  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/events',
    '/education',
    '/education/school-residency',
    '/education/elderly-visits',
    '/live-performance',
    '/listen',
    '/media',
    '/media/photos',
    '/media/videos',
    '/media/press',
    '/media/articles',
    '/contact',
    '/book',
    '/privacy',
    '/terms',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  // Frontend-only mode (no DB configured yet): skip dynamic lookups.
  if (!isDatabaseConfigured) return staticPages;

  try {
    const [events, articles] = await Promise.all([
      prisma.event.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const eventPages = events.map((e) => ({
      url: `${baseUrl}/events/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const articlePages = articles.map((a) => ({
      url: `${baseUrl}/media/articles/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...eventPages, ...articlePages];
  } catch {
    return staticPages;
  }
}
