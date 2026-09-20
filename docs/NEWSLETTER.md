# Newsletter

## Subscriber lifecycle

```
Visitor submits the form
        |
        v
  status = PENDING   (only when NEWSLETTER_DOUBLE_OPT_IN=true)
  status = ACTIVE    (default, when double opt-in is off)
        |
        v
  AdminNotification + admin email + welcome email
        |
        v
  Mirrored into a Resend audience (best effort)
```

`NewsletterSubscriber.unsubscribeToken` is generated on first write and is the token used in
unsubscribe links. Older rows created before this column existed have `NULL`, and the app falls
back to a signed token, so their links still work.

### Statuses

| Status | Meaning | Receives campaigns |
| --- | --- | --- |
| `PENDING` | Signed up, has not confirmed | No |
| `ACTIVE` | Confirmed and subscribed | Yes |
| `UNSUBSCRIBED` | Asked to stop | **Never** |
| `BOUNCED` | Address bounced or complained | **Never** |

`isActive` is kept in step with `status` for backwards compatibility with older queries.

## Double opt-in

Controlled by `NEWSLETTER_DOUBLE_OPT_IN`:

- `false` (default) - subscribers become `ACTIVE` immediately.
- `true` - subscribers start as `PENDING` and are activated by
  `GET /api/newsletter/confirm?token=...`, which the confirmation email links to.

## Unsubscribe

- **`POST /api/newsletter/unsubscribe`** performs the unsubscribe. This is the URL advertised in
  the `List-Unsubscribe` header, so supporting clients can unsubscribe in one click (RFC 8058).
- **`GET`** deliberately changes nothing and redirects to `/newsletter/unsubscribed`, a page with
  a button. This exists because link scanners and inbox previews fetch URLs automatically and
  must never unsubscribe somebody by accident.

Unsubscribing sets `status = UNSUBSCRIBED`, `isActive = false` and `unsubscribedAt`. The
subscriber stays in the database as a record of consent, and every campaign audience excludes
them. Signing up again reactivates the row rather than creating a duplicate.

## Campaigns

`NewsletterCampaign` holds the composed email: name, subject, preview text, from name, reply-to,
audience, the rendered HTML and the structured composer blocks.

| Status | Meaning |
| --- | --- |
| `DRAFT` | Being written |
| `SCHEDULED` | Has a send time in the future |
| `SENDING` | Currently delivering |
| `SENT` | Finished |
| `CANCELLED` | Stopped before sending |
| `FAILED` | Provider error |

Counters (`totalRecipients`, `totalSent`, `totalFailed`, `totalBounced`, `totalOpened`,
`totalClicked`) are filled from real sends and real webhook events. When there is no data the
admin shows "Not available" rather than a made-up figure.

## Audiences

Defined in `src/lib/newsletter/segments.ts`. Every segment filters out `UNSUBSCRIBED` and
`BOUNCED` addresses no matter what else it matches.

| Key | Who |
| --- | --- |
| `ACTIVE` | All active subscribers |
| `RECENT` | Joined in the last 30 days |
| `SCHOOL` | Tagged `school-audience`, or signed up from a school or education page |
| `SENIOR` | Tagged `senior-audience`, or signed up from a senior or elder page |
| `EVENTS` | Tagged `event-audience`, or signed up from an events page |
| `EVERYONE` | All active and pending subscribers |

Tags are only ever applied by an administrator. Nobody is sorted into a sensitive category
automatically.

## Batching and safety

Sending a campaign goes through `src/lib/newsletter/send.ts`, which:

- resolves the audience once and de-duplicates the recipient list by email address;
- sends in batches with a small delay between them, so a large list does not fire hundreds of
  requests at once;
- writes one `EmailLog` row per recipient, carrying the campaign id, so delivery is trackable
  per person;
- keeps going when a single send fails, recording the failure instead of aborting the campaign;
- creates a notification if the failure count is high.

Before sending, the admin screen shows the campaign name, subject, audience, **exact recipient
count**, sender and reply-to, and requires an explicit confirmation.

Test sends use type `NEWSLETTER_TEST`, are never attached to a campaign, and never touch the
campaign counters.

## Privacy

Subscribing is always an explicit action. Nobody is added to the newsletter because they sent a
booking enquiry or a contact message: those are service emails, not marketing, and they are
tracked separately.
