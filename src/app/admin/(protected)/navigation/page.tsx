import { prisma } from '@/lib/db';
import NavigationManager from '@/components/admin/NavigationManager';

export const metadata = { title: 'Navigation' };

export default async function AdminNavigationPage() {
  const navigations = await prisma.navigation.findMany({
    include: {
      items: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  const defaultNavs = navigations.length > 0 ? navigations : [
    {
      id: 'main',
      name: 'Main Navigation',
      location: 'header',
      items: [
        { id: '1', navigationId: 'main', label: 'Home', url: '/', isExternal: false, order: 0, isVisible: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', navigationId: 'main', label: 'Events', url: '/events', isExternal: false, order: 1, isVisible: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
        { id: '3', navigationId: 'main', label: 'Education', url: '/education', isExternal: false, order: 2, isVisible: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
        { id: '4', navigationId: 'main', label: 'Listen', url: '/listen', isExternal: false, order: 3, isVisible: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
        { id: '5', navigationId: 'main', label: 'Media', url: '/media', isExternal: false, order: 4, isVisible: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
        { id: '6', navigationId: 'main', label: 'Contact', url: '/contact', isExternal: false, order: 5, isVisible: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'footer',
      name: 'Footer Navigation',
      location: 'footer',
      items: [
        { id: 'f1', navigationId: 'footer', label: 'Home', url: '/', isExternal: false, order: 0, isVisible: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'f2', navigationId: 'footer', label: 'About', url: '/about', isExternal: false, order: 1, isVisible: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'f3', navigationId: 'footer', label: 'Events', url: '/events', isExternal: false, order: 2, isVisible: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'f4', navigationId: 'footer', label: 'Contact', url: '/contact', isExternal: false, order: 3, isVisible: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'f5', navigationId: 'footer', label: 'Book Bosco', url: '/book', isExternal: false, order: 4, isVisible: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Website • Navigation
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Navigation Management
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Reorder, rename, show/hide and create navigation items. The default main navigation plus footer and booking CTA are controlled here.
        </p>
      </div>
      <NavigationManager navigations={defaultNavs as any} />
    </div>
  );
}
