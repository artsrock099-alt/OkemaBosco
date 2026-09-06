import { prisma } from '@/lib/db';
import TaxonomyManager from '@/components/admin/TaxonomyManager';

export const metadata = { title: 'Article Categories' };

export default async function AdminArticleCategoriesPage() {
  const categories = await prisma.articleCategory.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  });

  const items = categories.length > 0
    ? categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c._count.articles,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }))
    : [
        { id: '1', name: 'News', slug: 'news', count: 0, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Press', slug: 'press', count: 0, createdAt: new Date(), updatedAt: new Date() },
        { id: '3', name: 'Behind the Music', slug: 'behind-music', count: 0, createdAt: new Date(), updatedAt: new Date() },
        { id: '4', name: 'Tour Diary', slug: 'tour-diary', count: 0, createdAt: new Date(), updatedAt: new Date() },
      ];

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Articles • Categories
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Article Categories
        </h1>
      </div>
      <TaxonomyManager
        resourceLabel={{ singular: 'Category', plural: 'Categories', icon: '🏷️' }}
        endpoint="articles/categories"
        initialItems={items as any}
        description="Group articles into topic categories for the press & blog section."
      />
    </div>
  );
}
