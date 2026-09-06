import NewArticleForm from '@/components/admin/NewArticleForm';
import { prisma } from '@/lib/db';

export const metadata = { title: 'New Article' };

export default async function NewArticlePage() {
  const categories = await prisma.articleCategory.findMany({
    orderBy: { name: 'asc' },
  });
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          New Article
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2">
          Draft a new journal entry or blog post.
        </p>
      </div>
      <NewArticleForm categories={categories} />
    </div>
  );
}
