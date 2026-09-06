'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from './db';
import { auth } from './auth';
import { ALL_ADMIN_ROLES, requireRole, ROLE_PERMISSIONS, hasPermission } from './rbac';
import { createAuditLog } from './audit';
import { slugify } from './utils';
import { eventSchema, articleSchema, testimonialSchema, pageSectionSchema } from './validations';
import type { Role, BookingStatus } from '@prisma/client';

type ActionResult = { success: boolean; message?: string; data?: any; error?: string };

export type FormState = { success?: boolean; message?: string; data?: any; error?: string };

async function ensurePermission(permission: string): Promise<{ id: string; role: Role }> {
  const session = await auth();
  if (!session || !ALL_ADMIN_ROLES.includes(session.user.role)) {
    redirect('/admin/login');
  }
  const perms = ROLE_PERMISSIONS[session.user.role] || [];
  if (!perms.includes(permission) && !perms.includes(permission.replace('manage', 'edit').replace('manage', 'view'))) {
    if (!hasPermission(session.user.role, ALL_ADMIN_ROLES as any)) {
      redirect('/admin/403');
    }
  }
  return { id: session.user.id, role: session.user.role };
}

// ==================== EVENTS ====================

export async function createEvent(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('events:manage');

  try {
    const data = {
      title: formData.get('title') as string,
      slug: (formData.get('slug') as string) || slugify(formData.get('title') as string),
      categoryId: (formData.get('categoryId') as string) || undefined,
      startDate: new Date(formData.get('startDate') as string),
      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
      time: (formData.get('time') as string) || undefined,
      venue: (formData.get('venue') as string) || undefined,
      location: (formData.get('location') as string) || undefined,
      mapUrl: (formData.get('mapUrl') as string) || undefined,
      description: (formData.get('description') as string) || undefined,
      shortDescription: (formData.get('shortDescription') as string) || undefined,
      imageId: (formData.get('imageId') as string) || undefined,
      videoUrl: (formData.get('videoUrl') as string) || undefined,
      ticketUrl: (formData.get('ticketUrl') as string) || undefined,
      registrationUrl: (formData.get('registrationUrl') as string) || undefined,
      isPublished: formData.get('isPublished') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
    };

    const parsed = eventSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: 'Validation failed', error: parsed.error.issues[0]?.message };
    }

    const event = await prisma.event.create({ data: parsed.data });

    await createAuditLog('CREATE', 'EVENT', event.id, user.id, { title: event.title });
    revalidatePath('/admin/events');
    revalidatePath('/events');
    return { success: true, message: 'Event created', data: { id: event.id, slug: event.slug } };
  } catch (error: any) {
    return { success: false, message: 'Failed to create event', error: error?.message };
  }
}

export async function updateEvent(id: string, prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('events:manage');

  try {
    const data = {
      title: formData.get('title') as string,
      slug: (formData.get('slug') as string) || slugify(formData.get('title') as string),
      categoryId: (formData.get('categoryId') as string) || undefined,
      startDate: new Date(formData.get('startDate') as string),
      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
      time: (formData.get('time') as string) || undefined,
      venue: (formData.get('venue') as string) || undefined,
      location: (formData.get('location') as string) || undefined,
      mapUrl: (formData.get('mapUrl') as string) || undefined,
      description: (formData.get('description') as string) || undefined,
      shortDescription: (formData.get('shortDescription') as string) || undefined,
      imageId: (formData.get('imageId') as string) || undefined,
      videoUrl: (formData.get('videoUrl') as string) || undefined,
      ticketUrl: (formData.get('ticketUrl') as string) || undefined,
      registrationUrl: (formData.get('registrationUrl') as string) || undefined,
      isPublished: formData.get('isPublished') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
    };

    const parsed = eventSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: 'Validation failed', error: parsed.error.issues[0]?.message };
    }

    const event = await prisma.event.update({ where: { id }, data: parsed.data });

    await createAuditLog('UPDATE', 'EVENT', event.id, user.id, { title: event.title });
    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath(`/events/${event.slug}`);
    return { success: true, message: 'Event updated' };
  } catch (error: any) {
    return { success: false, message: 'Failed to update event', error: error?.message };
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const user = await ensurePermission('events:manage');
  try {
    const ev = await prisma.event.delete({ where: { id } });
    await createAuditLog('DELETE', 'EVENT', id, user.id, { title: ev.title });
    revalidatePath('/admin/events');
    revalidatePath('/events');
    return { success: true, message: 'Event deleted' };
  } catch (error: any) {
    return { success: false, message: 'Failed to delete event', error: error?.message };
  }
}

