# Security

## What is in place

### Server-side authorization

Admin pages sit behind `src/app/admin/(protected)/layout.tsx`, and every admin API route calls
`requireAdmin()` (`src/lib/admin-api.ts`), which checks the session **and** that the role is in
`ALL_ADMIN_ROLES`. Hiding a page in the navigation is never the only protection.

### Audit log

`createAuditLog(action, entity, entityId, userId, metadata, ip, userAgent)` writes to `AuditLog`.
Actions already recorded include:

```
LOGIN_SUCCESS / LOGIN_FAILED   (planned, see below)
BOOKING_CREATED
CONTACT_RECEIVED
NOTIFICATION_PREFERENCES_UPDATED
UPDATE / DELETE on SITE_IMAGE, HERO_BACKGROUND, SETTINGS, PAGES ...
```

Metadata never contains secrets, passwords or full message bodies.

### Rate limiting

`src/lib/rate-limit.ts` is a dependency-free fixed-window limiter with these applied limits:

| Endpoint | Limit |
| --- | --- |
| `POST /api/bookings` | 5 per 10 minutes per IP |
| `POST /api/contact` | 5 per 10 minutes per IP |
| `POST /api/newsletter/subscribe` | 8 per 10 minutes per IP |

It is process-local, which matches the current single-instance deployment. To scale
horizontally, replace the two `Map`s with Redis and keep the same function signature.

### Spam protection

- Server-side zod validation on every public form.
- Honeypot field `_honey`: a bot that fills it receives a normal-looking success response and
  nothing is stored.
- Rate limiting as above.

### Signed, expiring links

`src/lib/tokens.ts` issues HMAC-SHA256 tokens (`base64url(payload).signature`) with a `purpose`
claim, so an unsubscribe link cannot be replayed as a password reset. Unsubscribe links last a
year; subscription confirmations last seven days.

### Secrets

- `RESEND_API_KEY`, `MFA_ENCRYPTION_KEY` and `NEXTAUTH_SECRET` are read server-side only and are
  never rendered into a page.
- `.env`, `.env.local` and `.env.production` are in `.gitignore`.
- `.env.example` documents every variable with empty values.

## Not yet implemented

The remaining security work is tracked here so it is not mistaken for done:

- **TOTP two-factor authentication.** The schema is already prepared (`User.mfaEnabled`,
  `mfaSecret`, `mfaEnabledAt`, `mfaLastVerifiedAt`, `AdminRecoveryCode`), but enrolment, the login
  challenge, recovery codes and the security dashboard are not built yet. `MFA_ENCRYPTION_KEY` is
  reserved for it.
- **Session listing and revocation.** `AdminSession` exists for it; no UI or enforcement yet.
- **Login attempt tracking and lockout.** `LoginAttempt` and `User.failedLoginAttempts` /
  `lockedUntil` exist; the login path does not yet write to them.
- **Password reset flow.** `sendPasswordReset()` exists; there is no request or reset route, and
  the request form does not exist to avoid revealing whether an address is registered.
- **Resend webhook.** Delivered but not wired; see `docs/EMAIL.md` for the contract.

Because none of these are live, there is currently **no way to lock yourself out** of the admin
dashboard: MFA cannot be switched on by accident.

## When MFA is added

The intended flow, matching the schema already in place:

```
Email + password
      |
      v
  verified?  --no--> generic failure (never reveals whether the account exists)
      |
     yes
      |
   mfaEnabled?
      |
     yes
      |
  6-digit TOTP or one unused recovery code, verified server-side inside
  NextAuth's authorize()
      |
      v
  session created, AdminSession row written, audit entry logged
```

Rules to keep:

- Enforcement lives in `authorize()`, never in the browser, so the client cannot skip it.
- The TOTP secret is encrypted with AES-256-GCM under `MFA_ENCRYPTION_KEY`.
- Recovery codes are stored as hashes only, are single use, and are shown once.
- Disabling MFA, regenerating recovery codes, changing the email or password, and editing admin
  accounts all require a recent re-authentication.
