# Notifications

## Two halves

Every event produces up to two things:

1. a **dashboard notification** (`AdminNotification`), shown behind the bell in the admin header;
2. an **email notification**, using the designed template for that event.

Both are controlled per type from **Settings -> Notification preferences**.

## Types

| Type | Raised by | Links to |
| --- | --- | --- |
| `BOOKING` | Booking form submitted | `/admin/bookings/{id}` |
| `CONTACT` | Contact form submitted | `/admin/messages/{id}` |
| `NEWSLETTER` | Newsletter signup | `/admin/newsletter/subscribers?q={email}` |
| `EMAIL_FAILURE` | Bounce, complaint or send failure | `/admin/settings/email` |
| `SECURITY` | Sign-in, MFA change, lockout, password change | `/admin/settings/security` |

**Security notifications cannot be switched off.** `setNotificationPreference()` forces
`SECURITY` back to enabled server-side, so a tampered form cannot silence the alerts that matter
most for the only administrator.

## Preferences

`NotificationPreference` stores one row per type with a `dashboard` and an `email` flag.
Missing rows default to on, so the table only ever holds deliberate choices.

## How it is raised

Callers use a single helper, `notify()` in `src/lib/notifications.ts`:

```ts
await notify({
  type: 'BOOKING',
  title: 'New booking request',
  message: `${booking.customerName} - ${booking.reference}`,
  entityType: 'Booking',
  entityId: booking.id,
  link: `/admin/bookings/${booking.id}`,
  // Passed in by the caller so the designed template and its idempotency key
  // live with the feature rather than here.
  sendEmailNotification: () => sendBookingAdminNotification(booking),
});
```

`notify()` never throws. The booking, message or signup has already been saved by the time it
runs, and that result must survive a notification problem.

## The bell

`src/components/admin/NotificationBell.tsx` polls `/api/admin/notifications` every 30 seconds,
shows an unread badge, lists the eight most recent items with a type dot and a relative time, and
can mark one or all as read. Items link straight to the record they are about.

`/admin/notifications` is the full view, filterable by unread, paged 30 at a time.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/admin/notifications?limit=10` | Recent notifications plus the unread count |
| `PATCH` | `/api/admin/notifications` with `{ id }` | Mark one read |
| `PATCH` | `/api/admin/notifications` with `{}` | Mark all read |

Every route runs through `requireAdmin()`, so an unauthenticated or non-admin caller gets `401`
regardless of what the UI shows.
