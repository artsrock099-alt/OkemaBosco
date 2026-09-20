import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Subscription confirmed',
  description: 'Confirm your Bosco Okema newsletter subscription.',
  robots: { index: false, follow: false },
};

type Props = { searchParams: { state?: string } };

const MESSAGES: Record<string, { heading: string; body: string; ok: boolean }> = {
  confirmed: {
    heading: 'You are on the list.',
    body: 'Thank you for confirming. You will hear about performances, educational programmes and events as they are announced.',
    ok: true,
  },
  already: {
    heading: 'Already confirmed.',
    body: 'Your subscription was already active, so there was nothing more to do.',
    ok: true,
  },
  invalid: {
    heading: 'This link has expired.',
    body: 'Confirmation links are valid for seven days. Subscribe again and we will send a fresh one.',
    ok: false,
  },
  missing: {
    heading: 'Something is missing.',
    body: 'This page needs the confirmation link from the email you received.',
    ok: false,
  },
};

export default function ConfirmSubscriptionPage({ searchParams }: Props) {
  const state = (searchParams.state || 'missing').toLowerCase();
  const result = MESSAGES[state] ?? MESSAGES.missing;

  return (
    <section className="section-y">
      <div className="container-x max-w-2xl">
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
          NEWSLETTER
        </div>
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-6">
          {result.heading}
        </h1>
        <p className="font-body text-body-lg text-on-surface-variant mb-10">{result.body}</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/listen" className="btn-primary">
            LISTEN TO THE MUSIC
          </Link>
          {!result.ok && (
            <Link href="/#newsletter" className="btn-outline text-primary">
              SUBSCRIBE AGAIN
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
