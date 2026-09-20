/**
 * Every picture that sits inside a coded page layout.
 *
 * The layouts ship with a real photograph for each slot, and the admin can
 * swap, remove or reset any of them from Admin -> Website -> Site images.
 * Page hero backgrounds are managed separately, in Admin -> Hero backgrounds.
 *
 * Keys are permanent: they are what the database rows are matched against, so
 * rename a key only if you also move the existing row.
 */

export type SiteImageSlot = {
  /** Stable identifier, also used as the database key. */
  key: string;
  /** Route slug the picture belongs to, used to group the admin screen. */
  pageSlug: string;
  /** Human readable page name, for the admin screen. */
  pageTitle: string;
  /** What the picture shows, for the admin screen. */
  label: string;
  /** Photograph the layout ships with. */
  defaultUrl: string;
  defaultAlt: string;
};

export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  // ---------------------------------------------------------------- Homepage
  {
    key: 'home-intro',
    pageSlug: 'home',
    pageTitle: 'Homepage',
    label: 'Introduction portrait',
    defaultUrl: '/OKema/pic4.jpeg',
    defaultAlt: 'Bosco Okema with his instruments',
  },
  {
    key: 'home-service-live',
    pageSlug: 'home',
    pageTitle: 'Homepage',
    label: 'Offering: live performance',
    defaultUrl: '/OKema/pic3.jpeg',
    defaultAlt: 'Bosco Okema performing live on stage',
  },
  {
    key: 'home-service-school',
    pageSlug: 'home',
    pageTitle: 'Homepage',
    label: 'Offering: school residency',
    defaultUrl: '/OKema/schoolresidency3.jpg',
    defaultAlt: 'Students taking part in a music workshop',
  },
  {
    key: 'home-service-elderly',
    pageSlug: 'home',
    pageTitle: 'Homepage',
    label: 'Offering: elderly visits',
    defaultUrl: '/OKema/ElderFlower1.jpeg',
    defaultAlt: 'Bosco Okema playing music for residents',
  },
  {
    key: 'home-video-thumbnail',
    pageSlug: 'home',
    pageTitle: 'Homepage',
    label: 'Featured video poster',
    defaultUrl: '/OKema/IMG_4864.JPG',
    defaultAlt: 'Bosco Okema singing during a live performance',
  },

  // ------------------------------------------------------------------- About
  {
    key: 'about-story',
    pageSlug: 'about',
    pageTitle: 'About Bosco',
    label: 'Story portrait',
    defaultUrl: '/OKema/AboutOkema.jpg',
    defaultAlt: 'Portrait of Bosco Okema with his instrument',
  },
  {
    key: 'about-collage-1',
    pageSlug: 'about',
    pageTitle: 'About Bosco',
    label: 'Work collage, top left',
    defaultUrl: '/OKema/culturePerformance.JPG',
    defaultAlt: 'Bosco Okema in cultural performance',
  },
  {
    key: 'about-collage-2',
    pageSlug: 'about',
    pageTitle: 'About Bosco',
    label: 'Work collage, top right',
    defaultUrl: '/OKema/liveperformance1.JPG',
    defaultAlt: 'Bosco Okema performing live',
  },
  {
    key: 'about-collage-3',
    pageSlug: 'about',
    pageTitle: 'About Bosco',
    label: 'Work collage, bottom left',
    defaultUrl: '/OKema/schoolresidency2.jpg',
    defaultAlt: 'Children learning traditional music',
  },
  {
    key: 'about-collage-4',
    pageSlug: 'about',
    pageTitle: 'About Bosco',
    label: 'Work collage, bottom right',
    defaultUrl: '/OKema/schoolresidency4.jpeg',
    defaultAlt: 'Music workshop in a classroom',
  },

  // --------------------------------------------------------------- Education
  {
    key: 'education-program-school',
    pageSlug: 'education',
    pageTitle: 'Education',
    label: 'Program: school residency',
    defaultUrl: '/OKema/schoolresidency6.jpeg',
    defaultAlt: 'Students playing traditional instruments',
  },
  {
    key: 'education-program-elderly',
    pageSlug: 'education',
    pageTitle: 'Education',
    label: 'Program: elderly visits',
    defaultUrl: '/OKema/PrimRoseElders9.jpeg',
    defaultAlt: 'Residents enjoying a live music visit',
  },
  {
    key: 'education-program-live',
    pageSlug: 'education',
    pageTitle: 'Education',
    label: 'Program: live performance',
    defaultUrl: '/OKema/liveperformance2.JPG',
    defaultAlt: 'Bosco Okema performing with his band',
  },

  // -------------------------------------------------------- School residency
  {
    key: 'school-residency-feature',
    pageSlug: 'education/school-residency',
    pageTitle: 'School Residency',
    label: 'Feature portrait',
    defaultUrl: '/OKema/schoolresidency7.jpeg',
    defaultAlt: 'Bosco Okema leading a school workshop',
  },
  {
    key: 'school-residency-gallery-1',
    pageSlug: 'education/school-residency',
    pageTitle: 'School Residency',
    label: 'Gallery photo 1',
    defaultUrl: '/OKema/schoolresidency8.jpeg',
    defaultAlt: 'Students gathered around traditional instruments',
  },
  {
    key: 'school-residency-gallery-2',
    pageSlug: 'education/school-residency',
    pageTitle: 'School Residency',
    label: 'Gallery photo 2',
    defaultUrl: '/OKema/schoolresidency9.jpeg',
    defaultAlt: 'Hands-on instrument session with students',
  },
  {
    key: 'school-residency-gallery-3',
    pageSlug: 'education/school-residency',
    pageTitle: 'School Residency',
    label: 'Gallery photo 3',
    defaultUrl: '/OKema/schoolresidency10.jpeg',
    defaultAlt: 'Students joining in with percussion',
  },
  {
    key: 'school-residency-gallery-4',
    pageSlug: 'education/school-residency',
    pageTitle: 'School Residency',
    label: 'Gallery photo 4',
    defaultUrl: '/OKema/schoolresidency12.jpeg',
    defaultAlt: 'A student trying a traditional instrument',
  },
  {
    key: 'school-residency-gallery-5',
    pageSlug: 'education/school-residency',
    pageTitle: 'School Residency',
    label: 'Gallery photo 5',
    defaultUrl: '/OKema/schoolresidency13.jpeg',
    defaultAlt: 'Classroom music session in progress',
  },
  {
    key: 'school-residency-gallery-6',
    pageSlug: 'education/school-residency',
    pageTitle: 'School Residency',
    label: 'Gallery photo 6',
    defaultUrl: '/OKema/schoolresidency14.jpeg',
    defaultAlt: 'Students singing together during a residency',
  },
  {
    key: 'school-residency-gallery-7',
    pageSlug: 'education/school-residency',
    pageTitle: 'School Residency',
    label: 'Gallery photo 7',
    defaultUrl: '/OKema/schoolresidency15.jpeg',
    defaultAlt: 'A whole class taking part in the workshop',
  },

  // ------------------------------------------------------------ Elderly visits
  {
    key: 'elderly-visits-story',
    pageSlug: 'education/elderly-visits',
    pageTitle: 'Elderly Visits',
    label: 'Why it matters portrait',
    defaultUrl: '/OKema/PrimRoseElders4.jpeg',
    defaultAlt: 'Residents sharing a musical moment',
  },

  // --------------------------------------------------------- Live performance
  {
    key: 'live-performance-story',
    pageSlug: 'live-performance',
    pageTitle: 'Live Performance',
    label: 'About the music photo',
    defaultUrl: '/OKema/liveperformance2.JPG',
    defaultAlt: 'Bosco Okema playing a drum on stage',
  },
  {
    key: 'live-performance-video-thumbnail',
    pageSlug: 'live-performance',
    pageTitle: 'Live Performance',
    label: 'Video poster',
    defaultUrl: '/OKema/IMG_4864.JPG',
    defaultAlt: 'Bosco Okema singing during a live performance',
  },

  // ------------------------------------------------------------------- Listen
  {
    key: 'listen-video-1',
    pageSlug: 'listen',
    pageTitle: 'Listen',
    label: 'Video tile 1 poster',
    defaultUrl: '/OKema/liveperformance2.JPG',
    defaultAlt: 'Adungu solo performed live',
  },
  {
    key: 'listen-video-2',
    pageSlug: 'listen',
    pageTitle: 'Listen',
    label: 'Video tile 2 poster',
    defaultUrl: '/OKema/liveperformance1.JPG',
    defaultAlt: 'Bosco Okema performing with the ensemble',
  },

  // -------------------------------------------------------------------- Media
  {
    key: 'media-collection-gallery',
    pageSlug: 'media',
    pageTitle: 'Media',
    label: 'Tile: Gallery',
    defaultUrl: '/OKema/pic2.jpeg',
    defaultAlt: 'Bosco Okema holding a traditional Adungu instrument',
  },
  {
    key: 'media-collection-videos',
    pageSlug: 'media',
    pageTitle: 'Media',
    label: 'Tile: Videos',
    defaultUrl: '/OKema/IMG_4864.JPG',
    defaultAlt: 'Bosco Okema singing during a live performance',
  },
  {
    key: 'media-collection-instruments',
    pageSlug: 'media',
    pageTitle: 'Media',
    label: 'Tile: Instrument Gallery',
    defaultUrl: '/OKema/pic7.png',
    defaultAlt: 'Handmade Ugandan thumb piano',
  },
  {
    key: 'media-collection-press',
    pageSlug: 'media',
    pageTitle: 'Media',
    label: 'Tile: Press',
    defaultUrl: '/OKema/schoolresidency9.jpeg',
    defaultAlt: 'Bosco Okema at work in a classroom',
  },
  {
    key: 'media-articles-banner',
    pageSlug: 'media',
    pageTitle: 'Media',
    label: 'Stories banner',
    defaultUrl: '/OKema/pic3.jpeg',
    defaultAlt: 'Bosco Okema performing live on stage',
  },
];

export function getSiteImageSlot(key: string): SiteImageSlot | undefined {
  return SITE_IMAGE_SLOTS.find((slot) => slot.key === key);
}

/** Public route a slot's page lives at, used to refresh the page cache. */
export function publicPathForPage(pageSlug: string): string {
  const clean = pageSlug.replace(/^\/+|\/+$/g, '');
  return clean === '' || clean === 'home' ? '/' : `/${clean}`;
}

/** Slots grouped by page, in registry order, for the admin screen. */
export function groupSiteImageSlots() {
  const groups: { pageSlug: string; pageTitle: string; slots: SiteImageSlot[] }[] = [];
  for (const slot of SITE_IMAGE_SLOTS) {
    let group = groups.find((g) => g.pageSlug === slot.pageSlug);
    if (!group) {
      group = { pageSlug: slot.pageSlug, pageTitle: slot.pageTitle, slots: [] };
      groups.push(group);
    }
    group.slots.push(slot);
  }
  return groups;
}
