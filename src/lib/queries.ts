import { prisma } from './db';

export async function getSiteSettings() {
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
  return prisma.socialLink.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  });
}

export async function getNavigation(name = 'main') {
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
  return prisma.event.findMany({
    where: { isPublished: true },
    include: { category: true, image: true },
    orderBy: { startDate: 'desc' },
  });
}

export async function getEventBySlug(slug: string) {
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
  return prisma.music.findMany({
    where: featuredOnly ? { isFeatured: true } : {},
    include: { album: true, artwork: true, audio: true },
    orderBy: { createdAt: 'desc' },
    ...(take ? { take } : {}),
  });
}

export async function getEducationPrograms() {
  return prisma.educationProgram.findMany({
    where: { isPublished: true },
    include: { heroImage: true, seo: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getEducationProgramBySlug(slug: string) {
  return prisma.educationProgram.findFirst({
    where: { slug, isPublished: true },
    include: { heroImage: true, seo: { include: { socialImage: true } } },
  });
}

export async function getInstruments() {
  return prisma.instrument.findMany({
    where: { isVisible: true },
    include: { image: true },
    orderBy: { order: 'asc' },
  });
}

export async function getArticles(take?: number) {
  return prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true, featuredImage: true, author: true },
    orderBy: { publishDate: 'desc' },
    ...(take ? { take } : {}),
  });
}

export async function getArticleBySlug(slug: string) {
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
  return prisma.press.findMany({
    include: { image: true },
    orderBy: { date: 'desc' },
  });
}

export async function getGalleryImages(type?: 'image' | 'video') {
  return prisma.media.findMany({
    where: { type: type === 'video' ? 'VIDEO' : 'IMAGE' },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}
