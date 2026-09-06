import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateShort } from '@/lib/utils';

export const metadata = { title: 'Articles' };

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-earth-brown/10 text-earth-brown',
  DRAFT: 'bg-surface-container-high text-on-surface-variant border border-earth-brown/20',
  SCHEDULED: 'bg-warm-ivory text-earth-brown border border-muted-ochre/30',
  ARCHIVED: 'bg-surface-container-high text-on-surface-variant',
};

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    include: { category: true, author: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
            Articles
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2">
            Draft, schedule, publish and manage journal articles and blog posts.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/articles/categories"
            className="px-4 py-2.5 border border-earth-brown/20 text-on-surface-variant hover:text-on-surface hover:border-earth-brown/40 font-label text-label-sm uppercase tracking-widest rounded transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/admin/articles/tags"
            className="px-4 py-2.5 border border-earth-brown/20 text-on-surface-variant hover:text-on-surface hover:border-earth-brown/40 font-label text-label-sm uppercase tracking-widest rounded transition-colors"
          >
            Tags
          </Link>
          <Link
            href="/admin/articles/new"
            className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
          >
            + Write Article
          </Link>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-body-md min-w-[720px]">
            <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
              <tr>
                <th className="py-3 px-6 font-normal">Title</th>
                <th className="py-3 px-6 font-normal">Category</th>
                <th className="py-3 px-6 font-normal">Author</th>
                <th className="py-3 px-6 font-normal">Status</th>
                <th className="py-3 px-6 font-normal">Published</th>
                <th className="py-3 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-brown/10">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-on-surface-variant">
                    No articles yet — write your first story above.
                  </td>
                </tr>
              ) : (
                articles.map((a) => (
                  <tr key={a.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-on-surface">{a.title}</div>
                      {a.excerpt && (
                        <div className="font-label text-label-sm text-on-surface-variant line-clamp-1 mt-1 max-w-md">
                          {a.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
                        {a.category?.name || '—'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {a.author?.name || '—'}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-1 font-label text-[10px] rounded uppercase tracking-wider ${
                          statusColors[a.status] || statusColors.DRAFT
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {a.publishDate ? formatDateShort(a.publishDate) : '—'}
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <Link
                        href={`/admin/articles/${a.id}/edit`}
                        className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/media/articles/${a.slug}`}
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
