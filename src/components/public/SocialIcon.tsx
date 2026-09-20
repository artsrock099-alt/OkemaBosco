import { Instagram, Facebook, Youtube, Twitter, Linkedin, Globe } from 'lucide-react';

/**
 * One place for the social icons used by the footer and the contact page, so a
 * link added in the admin always renders with the right glyph.
 */

export function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.3-.02-.46.13-.6.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.45s1.06 2.85 1.2 3.05c.15.2 2.08 3.32 5.04 4.52 2.96 1.19 3.29.95 3.88.9.59-.05 1.9-.77 2.17-1.52.27-.75.27-1.39.2-1.52-.08-.13-.28-.2-.58-.35zM12.04 2C6.58 2 2.14 6.45 2.14 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.51 2 12.04 2zm0 18.02h-.01c-1.48 0-2.94-.4-4.21-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.23 8.23 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.22 8.23z" />
    </svg>
  );
}

export function TikTokIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: TikTokIcon,
  twitter: Twitter,
  x: Twitter,
  linkedin: Linkedin,
  whatsapp: WhatsAppIcon,
  globe: Globe,
};

/** Links whose icon has no brand glyph (Spotify, "music", ...) are skipped. */
const NON_BRAND_ICON_KEYS = ['music', 'spotify', 'soundcloud', 'apple music', 'itunes'];

export function getSocialIcon(iconName?: string | null, platform?: string | null, className = 'w-5 h-5') {
  const key = (iconName || platform || '').toLowerCase().trim();
  const Icon = iconMap[key];
  if (Icon) return <Icon className={className} />;
  return <Globe className={className} />;
}

export function isMusicIconLink(link: { icon?: string | null; platform?: string | null }) {
  const icon = (link.icon || '').toLowerCase().trim();
  const platform = (link.platform || '').toLowerCase().trim();
  if (iconMap[icon] || iconMap[platform]) return false;
  return NON_BRAND_ICON_KEYS.some((key) => icon === key || platform === key);
}
