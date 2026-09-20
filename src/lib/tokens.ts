/**
 * Signed, expiring tokens for links that travel by email: newsletter
 * unsubscribe and subscription confirmation, and password resets.
 *
 * Format: base64url(json payload) + "." + base64url(HMAC-SHA256).
 * The payload carries no secrets, so an internal id can be recovered without
 * exposing a raw database key in a URL.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

function secret(): string {
  const value = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || '';
  if (!value) {
    // A predictable fallback keeps local development working. Production is
    // required to set NEXTAUTH_SECRET, and tokens become useless without it.
    return 'bosco-okema-development-secret';
  }
  return value;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64url(input: string): Buffer {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(padded, 'base64');
}

function sign(data: string): string {
  return base64url(createHmac('sha256', secret()).update(data).digest());
}

export type TokenPayload = {
  /** What the token is for, so one kind cannot be replayed as another. */
  purpose: 'unsubscribe' | 'confirm-subscription' | 'password-reset';
  /** Subject id: subscriber id or user id. */
  sub: string;
  /** Extra data, for example the email the link was sent to. */
  data?: Record<string, string>;
  /** Unix seconds. */
  exp: number;
};

export function signToken(
  payload: Omit<TokenPayload, 'exp'>,
  ttlSeconds = 60 * 60 * 24 * 30
): string {
  const body: TokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encoded = base64url(JSON.stringify(body));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyToken(token: string, purpose: TokenPayload['purpose']): TokenPayload | null {
  if (!token || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const provided = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (provided.length !== wanted.length || !timingSafeEqual(provided, wanted)) return null;

  try {
    const payload = JSON.parse(fromBase64url(encoded).toString('utf8')) as TokenPayload;
    if (payload.purpose !== purpose) return null;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.sub) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Random, stable per-subscriber token stored on the subscriber row. Used to
 * build the unsubscribe link so a campaign email does not depend on the
 * signing secret alone.
 */
export function generateOpaqueToken(bytes = 24): string {
  return base64url(randomBytes(bytes));
}
