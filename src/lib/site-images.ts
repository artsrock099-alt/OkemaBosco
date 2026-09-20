import { prisma, isDatabaseConfigured } from './db';
import { SITE_IMAGE_SLOTS, getSiteImageSlot } from './site-image-slots';

export type ResolvedImage = { url: string; alt: string; isCustom: boolean };

export type SiteImageMap = Record<string, ResolvedImage>;

/**
 * Resolve every picture slot to the URL the layout should render.
 *
 * A saved row wins over the coded default, and an empty url in a saved row
 * means "no picture here" so the section renders without one.
 */
export async function getSiteImages(): Promise<SiteImageMap> {
  const map: SiteImageMap = {};
  for (const slot of SITE_IMAGE_SLOTS) {
    map[slot.key] = { url: slot.defaultUrl, alt: slot.defaultAlt, isCustom: false };
  }

  if (!isDatabaseConfigured) return map;

  try {
    const rows = await prisma.siteImage.findMany();
    for (const row of rows) {
      if (!Object.prototype.hasOwnProperty.call(map, row.key)) continue;
      const slot = getSiteImageSlot(row.key);
      const url = (row.url || '').trim();
      map[row.key] = {
        url,
        alt: row.altText?.trim() || slot?.defaultAlt || '',
        isCustom: true,
      };
    }
  } catch (error) {
    console.warn('Site images could not be loaded, using the layout defaults:', error);
  }

  return map;
}

/**
 * Convenience helper for a single picture. Falls back to the coded default
 * when the database cannot be reached.
 */
export async function getSiteImage(key: string): Promise<ResolvedImage> {
  const slot = getSiteImageSlot(key);
  const fallback: ResolvedImage = {
    url: slot?.defaultUrl || '',
    alt: slot?.defaultAlt || '',
    isCustom: false,
  };

  if (!isDatabaseConfigured) return fallback;

  try {
    const row = await prisma.siteImage.findUnique({ where: { key } });
    if (!row) return fallback;
    return {
      url: (row.url || '').trim(),
      alt: row.altText?.trim() || fallback.alt,
      isCustom: true,
    };
  } catch (error) {
    console.warn(`Site image "${key}" could not be loaded, using the layout default:`, error);
    return fallback;
  }
}
