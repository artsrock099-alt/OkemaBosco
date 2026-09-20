import type { Metadata } from 'next';
import Link from 'next/link';
import UnsubscribeForm from '@/components/public/UnsubscribeForm';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: 'Stop receiving the Bosco Okema newsletter.',
  robots: { index: false, follow: false },
};

type Props = { searchParams: { token?: string } };

export default function UnsubscribedPage({ searchParams }: Props) {
  const token = (searchParams.token || '').trim();

  return (
    <section className="section-y">
      <div className="container-x max-w-2xl">
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
          NEWSLETTER
        </div>
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8">
          Unsubscribe from the mailing list.
        </h1>

        {token ? (
          <UnsubscribeForm token={token} />
        ) : (
          <div className="space-y-4">
            <p className="font-body text-body-md text-on-surface-variant">
              This page needs the link from one of our emails so we can tell which address to
              remove. Open the unsubscribe link at the bottom of any newsletter to use it.
            </p>
            <p className="font-body text-body-md text-on-surface-variant">
              If you would rather just ask, write to us and we will remove you by hand.
            </p>
            <Link href="/contact" className="btn-outline text-primary">
              CONTACT US
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
