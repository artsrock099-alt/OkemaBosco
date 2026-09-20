import { prisma, isDatabaseConfigured } from './db';
import { getSiteSettings } from './queries';

/**
 * Background image or video for a built-in page hero, set from the admin.
 * Returns null when nothing has been saved for that page.
 */
export async function getHeroBackground(pageSlug: string) {
  if (!isDatabaseConfigured) return null;
  try {
    return await prisma.heroBackground.findUnique({ where: { pageSlug } });
  } catch (error) {
    console.warn(`Hero background for "${pageSlug}" could not be loaded:`, error);
    return null;
  }
}

export { getSiteSettings };
