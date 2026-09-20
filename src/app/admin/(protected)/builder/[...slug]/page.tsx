import Link from 'next/link';
import { prisma } from '@/lib/db';
import PageBuilder from '@/components/admin/PageBuilder';

export const metadata = { title: 'Page Builder' };

export default async function AdminBuilderPage({ params }: { params: { slug: string[] } }) {
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : String(params.slug);

  let page = await prisma.page.findUnique({
    where: { slug },
    include: { sections: { orderBy: { order: 'asc' } } },
  });

  if (!page) {
    page = {
      id: 'temp',
      title: slug === 'home' ? 'Homepage' : slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      slug,
      description: '',
      status: 'DRAFT',
      publishDate: null,
      isHomepage: slug === 'home',
      createdAt: new Date(),
      updatedAt: new Date(),
      sections: [],
    } as any;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap font-label text-label-sm uppercase tracking-widest">
        <Link href="/admin/pages" className="text-on-surface-variant hover:text-on-surface transition-colors">
          ← All Pages
        </Link>
      </div>
      <PageBuilder page={page as any} />
    </div>
  );
}
