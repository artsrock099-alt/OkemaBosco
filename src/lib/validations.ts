import { z } from 'zod';

export const bookingSchema = z.object({
  type: z.enum([
    'LIVE_PERFORMANCE',
    'SCHOOL_RESIDENCY',
    'ELDERLY_VISIT',
    'CULTURAL_PRESENTATION',
    'WORKSHOP',
    'FESTIVAL',
    'PRIVATE_EVENT',
    'OTHER',
  ]),
  eventDate: z.coerce.date(),
  alternativeDate: z.coerce.date().optional(),
  venue: z.string().min(2, 'Venue is required').max(200),
  location: z.string().min(2, 'Location is required').max(200),
  expectedAudience: z.string().max(100).optional(),
  eventDescription: z.string().max(2000).optional(),
  budget: z.coerce.number().positive().optional(),
  customerName: z.string().min(2, 'Name is required').max(100),
  organization: z.string().max(200).optional(),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().max(50).optional(),
  additionalInfo: z.string().max(2000).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  organization: z.string().max(200).optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50).optional(),
  subject: z.string().min(2, 'Subject is required').max(200),
  message: z.string().min(10, 'Message is too short').max(5000),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
});

export const eventSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  categoryId: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  time: z.string().optional(),
  venue: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  mapUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  imageId: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  ticketUrl: z.string().url().optional().or(z.literal('')),
  registrationUrl: z.string().url().optional().or(z.literal('')),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export const articleSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  categoryId: z.string().optional(),
  featuredImageId: z.string().optional(),
});

export const testimonialSchema = z.object({
  quote: z.string().min(10).max(2000),
  name: z.string().min(2).max(100),
  organization: z.string().max(200).optional(),
  role: z.string().max(100).optional(),
  imageId: z.string().optional(),
  order: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true),
});

export const pageSectionSchema = z.object({
  type: z.enum([
    'HERO',
    'RICH_TEXT',
    'IMAGE',
    'IMAGE_TEXT',
    'VIDEO',
    'AUDIO',
    'GALLERY',
    'EVENTS',
    'MUSIC',
    'TESTIMONIALS',
    'QUOTE',
    'CTA',
    'BUTTONS',
    'FAQ',
    'NEWSLETTER',
    'CONTACT_FORM',
    'BOOKING_FORM',
    'SOCIAL_LINKS',
    'EMBED',
    'SERVICES',
    'INSTRUMENTS',
    'FEATURED_VIDEO',
  ]),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  content: z.record(z.unknown()).default({}),
  settings: z.record(z.unknown()).default({}),
});
