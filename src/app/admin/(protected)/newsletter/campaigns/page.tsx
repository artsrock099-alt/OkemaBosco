import { prisma } from '@/lib/db';
import NewsletterCampaignsManager from '@/components/admin/NewsletterCampaignsManager';

export const metadata = { title: 'Newsletter Campaigns' };

export default async function AdminNewsletterCampaignsPage() {
  const [campaigns, subscriberCount] = await Promise.all([
    prisma.newsletterCampaign.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Newsletter • Campaigns
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Newsletter Campaigns
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Create, schedule and monitor email campaigns to your subscriber base.
        </p>
      </div>
      <NewsletterCampaignsManager initialCampaigns={campaigns as any} subscriberCount={subscriberCount} />
    </div>
  );
}
