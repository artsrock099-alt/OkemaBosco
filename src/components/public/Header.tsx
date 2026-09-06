import HeaderClient from './HeaderClient';
import { getNavigation, getSiteSettings } from '@/lib/queries';

export async function Header() {
  let brandName = 'BOSCO OKEMA';
  let navItems: any[] = [];

  try {
    const [nav, settings] = await Promise.all([
      getNavigation('main'),
      getSiteSettings(),
    ]);

    if (settings?.siteName) {
      brandName = settings.siteName.toUpperCase();
    }

    if (nav?.items) {
      navItems = nav.items.map((item) => ({
        id: item.id,
        label: item.label,
        url: item.url,
        isExternal: item.isExternal,
        children: (item.children || []).map((c) => ({
          id: c.id,
          label: c.label,
          url: c.url,
          isExternal: c.isExternal,
          children: [],
        })),
      }));
    }
  } catch (error) {
    console.warn('Header CMS fetch failed, using fallback:', error);
  }

  return <HeaderClient brandName={brandName} navItems={navItems} />;
}