export async function createEventCategory(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('events:manage');
  try {
    const name = formData.get('name') as string;
    const category = await prisma.eventCategory.create({
      data: { name, slug: slugify(name) },
    });
    await createAuditLog('CREATE', 'EVENT_CATEGORY', category.id, user.id);
    revalidatePath('/admin/events/categories');
    return { success: true, data: { id: category.id } };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ==================== ARTICLES ====================

export async function createArticle(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('articles:manage');

  try {
    const data = {
      title: formData.get('title') as string,
      slug: (formData.get('slug') as string) || slugify(formData.get('title') as string),
      excerpt: (formData.get('excerpt') as string) || undefined,
      content: (formData.get('content') as string) || undefined,
      categoryId: (formData.get('categoryId') as string) || undefined,
      featuredImageId: (formData.get('featuredImageId') as string) || undefined,
      status: (formData.get('status') as any) || 'DRAFT',
      publishDate: formData.get('publishDate') ? new Date(formData.get('publishDate') as string) : (formData.get('status') === 'PUBLISHED' ? new Date() : undefined),
      authorId: user.id,
    };

    const parsed = articleSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: 'Validation failed', error: parsed.error.issues[0]?.message };
    }

    const article = await prisma.article.create({ data: { ...parsed.data, authorId: user.id, status: data.status, publishDate: data.publishDate } as any });

    await createAuditLog('CREATE', 'ARTICLE', article.id, user.id, { title: article.title });
    revalidatePath('/admin/articles');
    revalidatePath('/media/articles');
    return { success: true, message: 'Article created', data: { id: article.id, slug: article.slug } };
  } catch (error: any) {
    return { success: false, message: 'Failed to create article', error: error?.message };
  }
}

export async function updateArticle(id: string, prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('articles:manage');

  try {
    const data = {
      title: formData.get('title') as string,
      slug: (formData.get('slug') as string) || slugify(formData.get('title') as string),
      excerpt: (formData.get('excerpt') as string) || undefined,
      content: (formData.get('content') as string) || undefined,
      categoryId: (formData.get('categoryId') as string) || undefined,
      featuredImageId: (formData.get('featuredImageId') as string) || undefined,
      status: (formData.get('status') as any) || 'DRAFT',
      publishDate: formData.get('publishDate') ? new Date(formData.get('publishDate') as string) : undefined,
    };

    const parsed = articleSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: 'Validation failed', error: parsed.error.issues[0]?.message };
    }

    const article = await prisma.article.update({
      where: { id },
      data: { ...parsed.data, status: data.status, publishDate: data.publishDate } as any,
    });

    await createAuditLog('UPDATE', 'ARTICLE', article.id, user.id, { title: article.title });
    revalidatePath('/admin/articles');
    revalidatePath('/media/articles');
    revalidatePath(`/media/articles/${article.slug}`);
    return { success: true, message: 'Article updated' };
  } catch (error: any) {
    return { success: false, message: 'Failed to update article', error: error?.message };
  }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const user = await ensurePermission('articles:manage');
  try {
    const a = await prisma.article.delete({ where: { id } });
    await createAuditLog('DELETE', 'ARTICLE', id, user.id, { title: a.title });
    revalidatePath('/admin/articles');
    revalidatePath('/media/articles');
    return { success: true, message: 'Article deleted' };
  } catch (error: any) {
    return { success: false, message: 'Failed to delete article', error: error?.message };
  }
}

