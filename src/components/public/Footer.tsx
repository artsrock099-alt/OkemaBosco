import Link from 'next/link';
import { Instagram, Facebook, Youtube, Music, Twitter, Linkedin } from 'lucide-react';
import NewsletterForm from './NewsletterForm';
import { getSiteSettings, getSocialLinks, getNavigation } from '@/lib/queries';

function TikTokIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  spotify: <Music className="w-5 h-5" />,
  tiktok: <TikTokIcon />,
  twitter: <Twitter className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  music: <Music className="w-5 h-5" />,
};

function getIcon(iconName?: string, platform?: string) {
  const key = (iconName || platform || '').toLowerCase().trim();
  return iconMap[key] || <Music className="w-5 h-5" />;
}

const defaultNav = [
  ['Home', '/'],
  ['Events', '/events'],
  ['Education', '/education'],
  ['Listen', '/listen'],
  ['Media', '/media'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

const defaultServices = [
  ['Live Performance', '/live-performance'],
  ['School Residency', '/education/school-residency'],
  ['Elderly Visits', '/education/elderly-visits'],
  ['Book Bosco', '/book'],
];

export async function Footer() {
  let settings: any = null;
  let socials: any[] = [];
  let navItems: any[] = [];
  let footerVisible = true;

  try {
    const [s, sl, nav] = await Promise.all([
      getSiteSettings(),
      getSocialLinks(),
      getNavigation('main'),
    ]);
    settings = s;
    socials = sl;
    footerVisible = s?.footerVisible !== false;
    if (nav?.items) {
      navItems = nav.items
        .filter((i: any) => i.isVisible !== false)
        .map((i: any) => [i.label, i.url]);
    }
  } catch (error) {
    console.warn('Footer CMS fetch failed, using fallback:', error);
  }

  if (!footerVisible) return null;

  const year = new Date().getFullYear();
  const brandName = settings?.siteName || 'BOSCO OKEMA';
  const copyright = settings?.copyrightText || `© ${year} ${brandName}. All Rights Reserved.`;
  const contactEmail = settings?.contactEmail || 'hello@boscookema.com';
  const contactPhone = settings?.contactPhone || '+256 700 000 000';
  const contactLocation = settings?.contactLocation || 'Kampala, Uganda';
  const tagline = settings?.tagline || 'Ugandan Musician • Cultural Educator • Performer';
  const newsletterEnabled = settings?.newsletterEnabled !== false;

  const navToShow = navItems.length > 0 ? navItems : defaultNav;
  const socialsToShow =
    socials.length > 0
      ? socials
      : [
          { id: '1', platform: 'Instagram', url: '#', icon: 'instagram' },
          { id: '2', platform: 'Facebook', url: '#', icon: 'facebook' },
          { id: '3', platform: 'YouTube', url: '#', icon: 'youtube' },
          { id: '4', platform: 'Spotify', url: '#', icon: 'spotify' },
          { id: '5', platform: 'TikTok', url: '#', icon: 'tiktok' },
        ];

  const taglineLines = tagline.split('•').map((t: string) => t.trim());

  return (
    <footer className="bg-deep-charcoal text-warm-ivory w-full mt-section-gap">
      <div className="container-x py-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <h3 className="font-display text-headline-lg text-warm-ivory tracking-tighter mb-4">
              {brandName.toUpperCase()}
            </h3>
            <div className="space-y-1 font-body text-body-md text-surface-variant mb-8">
              {taglineLines.map((line: string, i: number) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <div className="flex gap-4 flex-wrap">
              {socialsToShow.map((s) => (
                <a
                  key={s.id}
                  href={s.url || '#'}
                  target={s.url?.startsWith('http') ? '_blank' : undefined}
                  rel={s.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={s.platform || s.label || 'Social link'}
                  className="w-10 h-10 rounded-full border border-surface-variant/30 flex items-center justify-center text-surface-variant hover:text-muted-ochre hover:border-muted-ochre transition-colors duration-300"
                >
                  {getIcon(s.icon, s.platform)}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-6">
              Navigate
            </h4>
            <div className="space-y-3">
              {navToShow.map(([label, href]: any) => (
                <Link
                  key={href}
                  href={href}
                  className="block font-body text-body-md text-surface-variant hover:text-warm-ivory transition-colors duration-300"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-6">
              Services
            </h4>
            <div className="space-y-3">
              {defaultServices.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block font-body text-body-md text-surface-variant hover:text-warm-ivory transition-colors duration-300"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-6">
              Contact
            </h4>
            <div className="space-y-3 font-body text-body-md text-surface-variant">
              <p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-warm-ivory transition-colors break-all"
                >
                  {contactEmail}
                </a>
              </p>
              <p>
                <a href={`tel:${contactPhone}`} className="hover:text-warm-ivory transition-colors">
                  {contactPhone}
                </a>
              </p>
              <p>{contactLocation}</p>
            </div>
          </div>

          {newsletterEnabled && (
            <div className="md:col-span-2">
              <h4 className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-6">
                Stay Connected
              </h4>
              <p className="font-body text-body-md text-surface-variant mb-4">
                Subscribe for news, upcoming events and releases.
              </p>
              <NewsletterForm variant="dark" />
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-surface-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label text-label-sm text-surface-variant uppercase tracking-widest text-center md:text-left">
            {copyright.replace('{year}', String(year)).includes(year.toString())
              ? copyright
              : copyright.replace(/© \d{4}/, `© ${year}`)}
          </p>
          <div className="flex gap-6">
            <Link
              href={settings?.privacyPolicyUrl || '/privacy'}
              className="font-label text-label-sm text-surface-variant hover:text-warm-ivory transition-colors uppercase tracking-widest"
            >
              Privacy Policy
            </Link>
            <Link
              href={settings?.termsUrl || '/terms'}
              className="font-label text-label-sm text-surface-variant hover:text-warm-ivory transition-colors uppercase tracking-widest"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
