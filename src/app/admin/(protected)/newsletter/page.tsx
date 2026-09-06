import { prisma } from '@/lib/db';
import NewsletterSubscribersManager from '@/components/admin/NewsletterSubscribersManager';

export const metadata = { title: 'Newsletter Subscribers' };

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Newsletter • Subscribers
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Newsletter Subscribers
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Manage newsletter subscriptions, export subscriber lists and manage audience segments.
        </p>
      </div>
      <NewsletterSubscribersManager initialSubscribers={subscribers as any} />
    </div>
  );
}
