import { prisma } from '@/lib/db';
import TaxonomyManager from '@/components/admin/TaxonomyManager';

export const metadata = { title: 'Article Tags' };

export default async function AdminArticleTagsPage() {
  const tags = await prisma.articleTag.findMany({
    orderBy: { name: 'asc' },
  });

  const items = tags.length > 0
    ? tags.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      }))
    : [
        { id: '1', name: 'Performance', slug: 'performance', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Interview', slug: 'interview', createdAt: new Date(), updatedAt: new Date() },
        { id: '3', name: 'Traditional', slug: 'traditional', createdAt: new Date(), updatedAt: new Date() },
        { id: '4', name: 'Education', slug: 'education', createdAt: new Date(), updatedAt: new Date() },
        { id: '5', name: 'Culture', slug: 'culture', createdAt: new Date(), updatedAt: new Date() },
      ];

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Articles • Tags
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Article Tags
        </h1>
      </div>
      <TaxonomyManager
        resourceLabel={{ singular: 'Tag', plural: 'Tags', icon: '🏷️' }}
        endpoint="articles/tags"
        initialItems={items as any}
        description="Fine-grained tagging for articles — tags complement categories and appear alongside each published piece."
      />
    </div>
  );
}
