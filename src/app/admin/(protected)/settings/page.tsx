import SettingsForm from '@/components/admin/SettingsForm';
import { prisma } from '@/lib/db';

export const metadata = { title: 'Site Settings' };

const defaultSettings = {
  id: 'default',
  siteName: 'Bosco Okema',
  tagline: 'Ugandan Musician • Cultural Educator • Performer',
  contactEmail: 'hello@boscookema.com',
  contactPhone: '+256 700 000 000',
  contactLocation: 'Kampala, Uganda',
  footerText: 'Ugandan Musician • Cultural Educator • Performer',
  copyrightText: '© 2026 Bosco Okema. All Rights Reserved.',
  privacyPolicyUrl: '/privacy',
  termsUrl: '/terms',
  newsletterEnabled: true,
  footerVisible: true,
};

export default async function SettingsPage() {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = defaultSettings as any;
  }

  const [socials, mediaItems] = await Promise.all([
    prisma.socialLink.findMany({ orderBy: { order: 'asc' } }),
    prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { id: true, title: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Site Settings
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2">
          Global settings: contact info, social links, footer, SEO defaults, branding.
        </p>
      </div>
      <SettingsForm settings={settings as any} socials={socials as any} mediaItems={mediaItems} />
    </div>
  );
}
