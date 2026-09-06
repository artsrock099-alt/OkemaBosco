import { prisma } from '@/lib/db';
import TaxonomyManager from '@/components/admin/TaxonomyManager';

export const metadata = { title: 'Event Categories' };

export default async function AdminEventCategoriesPage() {
  const categories = await prisma.eventCategory.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { events: true } } },
  });

  const items = categories.length > 0
    ? categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c._count.events,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }))
    : [
        { id: '1', name: 'Concert', slug: 'concert', count: 0, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Festival', slug: 'festival', count: 0, createdAt: new Date(), updatedAt: new Date() },
        { id: '3', name: 'Workshop', slug: 'workshop', count: 0, createdAt: new Date(), updatedAt: new Date() },
        { id: '4', name: 'Residency', slug: 'residency', count: 0, createdAt: new Date(), updatedAt: new Date() },
        { id: '5', name: 'Private Event', slug: 'private', count: 0, createdAt: new Date(), updatedAt: new Date() },
      ];

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Events • Categories
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Event Categories
        </h1>
      </div>
      <TaxonomyManager
        resourceLabel={{ singular: 'Category', plural: 'Categories', icon: '📁' }}
        endpoint="events/categories"
        initialItems={items as any}
        description="Organize events by type — categories appear on the public Events page filter and in content listings."
      />
    </div>
  );
}
