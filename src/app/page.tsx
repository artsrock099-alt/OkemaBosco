import SectionRenderer from '@/components/public/SectionRenderer';
import HomeFallback from '@/components/public/HomeFallback';
import EventsMarquee from '@/components/public/EventsMarquee';
import { getHomepage } from '@/lib/queries';

/**
 * Homepage is CMS-driven: it renders the sections configured in the Page
 * Builder (admin -> Pages -> Home). If no published homepage page exists yet,
 * it falls back to the curated default design so the site never appears empty.
 *
 * Either way, the upcoming-events ticker sits directly under the hero.
 */
export default async function HomePage() {
  const homepage = await getHomepage();

  if (homepage?.sections && homepage.sections.length > 0) {
    return <SectionRenderer sections={homepage.sections} afterFirst={<EventsMarquee />} />;
  }

  return <HomeFallback />;
}
