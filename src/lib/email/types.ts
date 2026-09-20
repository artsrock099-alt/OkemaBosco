/** Every kind of email the application can send. Stored on EmailLog.type. */
export const EMAIL_TYPES = [
  'BOOKING_ADMIN',
  'BOOKING_CONFIRMATION',
  'BOOKING_STATUS',
  'BOOKING_REPLY',
  'CONTACT_ADMIN',
  'CONTACT_CONFIRMATION',
  'CONTACT_REPLY',
  'NEWSLETTER_ADMIN',
  'NEWSLETTER_WELCOME',
  'NEWSLETTER_CONFIRM',
  'NEWSLETTER_CAMPAIGN',
  'NEWSLETTER_TEST',
  'PASSWORD_RESET',
  'SECURITY_ALERT',
] as const;

export type EmailType = (typeof EMAIL_TYPES)[number];

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  type: EmailType;
  /** Overrides EMAIL_REPLY_TO for this message. */
  replyTo?: string | null;
  /** Overrides the default sender display name. */
  fromName?: string | null;
  /** Correlates the send with a record so it shows up in that record's history. */
  campaignId?: string | null;
  bookingId?: string | null;
  contactMessageId?: string | null;
  subscriberId?: string | null;
  /**
   * Unique key that makes the send idempotent. If a log row already exists
   * with this key the email is not sent again, which keeps retries safe.
   */
  dedupeKey?: string | null;
  metadata?: Record<string, unknown>;
};

export type SendEmailResult = {
  ok: boolean;
  /** True when the send was skipped because it had already been sent. */
  skipped?: boolean;
  logId?: string;
  providerMessageId?: string;
  error?: string;
};
