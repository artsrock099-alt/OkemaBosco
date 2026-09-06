import { prisma, isDatabaseConfigured } from './db';

export async function getSiteSettings() {
  if (!isDatabaseConfigured) return null;
  const settings = await prisma.siteSettings.findFirst({
    include: {
      defaultHeroImage: true,
      logoImage: true,
      favicon: true,
    },
  });
  return settings;
}

export async function getSocialLinks() {
  if (!isDatabaseConfigured) return [];
  return prisma.socialLink.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  });
}

export async function getNavigation(name = 'main') {
  if (!isDatabaseConfigured) return null;
  return prisma.navigation.findFirst({
    where: { name },
    include: {
      items: {
        where: { isVisible: true, parentId: null },
        orderBy: { order: 'asc' },
        include: {
          children: {
            where: { isVisible: true },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });
}

export async function getHomepage() {
  if (!isDatabaseConfigured) return null;
  return prisma.page.findFirst({
    where: { isHomepage: true, status: 'PUBLISHED' },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { order: 'asc' },
      },
      seo: { include: { socialImage: true } },
    },
  });
}

export async function getPageBySlug(slug: string) {
  if (!isDatabaseConfigured) return null;
  return prisma.page.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { order: 'asc' },
      },
      seo: { include: { socialImage: true } },
    },
  });
}

export async function getUpcomingEvents(take = 5) {
  if (!isDatabaseConfigured) return [];
  return prisma.event.findMany({
    where: {
      isPublished: true,
      startDate: { gte: new Date() },
    },
    include: { category: true, image: true },
    orderBy: { startDate: 'asc' },
    take,
  });
}

export async function getPastEvents(take = 10) {
  if (!isDatabaseConfigured) return [];
  return prisma.event.findMany({
    where: {
      isPublished: true,
      startDate: { lt: new Date() },
    },
    include: { category: true, image: true },
    orderBy: { startDate: 'desc' },
    take,
  });
}

export async function getAllEvents() {
  if (!isDatabaseConfigured) return [];
  return prisma.event.findMany({
    where: { isPublished: true },
    include: { category: true, image: true },
    orderBy: { startDate: 'desc' },
  });
}

export async function getEventBySlug(slug: string) {
  if (!isDatabaseConfigured) return null;
  return prisma.event.findFirst({
    where: { slug, isPublished: true },
    include: {
      category: true,
      image: true,
      seo: { include: { socialImage: true } },
    },
  });
}

export async function getTestimonials(featuredOnly = false, take?: number) {
  if (!isDatabaseConfigured) return [];
  return prisma.testimonial.findMany({
    where: {
      isVisible: true,
      ...(featuredOnly ? { isFeatured: true } : {}),
    },
    include: { image: true },
    orderBy: { order: 'asc' },
    ...(take ? { take } : {}),
  });
}

export async function getMusic(featuredOnly = false, take?: number) {
  if (!isDatabaseConfigured) return [];
  return prisma.music.findMany({
    where: featuredOnly ? { isFeatured: true } : {},
    include: { album: true, artwork: true, audio: true },
    orderBy: { createdAt: 'desc' },
    ...(take ? { take } : {}),
  });
}

export async function getEducationPrograms() {
  if (!isDatabaseConfigured) return [];
  return prisma.educationProgram.findMany({
    where: { isPublished: true },
    include: { heroImage: true, seo: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getEducationProgramBySlug(slug: string) {
  if (!isDatabaseConfigured) return null;
  return prisma.educationProgram.findFirst({
    where: { slug, isPublished: true },
    include: { heroImage: true, seo: { include: { socialImage: true } } },
  });
}

export async function getInstruments() {
  if (!isDatabaseConfigured) return [];
  return prisma.instrument.findMany({
    where: { isVisible: true },
    include: { image: true },
    orderBy: { order: 'asc' },
  });
}

export async function getArticles(take?: number) {
  if (!isDatabaseConfigured) return [];
  return prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true, featuredImage: true, author: true },
    orderBy: { publishDate: 'desc' },
    ...(take ? { take } : {}),
  });
}

export async function getArticleBySlug(slug: string) {
  if (!isDatabaseConfigured) return null;
  return prisma.article.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      tags: true,
      featuredImage: true,
      author: true,
      seo: { include: { socialImage: true } },
    },
  });
}

export async function getPressItems() {
  if (!isDatabaseConfigured) return [];
  return prisma.press.findMany({
    include: { image: true },
    orderBy: { date: 'desc' },
  });
}

export async function getGalleryImages(type?: 'image' | 'video') {
  if (!isDatabaseConfigured) return [];
  return prisma.media.findMany({
    where: { type: type === 'video' ? 'VIDEO' : 'IMAGE' },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}
