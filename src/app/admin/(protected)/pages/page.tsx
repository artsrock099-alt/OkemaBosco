import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateShort } from '@/lib/utils';

export const metadata = { title: 'Pages' };

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-earth-brown/10 text-earth-brown',
  DRAFT: 'bg-surface-container-high text-on-surface-variant border border-earth-brown/20',
  SCHEDULED: 'bg-warm-ivory text-earth-brown border border-muted-ochre/30',
  ARCHIVED: 'bg-surface-container-high text-on-surface-variant',
};

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    include: {
      _count: { select: { sections: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Pages</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2">
            Create and manage public pages. Use the Page Builder to compose sections.
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
        >
          + Create Page
        </Link>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-body-md min-w-[720px]">
            <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
              <tr>
                <th className="py-3 px-6 font-normal">Title</th>
                <th className="py-3 px-6 font-normal">Sections</th>
                <th className="py-3 px-6 font-normal">Status</th>
                <th className="py-3 px-6 font-normal">Last Updated</th>
                <th className="py-3 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-brown/10">
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-on-surface-variant">
                    No pages yet — create your first page above.
                  </td>
                </tr>
              ) : (
                pages.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-on-surface">{p.title}</div>
                        {p.isHomepage && (
                          <span className="px-2 py-0.5 bg-muted-ochre/10 text-muted-ochre font-label text-[10px] rounded uppercase tracking-wider">
                            Homepage
                          </span>
                        )}
                      </div>
                      <div className="font-label text-label-sm text-on-surface-variant mt-1">
                        /{p.slug === 'home' ? '' : p.slug}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {p._count.sections}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-1 font-label text-[10px] rounded uppercase tracking-wider ${
                          statusColors[p.status] || statusColors.DRAFT
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {formatDateShort(p.updatedAt)}
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <Link
                        href={`/admin/builder/${p.slug}`}
                        className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest"
                      >
                        Edit Builder
                      </Link>
                      <Link
                        href={p.isHomepage ? '/' : `/${p.slug}`}
                        target="_blank"
                        className="text-on-surface-variant hover:text-on-surface font-label text-label-sm uppercase tracking-widest"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