export async function createArticleCategory(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('articles:manage');
  try {
    const name = formData.get('name') as string;
    const cat = await prisma.articleCategory.create({ data: { name, slug: slugify(name) } });
    await createAuditLog('CREATE', 'ARTICLE_CATEGORY', cat.id, user.id);
    revalidatePath('/admin/articles/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function createArticleTag(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('articles:manage');
  try {
    const name = formData.get('name') as string;
    const tag = await prisma.articleTag.create({ data: { name, slug: slugify(name) } });
    await createAuditLog('CREATE', 'ARTICLE_TAG', tag.id, user.id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ==================== TESTIMONIALS ====================

export async function createTestimonial(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('testimonials:manage');

  try {
    const data = {
      quote: formData.get('quote') as string,
      name: formData.get('name') as string,
      organization: (formData.get('organization') as string) || undefined,
      role: (formData.get('role') as string) || undefined,
      imageId: (formData.get('imageId') as string) || undefined,
      order: parseInt(formData.get('order') as string) || 0,
      isFeatured: formData.get('isFeatured') === 'on',
      isVisible: formData.get('isVisible') !== 'off',
    };

    const parsed = testimonialSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: 'Validation failed', error: parsed.error.issues[0]?.message };
    }

    const t = await prisma.testimonial.create({ data: parsed.data });
    await createAuditLog('CREATE', 'TESTIMONIAL', t.id, user.id, { name: t.name });
    revalidatePath('/admin/testimonials');
    return { success: true, message: 'Testimonial created' };
  } catch (error: any) {
    return { success: false, message: 'Failed to create testimonial', error: error?.message };
  }
}

export async function updateTestimonial(id: string, prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('testimonials:manage');

  try {
    const data = {
      quote: formData.get('quote') as string,
      name: formData.get('name') as string,
      organization: (formData.get('organization') as string) || undefined,
      role: (formData.get('role') as string) || undefined,
      imageId: (formData.get('imageId') as string) || undefined,
      order: parseInt(formData.get('order') as string) || 0,
      isFeatured: formData.get('isFeatured') === 'on',
      isVisible: formData.get('isVisible') !== 'off',
    };

    const parsed = testimonialSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: 'Validation failed', error: parsed.error.issues[0]?.message };
    }

    const t = await prisma.testimonial.update({ where: { id }, data: parsed.data });
    await createAuditLog('UPDATE', 'TESTIMONIAL', id, user.id, { name: t.name });
    revalidatePath('/admin/testimonials');
    return { success: true, message: 'Testimonial updated' };
  } catch (error: any) {
    return { success: false, message: 'Failed to update testimonial', error: error?.message };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const user = await ensurePermission('testimonials:manage');
  try {
    await prisma.testimonial.delete({ where: { id } });
    await createAuditLog('DELETE', 'TESTIMONIAL', id, user.id);
    revalidatePath('/admin/testimonials');
    return { success: true, message: 'Testimonial deleted' };
  } catch (error: any) {
    return { success: false, message: 'Failed to delete testimonial', error: error?.message };
  }
}

// ==================== PAGES ====================

export async function createPage(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('pages:manage');

  try {
    const title = formData.get('title') as string;
    const slug = (formData.get('slug') as string) || slugify(title);
    const description = (formData.get('description') as string) || undefined;
    const status = (formData.get('status') as any) || 'DRAFT';
    const isHomepage = formData.get('isHomepage') === 'on';

    if (isHomepage) {
      await prisma.page.updateMany({ where: { isHomepage: true }, data: { isHomepage: false } });
    }

    const page = await prisma.page.create({
      data: { title, slug, description, status, isHomepage },
    });
    await createAuditLog('CREATE', 'PAGE', page.id, user.id, { title, slug });
    revalidatePath('/admin/pages');
    return { success: true, message: 'Page created', data: { id: page.id, slug } };
  } catch (error: any) {
    return { success: false, message: 'Failed to create page', error: error?.message };
  }
}

export async function updatePage(id: string, prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('pages:manage');

  try {
    const title = formData.get('title') as string;
    const slug = (formData.get('slug') as string) || slugify(title);
    const description = (formData.get('description') as string) || undefined;
    const status = (formData.get('status') as any) || 'DRAFT';
    const isHomepage = formData.get('isHomepage') === 'on';
    const publishDate = formData.get('publishDate') ? new Date(formData.get('publishDate') as string) : undefined;

    if (isHomepage) {
      await prisma.page.updateMany({
        where: { isHomepage: true, NOT: { id } },
        data: { isHomepage: false },
      });
    }

    await prisma.page.update({
      where: { id },
      data: { title, slug, description, status, isHomepage, publishDate },
    });
    await createAuditLog('UPDATE', 'PAGE', id, user.id, { slug });
    revalidatePath('/admin/pages');
    revalidatePath(`/${slug}`);
    return { success: true, message: 'Page updated' };
  } catch (error: any) {
    return { success: false, message: 'Failed to update page', error: error?.message };
  }
}

export async function deletePage(id: string): Promise<ActionResult> {
  const user = await ensurePermission('pages:manage');
  try {
    const page = await prisma.page.delete({ where: { id } });
    await createAuditLog('DELETE', 'PAGE', id, user.id, { slug: page.slug });
    revalidatePath('/admin/pages');
    return { success: true, message: 'Page deleted' };
  } catch (error: any) {
    return { success: false, message: 'Failed to delete page', error: error?.message };
  }
}

// ==================== PAGE SECTIONS / BUILDER ====================

export async function addSection(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('pages:manage');
  try {
    const pageId = formData.get('pageId') as string;
    const type = formData.get('type') as any;
    const last = await prisma.pageSection.findFirst({
      where: { pageId },
      orderBy: { order: 'desc' },
    });
    const section = await prisma.pageSection.create({
      data: { pageId, type, order: (last?.order ?? -1) + 1 },
    });
    await createAuditLog('CREATE', 'PAGE_SECTION', section.id, user.id, { type, pageId });
    revalidatePath(`/admin/builder`);
    revalidatePath(`/admin/builder/`);
    return { success: true, data: { id: section.id } };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function updateSection(id: string, content: any, settings: any): Promise<ActionResult> {
  const user = await ensurePermission('pages:manage');
  try {
    await prisma.pageSection.update({
      where: { id },
      data: { content, settings },
    });
    await createAuditLog('UPDATE', 'PAGE_SECTION', id, user.id);
    revalidatePath('/admin/builder');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function reorderSections(pageId: string, sectionIds: string[]): Promise<ActionResult> {
  const user = await ensurePermission('pages:manage');
  try {
    for (let i = 0; i < sectionIds.length; i++) {
      await prisma.pageSection.update({
        where: { id: sectionIds[i] },
        data: { order: i },
      });
    }
    await createAuditLog('REORDER', 'PAGE_SECTIONS', pageId, user.id);
    revalidatePath('/admin/builder');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function toggleSectionVisibility(id: string, isVisible: boolean): Promise<ActionResult> {
  const user = await ensurePermission('pages:manage');
  try {
    await prisma.pageSection.update({ where: { id }, data: { isVisible } });
    await createAuditLog('UPDATE', 'PAGE_SECTION_VISIBILITY', id, user.id, { isVisible });
    revalidatePath('/admin/builder');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function deleteSection(id: string): Promise<ActionResult> {
  const user = await ensurePermission('pages:manage');
  try {
    await prisma.pageSection.delete({ where: { id } });
    await createAuditLog('DELETE', 'PAGE_SECTION', id, user.id);
    revalidatePath('/admin/builder');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ==================== NAVIGATION ====================

export async function createNavItem(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('navigation:manage');
  try {
    const navigationId = formData.get('navigationId') as string;
    const label = formData.get('label') as string;
    const url = formData.get('url') as string;
    const isExternal = formData.get('isExternal') === 'on';
    const parentId = (formData.get('parentId') as string) || undefined;

    const last = await prisma.navigationItem.findFirst({
      where: { navigationId, parentId: parentId || null },
      orderBy: { order: 'desc' },
    });

    const item = await prisma.navigationItem.create({
      data: { navigationId, label, url, isExternal, parentId, order: (last?.order ?? -1) + 1 },
    });
    await createAuditLog('CREATE', 'NAV_ITEM', item.id, user.id, { label });
    revalidatePath('/admin/navigation');
    return { success: true, data: { id: item.id } };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function updateNavItem(id: string, prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('navigation:manage');
  try {
    await prisma.navigationItem.update({
      where: { id },
      data: {
        label: formData.get('label') as string,
        url: formData.get('url') as string,
        isExternal: formData.get('isExternal') === 'on',
        isVisible: formData.get('isVisible') !== 'off',
        order: parseInt(formData.get('order') as string) || 0,
      },
    });
    await createAuditLog('UPDATE', 'NAV_ITEM', id, user.id);
    revalidatePath('/admin/navigation');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function deleteNavItem(id: string): Promise<ActionResult> {
  const user = await ensurePermission('navigation:manage');
  try {
    await prisma.navigationItem.delete({ where: { id } });
    await createAuditLog('DELETE', 'NAV_ITEM', id, user.id);
    revalidatePath('/admin/navigation');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ==================== SITE SETTINGS ====================

export async function updateSiteSettings(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('settings:manage');
  try {
    const id = formData.get('id') as string;
    const data = {
      siteName: formData.get('siteName') as string,
      tagline: (formData.get('tagline') as string) || undefined,
      contactEmail: (formData.get('contactEmail') as string) || undefined,
      contactPhone: (formData.get('contactPhone') as string) || undefined,
      contactLocation: (formData.get('contactLocation') as string) || undefined,
      footerText: (formData.get('footerText') as string) || undefined,
      copyrightText: formData.get('copyrightText') as string,
      privacyPolicyUrl: (formData.get('privacyPolicyUrl') as string) || undefined,
      termsUrl: (formData.get('termsUrl') as string) || undefined,
      newsletterEnabled: formData.get('newsletterEnabled') === 'on',
      footerVisible: formData.get('footerVisible') !== 'off',
      defaultHeroImageId: (formData.get('defaultHeroImageId') as string) || undefined,
      logoImageId: (formData.get('logoImageId') as string) || undefined,
      faviconId: (formData.get('faviconId') as string) || undefined,
    };

    await prisma.siteSettings.upsert({
      where: { id: id || 'default' },
      create: { id: id || 'default', ...data },
      update: data,
    });
    await createAuditLog('UPDATE', 'SITE_SETTINGS', id || 'default', user.id);
    revalidatePath('/admin/settings');
    revalidatePath('/');
    return { success: true, message: 'Settings saved' };
  } catch (error: any) {
    return { success: false, message: 'Failed to save settings', error: error?.message };
  }
}

// ==================== SOCIAL LINKS ====================

export async function createSocialLink(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('settings:manage');
  try {
    const platform = formData.get('platform') as string;
    const url = formData.get('url') as string;
    const icon = (formData.get('icon') as string) || platform.toLowerCase();
    const label = (formData.get('label') as string) || undefined;

    const last = await prisma.socialLink.findFirst({ orderBy: { order: 'desc' } });
    const link = await prisma.socialLink.create({
      data: { platform, url, icon, label, order: (last?.order ?? -1) + 1, isVisible: true },
    });
    await createAuditLog('CREATE', 'SOCIAL_LINK', link.id, user.id, { platform });
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function updateSocialLink(id: string, prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('settings:manage');
  try {
    await prisma.socialLink.update({
      where: { id },
      data: {
        platform: formData.get('platform') as string,
        url: formData.get('url') as string,
        icon: formData.get('icon') as string,
        label: (formData.get('label') as string) || undefined,
        order: parseInt(formData.get('order') as string) || 0,
        isVisible: formData.get('isVisible') !== 'off',
      },
    });
    await createAuditLog('UPDATE', 'SOCIAL_LINK', id, user.id);
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function deleteSocialLink(id: string): Promise<ActionResult> {
  const user = await ensurePermission('settings:manage');
  try {
    await prisma.socialLink.delete({ where: { id } });
    await createAuditLog('DELETE', 'SOCIAL_LINK', id, user.id);
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ==================== BOOKINGS ====================

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<ActionResult> {
  const user = await ensurePermission('bookings:manage');
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    await createAuditLog('UPDATE_STATUS', 'BOOKING', bookingId, user.id, {
      status,
      reference: booking.reference,
    });
    revalidatePath('/admin/bookings');
    return { success: true, message: 'Status updated' };
  } catch (error: any) {
    return { success: false, message: 'Failed to update status', error: error?.message };
  }
}

export async function assignBooking(bookingId: string, userId: string | null): Promise<ActionResult> {
  const user = await ensurePermission('bookings:manage');
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { assignedToId: userId || undefined },
    });
    await createAuditLog('ASSIGN', 'BOOKING', bookingId, user.id, { userId });
    revalidatePath('/admin/bookings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function addBookingNote(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('bookings:manage');
  try {
    const bookingId = formData.get('bookingId') as string;
    const content = formData.get('content') as string;
    const isInternal = formData.get('isInternal') !== 'off';
    if (!content.trim()) return { success: false, error: 'Note content required' };

    const note = await prisma.bookingNote.create({
      data: { bookingId, content, userId: user.id, isInternal },
    });
    await createAuditLog('CREATE', 'BOOKING_NOTE', note.id, user.id, { bookingId });
    revalidatePath('/admin/bookings');
    return { success: true, data: { id: note.id } };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function deleteBookingNote(id: string): Promise<ActionResult> {
  const user = await ensurePermission('bookings:manage');
  try {
    await prisma.bookingNote.delete({ where: { id } });
    await createAuditLog('DELETE', 'BOOKING_NOTE', id, user.id);
    revalidatePath('/admin/bookings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ==================== MESSAGES ====================

export async function markMessageRead(id: string, read: boolean): Promise<ActionResult> {
  const user = await ensurePermission('bookings:manage');
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: read, repliedAt: read ? new Date() : undefined },
    });
    await createAuditLog('UPDATE_READ', 'CONTACT_MESSAGE', id, user.id);
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const user = await ensurePermission('bookings:manage');
  try {
    await prisma.contactMessage.delete({ where: { id } });
    await createAuditLog('DELETE', 'CONTACT_MESSAGE', id, user.id);
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ==================== EDUCATION PROGRAMS ====================

export async function createEducationProgram(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('education:manage');
  try {
    const title = formData.get('title') as string;
    const slug = (formData.get('slug') as string) || slugify(title);
    const program = await prisma.educationProgram.create({
      data: {
        title,
        slug,
        type: (formData.get('type') as any) || 'OTHER',
        shortDescription: (formData.get('shortDescription') as string) || undefined,
        content: (formData.get('content') as string) || undefined,
        heroImageId: (formData.get('heroImageId') as string) || undefined,
        ctaText: (formData.get('ctaText') as string) || undefined,
        ctaUrl: (formData.get('ctaUrl') as string) || undefined,
        isPublished: formData.get('isPublished') === 'on',
      },
    });
    await createAuditLog('CREATE', 'EDUCATION_PROGRAM', program.id, user.id, { title });
    revalidatePath('/admin/education');
    return { success: true, data: { id: program.id } };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function updateEducationProgram(id: string, prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('education:manage');
  try {
    const title = formData.get('title') as string;
    const slug = (formData.get('slug') as string) || slugify(title);
    await prisma.educationProgram.update({
      where: { id },
      data: {
        title,
        slug,
        type: (formData.get('type') as any) || 'OTHER',
        shortDescription: (formData.get('shortDescription') as string) || undefined,
        content: (formData.get('content') as string) || undefined,
        heroImageId: (formData.get('heroImageId') as string) || undefined,
        ctaText: (formData.get('ctaText') as string) || undefined,
        ctaUrl: (formData.get('ctaUrl') as string) || undefined,
        isPublished: formData.get('isPublished') === 'on',
      },
    });
    await createAuditLog('UPDATE', 'EDUCATION_PROGRAM', id, user.id, { slug });
    revalidatePath('/admin/education');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function deleteEducationProgram(id: string): Promise<ActionResult> {
  const user = await ensurePermission('education:manage');
  try {
    const p = await prisma.educationProgram.delete({ where: { id } });
    await createAuditLog('DELETE', 'EDUCATION_PROGRAM', id, user.id, { slug: p.slug });
    revalidatePath('/admin/education');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ==================== MUSIC ====================

export async function createMusic(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('music:manage');
  try {
    const title = formData.get('title') as string;
    const slug = (formData.get('slug') as string) || slugify(title);
    const music = await prisma.music.create({
      data: {
        title,
        slug,
        albumId: (formData.get('albumId') as string) || undefined,
        artworkId: (formData.get('artworkId') as string) || undefined,
        audioId: (formData.get('audioId') as string) || undefined,
        year: formData.get('year') ? parseInt(formData.get('year') as string) : undefined,
        duration: formData.get('duration') ? parseInt(formData.get('duration') as string) : undefined,
        description: (formData.get('description') as string) || undefined,
        isFeatured: formData.get('isFeatured') === 'on',
        isLive: formData.get('isLive') === 'on',
      },
    });
    await createAuditLog('CREATE', 'MUSIC', music.id, user.id, { title });
    revalidatePath('/admin/music');
    return { success: true, data: { id: music.id } };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function deleteMusic(id: string): Promise<ActionResult> {
  const user = await ensurePermission('music:manage');
  try {
    const m = await prisma.music.delete({ where: { id } });
    await createAuditLog('DELETE', 'MUSIC', id, user.id, { slug: m.slug });
    revalidatePath('/admin/music');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ==================== NEWSLETTER SUBSCRIBERS ====================

export async function toggleNewsletterActive(id: string, active: boolean): Promise<ActionResult> {
  const user = await ensurePermission('newsletter:manage');
  try {
    await prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        isActive: active,
        unsubscribedAt: active ? null : new Date(),
      },
    });
    await createAuditLog('UPDATE', 'NEWSLETTER_SUBSCRIBER', id, user.id, { active });
    revalidatePath('/admin/newsletter');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function deleteSubscriber(id: string): Promise<ActionResult> {
  const user = await ensurePermission('newsletter:manage');
  try {
    await prisma.newsletterSubscriber.delete({ where: { id } });
    await createAuditLog('DELETE', 'NEWSLETTER_SUBSCRIBER', id, user.id);
    revalidatePath('/admin/newsletter');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function createCampaign(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('newsletter:manage');
  try {
    const subject = formData.get('subject') as string;
    const content = (formData.get('content') as string) || undefined;
    const previewText = (formData.get('previewText') as string) || undefined;
    const campaign = await prisma.newsletterCampaign.create({
      data: { subject, content, previewText, status: 'DRAFT' },
    });
    await createAuditLog('CREATE', 'NEWSLETTER_CAMPAIGN', campaign.id, user.id);
    revalidatePath('/admin/newsletter/campaigns');
    return { success: true, data: { id: campaign.id } };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ==================== USERS ====================

export async function createUser(prev: any, formData: FormData): Promise<ActionResult> {
  const user = await ensurePermission('users:manage');
  try {
    const bcrypt = require('bcryptjs');
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const hashed = await bcrypt.hash(password || 'changeme123', 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: (formData.get('name') as string) || undefined,
        role: (formData.get('role') as any) || 'EDITOR',
      },
    });
    await createAuditLog('CREATE', 'USER', newUser.id, user.id, { email, role: newUser.role });
    revalidatePath('/admin/users');
    return { success: true, data: { id: newUser.id } };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function updateUserRole(id: string, role: Role): Promise<ActionResult> {
  const user = await ensurePermission('users:manage');
  try {
    await prisma.user.update({ where: { id }, data: { role } });
    await createAuditLog('UPDATE_ROLE', 'USER', id, user.id, { role });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Only Super Admin can delete users' };
  }
  try {
    await prisma.user.delete({ where: { id } });
    await createAuditLog('DELETE', 'USER', id, session.user.id);
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ==================== MEDIA ====================

export async function deleteMedia(id: string): Promise<ActionResult> {
  const user = await ensurePermission('media:manage');
  try {
    const m = await prisma.media.findUnique({ where: { id } });
    if (m && m.url) {
      const { deleteFile } = require('./storage');
      await deleteFile(m.url);
    }
    await prisma.media.delete({ where: { id } });
    await createAuditLog('DELETE', 'MEDIA', id, user.id, m ? { filename: m.filename } : {});
    revalidatePath('/admin/media');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

// ==================== PAYMENTS ====================

export async function updatePaymentStatus(
  id: string,
  status: any
): Promise<ActionResult> {
  const user = await ensurePermission('payments:manage');
  try {
    const paidAt = status === 'PAID' ? new Date() : undefined;
    await prisma.payment.update({ where: { id }, data: { status, paidAt } });
    await createAuditLog('UPDATE_STATUS', 'PAYMENT', id, user.id, { status });
    revalidatePath('/admin/payments');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}
