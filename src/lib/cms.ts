import { getPageBySlug } from '@/lib/queries';

/**
 * Returns the CMS sections for a built-in route, or null when the page has not
 * been made editable (or is still a draft). Public pages use this to decide
 * whether to render CMS sections instead of their designed layout.
 */
export async function getCmsSections(slug: string) {
  try {
    const page = await getPageBySlug(slug);
    return page?.sections && page.sections.length > 0 ? page.sections : null;
  } catch (error) {
    console.warn(`CMS sections for "${slug}" could not be loaded:`, error);
    return null;
  }
}
