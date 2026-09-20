/**
 * Responsive HTML email templates.
 *
 * Email clients are primitive, so the layout uses a single centred table with
 * inline styles and no external CSS. Everything degrades to a readable plain
 * text email as well.
 */

export const BRAND = {
  charcoal: '#171614',
  ivory: '#F5F1E8',
  surface: '#FDF9F0',
  ochre: '#B88A3B',
  earth: '#6B4B35',
  gold: '#D4AF37',
  muted: '#5B554D',
  border: '#E3DACA',
};

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Replace {{variables}} in a string, leaving unknown variables untouched. */
export function applyVariables(template: string, vars: Record<string, string>): string {
  return String(template ?? '').replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
    const value = vars[key];
    return value === undefined ? match : value;
  });
}

type LayoutOptions = {
  /** Hidden preview line shown by most inboxes. */
  preheader?: string;
  heading: string;
  /** Paragraphs rendered above the body. */
  intro?: string[];
  /** Pre-rendered HTML placed between the intro and the footer. */
  bodyHtml?: string;
  cta?: { label: string; href: string } | null;
  outro?: string[];
  /** Small print at the very bottom. */
  footerNote?: string;
  unsubscribeUrl?: string;
};

export function renderEmailLayout(options: LayoutOptions): string {
  const {
    preheader,
    heading,
    intro = [],
    bodyHtml = '',
    cta,
    outro = [],
    footerNote,
    unsubscribeUrl,
  } = options;

  const paragraphs = (lines: string[]) =>
    lines
      .filter(Boolean)
      .map(
        (line) =>
          `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:${BRAND.muted};">${line}</p>`
      )
      .join('');

  const button = cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
         <tr>
           <td style="background:${BRAND.charcoal};border-radius:999px;">
             <a href="${escapeHtml(cta.href)}"
                style="display:inline-block;padding:14px 34px;font-family:Helvetica,Arial,sans-serif;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.ivory};text-decoration:none;">
               ${escapeHtml(cta.label)}
             </a>
           </td>
         </tr>
       </table>`
    : '';

  const unsubscribe = unsubscribeUrl
    ? `<p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#8A8177;">
         You are receiving this because you subscribed to updates from Bosco Okema.
         <a href="${escapeHtml(unsubscribeUrl)}" style="color:#8A8177;">Unsubscribe</a>.
       </p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.surface};-webkit-text-size-adjust:100%;">
  ${
    preheader
      ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>`
      : ''
  }
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.surface};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid ${BRAND.border};border-radius:14px;overflow:hidden;">
          <tr>
            <td style="background:${BRAND.charcoal};padding:22px 32px;">
              <a href="${escapeHtml(process.env.NEXTAUTH_URL || '')}"
                 style="font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:0.08em;color:${BRAND.ivory};text-decoration:none;">
                BOSCO OKEMA
              </a>
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.ochre};margin-top:6px;">
                Ugandan musician &middot; cultural educator &middot; performer
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.3;color:${BRAND.charcoal};">
                ${escapeHtml(heading)}
              </h1>
              ${paragraphs(intro)}
              ${bodyHtml}
              ${button}
              ${paragraphs(outro)}
            </td>
          </tr>
          <tr>
            <td style="padding:22px 32px;background:${BRAND.surface};border-top:1px solid ${BRAND.border};">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#8A8177;">
                ${escapeHtml(footerNote || 'Bosco Okema &middot; Kampala, Uganda')}
              </p>
              ${unsubscribe}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Two-column key/value table used by the admin notification emails. */
export function renderDetailTable(rows: [string, string | null | undefined][]): string {
  const body = rows
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 16px 10px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.ochre};white-space:nowrap;vertical-align:top;">${escapeHtml(
            label
          )}</td>
          <td style="padding:10px 0;font-size:15px;line-height:1.6;color:${BRAND.charcoal};">${escapeHtml(
            value
          )}</td>
        </tr>`
    )
    .join('');

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:8px 0 24px;border-top:1px solid ${BRAND.border};border-bottom:1px solid ${BRAND.border};">${body}</table>`;
}

export function renderQuote(text: string): string {
  return `<blockquote style="margin:0 0 24px;padding:14px 20px;border-left:3px solid ${BRAND.ochre};background:${BRAND.surface};font-size:15px;line-height:1.7;color:${BRAND.earth};white-space:pre-wrap;">${escapeHtml(
    text
  )}</blockquote>`;
}

/** Very small HTML to text converter for the plain-text alternative. */
export function htmlToText(html: string): string {
  return String(html ?? '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h1|h2|h3|li|tr|blockquote)>/gi, '\n')
    .replace(/<a[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&middot;/g, '-')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
