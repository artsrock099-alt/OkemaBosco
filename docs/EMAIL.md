# Email

All outbound email goes through **Resend** (https://resend.com) from one central service. No
route talks to the provider directly, and the API key never reaches the browser.

## How it fits together

```
src/lib/email/
  index.ts         sendEmail() - the only place an email leaves the app
  resend.ts        REST client (no SDK dependency)
  templates.ts     responsive HTML layout + helpers
  notifications.ts every designed email, one function each
  types.ts         EmailType union and input/result shapes
```

`sendEmail()` guarantees three things:

1. **It never throws.** A provider outage cannot break a booking, a contact message or a
   newsletter signup. The database write always happens first and always wins.
2. **Every attempt is logged** to `EmailLog` before it is handed to Resend, then updated to
   `SENT` or `FAILED` with the provider message id or the error text.
3. **`dedupeKey` makes it idempotent.** If a log row with that key already exists and has not
   failed, the email is skipped. Retried operations therefore do not send twice.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Server-side API key. Never expose it. |
| `EMAIL_FROM` | yes | Sender, e.g. `Bosco Okema <hello@okemabosco.com>`. |
| `EMAIL_FROM_NAME` | no | Display name when `EMAIL_FROM` is a bare address. |
| `EMAIL_REPLY_TO` | no | Default reply-to for admin replies. |
| `ADMIN_NOTIFICATION_EMAIL` | no | Where admin alerts go. Falls back to every SUPER_ADMIN. |
| `RESEND_WEBHOOK_SECRET` | for delivery events | Verifies webhook signatures. |
| `RESEND_AUDIENCE_ID` | for contact sync | Mirrors subscribers into a Resend audience. |

Copy `.env.example` to `.env` and fill these in. Never commit real values.

## Domain setup (production)

A personal Gmail address cannot be verified with Resend and will be rejected. Use a domain
address and configure DNS:

1. Add the domain in the Resend dashboard.
2. Create the DNS records Resend shows you: **SPF** (`TXT`), **DKIM** (usually three `CNAME`
   records), and **DMARC** (`_dmarc` `TXT`, start with `p=none` and tighten later).
3. Wait for verification, then set `EMAIL_FROM` to an address on that domain, for example
   `hello@okemabosco.com`.

## What sends what

| Event | Admin email | Visitor email | Type |
| --- | --- | --- | --- |
| Booking submitted | yes | confirmation | `BOOKING_ADMIN`, `BOOKING_CONFIRMATION` |
| Booking status changed | no | yes | `BOOKING_STATUS` |
| Contact form sent | yes | confirmation | `CONTACT_ADMIN`, `CONTACT_CONFIRMATION` |
| Admin replies to a customer | no | yes | `BOOKING_REPLY` / `CONTACT_REPLY` |
| Newsletter signup | yes | welcome or confirm | `NEWSLETTER_ADMIN`, `NEWSLETTER_WELCOME` |
| Campaign sent | no | newsletter | `NEWSLETTER_CAMPAIGN` |
| Password reset | no | reset link | `PASSWORD_RESET` |
| Security event | no | security notice | `SECURITY_ALERT` |

## Checking configuration

`/admin/settings/email` shows the provider, sender, reply-to and admin recipient, lists anything
still missing, and reports how many emails have been sent, failed or bounced. It never displays
the API key.

## Delivery events (webhooks)

`POST /api/webhooks/resend` verifies the `svix` signature with `RESEND_WEBHOOK_SECRET` and
updates the matching `EmailLog` row: `delivered`, `bounced`, `complained`, `opened`, `clicked`.
Unsigned or badly signed payloads are rejected with `400` and change nothing.

Bounces and complaints also raise an `EMAIL_FAILURE` admin notification, and a hard bounce or
complaint moves the subscriber to `BOUNCED` so they are never emailed again.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Every `EmailLog` row is `FAILED` with "Email is not configured" | `RESEND_API_KEY` or `EMAIL_FROM` missing | Set both, restart the server |
| `403 domain is not verified` | Sender domain not verified | Complete DNS in Resend |
| Emails send but land in spam | SPF/DKIM/DMARC missing | Finish the DNS records above |
| No `delivered` / `opened` events | Webhook not configured | Add the endpoint in Resend and set `RESEND_WEBHOOK_SECRET` |
| Emails stop after a deploy | Env vars missing in the new environment | Copy them into the deployment |

Local development without a key is fine: email attempts are recorded as `FAILED` with a clear
reason and every feature keeps working.
