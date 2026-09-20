/**
 * Central environment access.
 *
 * Everything is read through a function so a missing variable degrades
 * gracefully instead of crashing a page or a route at import time.
 */

function read(key: string, fallback = ''): string {
  const value = process.env[key];
  return (value ?? '').trim() || fallback;
}

function flag(key: string, fallback = false): boolean {
  const value = read(key);
  if (!value) return fallback;
  return value.toLowerCase() === 'true' || value === '1';
}

export const env = {
  /** Public base URL, used for links inside emails. */
  appUrl: () => read('NEXTAUTH_URL', 'http://localhost:3001').replace(/\/+$/, ''),

  resendApiKey: () => read('RESEND_API_KEY'),
  resendWebhookSecret: () => read('RESEND_WEBHOOK_SECRET'),
  resendAudienceId: () => read('RESEND_AUDIENCE_ID'),

  emailFrom: () => read('EMAIL_FROM'),
  emailFromName: () => read('EMAIL_FROM_NAME', 'Bosco Okema'),
  emailReplyTo: () => read('EMAIL_REPLY_TO'),
  adminNotificationEmail: () => read('ADMIN_NOTIFICATION_EMAIL'),

  mfaEncryptionKey: () => read('MFA_ENCRYPTION_KEY'),

  cronSecret: () => read('CRON_SECRET'),

  newsletterDoubleOptIn: () => flag('NEWSLETTER_DOUBLE_OPT_IN', false),

  uploadDir: () => read('UPLOAD_DIR', 'public/uploads'),
};

/** True when emails can actually be sent. */
export function isEmailConfigured(): boolean {
  return Boolean(env.resendApiKey() && env.emailFrom());
}

/** True when the TOTP secret can be encrypted at rest. */
export function isMfaConfigured(): boolean {
  return env.mfaEncryptionKey().length >= 16;
}

/**
 * Human-readable list of what is still missing, shown in the admin Email
 * settings screen instead of pretending everything is wired up.
 */
export function emailConfigProblems(): string[] {
  const problems: string[] = [];
  if (!env.resendApiKey()) problems.push('RESEND_API_KEY is not set');
  if (!env.emailFrom()) problems.push('EMAIL_FROM is not set');
  else if (env.emailFrom().includes('@gmail.com'))
    problems.push('EMAIL_FROM should use a verified domain address, not a Gmail address');
  if (!env.resendWebhookSecret()) problems.push('RESEND_WEBHOOK_SECRET is not set (delivery events will not be tracked)');
  return problems;
}

/** Full "Name <address>" sender string. Accepts an already-formatted value. */
export function fromAddress(override?: string | null): string {
  const raw = (override ?? '').trim();
  const value = raw || env.emailFrom();
  if (!value) return '';
  if (value.includes('<')) return value;
  const name = env.emailFromName();
  return name ? `${name} <${value}>` : value;
}
