/**
 * Newsletter audiences.
 *
 * A segment never returns unsubscribed or bounced addresses, no matter what
 * else it matches, so a campaign can only ever go to people who want it.
 */
import type { Prisma } from '@prisma/client';

export type SegmentKey = 'ACTIVE' | 'RECENT' | 'SCHOOL' | 'SENIOR' | 'EVENTS' | 'EVERYONE';

export type Segment = {
  key: SegmentKey;
  label: string;
  description: string;
};

export const SEGMENTS: Segment[] = [
  {
    key: 'ACTIVE',
    label: 'All active subscribers',
    description: 'Everyone who has confirmed and is still subscribed.',
  },
  {
    key: 'RECENT',
    label: 'New subscribers',
    description: 'People who joined in the last 30 days.',
  },
  {
    key: 'SCHOOL',
    label: 'School audience',
    description: 'Tagged "school-audience", or who signed up from a schools page or enquiry.',
  },
  {
    key: 'SENIOR',
    label: 'Senior community audience',
    description: 'Tagged "senior-audience", or who signed up from a senior community page.',
  },
  {
    key: 'EVENTS',
    label: 'Event audience',
    description: 'Tagged "event-audience", or who signed up from an events page.',
  },
  {
    key: 'EVERYONE',
    label: 'Everyone still subscribed',
    description: 'All active and pending subscribers. Unsubscribed addresses are excluded.',
  },
];

const NEVER_SEND: Prisma.NewsletterSubscriberWhereInput = {
  status: { notIn: ['UNSUBSCRIBED', 'BOUNCED'] },
};

export function whereForSegment(key: string): Prisma.NewsletterSubscriberWhereInput {
  switch (key) {
    case 'RECENT':
      return {
        status: 'ACTIVE',
        subscribedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      };
    case 'SCHOOL':
      return {
        status: 'ACTIVE',
        OR: [
          { tags: { has: 'school-audience' } },
          { source: { contains: 'school', mode: 'insensitive' } },
          { source: { contains: 'education', mode: 'insensitive' } },
        ],
      };
    case 'SENIOR':
      return {
        status: 'ACTIVE',
        OR: [
          { tags: { has: 'senior-audience' } },
          { source: { contains: 'senior', mode: 'insensitive' } },
          { source: { contains: 'elder', mode: 'insensitive' } },
        ],
      };
    case 'EVENTS':
      return {
        status: 'ACTIVE',
        OR: [
          { tags: { has: 'event-audience' } },
          { source: { contains: 'event', mode: 'insensitive' } },
        ],
      };
    case 'EVERYONE':
      return NEVER_SEND;
    case 'ACTIVE':
    default:
      return { status: 'ACTIVE' };
  }
}

export function segmentLabel(key: string): string {
  return SEGMENTS.find((segment) => segment.key === key)?.label ?? 'All active subscribers';
}

/** Tags an admin can attach to a subscriber, used by the segments above. */
export const SUBSCRIBER_TAGS = [
  { value: 'school-audience', label: 'School audience' },
  { value: 'senior-audience', label: 'Senior community audience' },
  { value: 'event-audience', label: 'Event audience' },
  { value: 'press', label: 'Press and media' },
  { value: 'partner', label: 'Partner or promoter' },
];
