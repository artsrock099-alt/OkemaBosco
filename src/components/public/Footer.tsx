import Link from 'next/link';
import NewsletterForm from './NewsletterForm';
import { getSocialIcon, isMusicIconLink } from './SocialIcon';
import { getSiteSettings, getSocialLinks, getNavigation } from '@/lib/queries';

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
  ['Instrument Gallery', '/media/instruments'],
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
  const contactEmail = settings?.contactEmail || 'okemabosco18@gmail.com';
  const contactPhone = settings?.contactPhone || '+1 (240) 926-0614';
  const contactLocation = settings?.contactLocation || 'Kampala, Uganda';
  const tagline = settings?.tagline || 'Ugandan Musician • Cultural Educator • Performer';
  const newsletterEnabled = settings?.newsletterEnabled !== false;

  const navToShow = navItems.length > 0 ? navItems : defaultNav;
  const seededSocials =
    socials.length > 0
      ? socials
      : [
          { id: '1', platform: 'Instagram', url: '#', icon: 'instagram' },
          { id: '2', platform: 'Facebook', url: '#', icon: 'facebook' },
          { id: '3', platform: 'YouTube', url: '#', icon: 'youtube' },
          { id: '4', platform: 'TikTok', url: '#', icon: 'tiktok' },
        ];
  const socialsToShow = seededSocials.filter((s: any) => !isMusicIconLink(s));

  const taglineLines = tagline.split('•').map((t: string) => t.trim());

  return (
    <footer className="bg-deep-charcoal text-warm-ivory w-full mt-section-gap">
      <div className="container-x py-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-12">
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
                  {getSocialIcon(s.icon, s.platform)}
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
                <a
                  href={`tel:${String(contactPhone).replace(/[^+\d]/g, '')}`}
                  className="hover:text-warm-ivory transition-colors"
                >
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
