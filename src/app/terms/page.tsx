import Link from 'next/link';

export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-deep-charcoal text-warm-ivory">
        <div className="container-x max-w-4xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            LEGAL
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight">
            Terms of Service
          </h1>
        </div>
      </section>
      <section className="pb-section-gap">
        <div className="container-x max-w-3xl prose prose-lg max-w-none">
          <div className="space-y-8 font-body text-body-md text-on-surface-variant leading-relaxed">
            <p className="text-on-surface font-display text-headline-md">
              Last updated: August 2026
            </p>
            <p>
              These terms govern your use of the Bosco Okema website and the services described on
              it. By accessing the website or engaging our services, you agree to these terms.
            </p>
            <div>
              <h3 className="font-headline text-headline-md text-on-surface mb-4">Services</h3>
              <p>
                Services include live performances, educational programs, workshops, appearances,
                and related services as described on the website. Each engagement is formalized by a
                signed agreement or written confirmation that includes scope, dates, fees, and
                responsibilities.
              </p>
            </div>
            <div>
              <h3 className="font-headline text-headline-md text-on-surface mb-4">Bookings & Cancellation</h3>
              <p>
                A booking becomes confirmed once a deposit is received or a written agreement is
                signed by both parties. Cancellation terms are agreed on a per-engagement basis —
                where not otherwise specified, deposits are non-refundable within 30 days of the
                event date.
              </p>
            </div>
            <div>
              <h3 className="font-headline text-headline-md text-on-surface mb-4">Payments & Invoicing</h3>
              <p>
                Payment terms (deposit, balance due dates, currency, late fees) are outlined in
                the confirmation for each engagement. Unless otherwise agreed, invoices are due in
                full prior to the performance date.
              </p>
            </div>
            <div>
              <h3 className="font-headline text-headline-md text-on-surface mb-4">Intellectual Property</h3>
              <p>
                All content on this website — including but not limited to music, recordings,
                photographs, text, artwork, video, and the Bosco Okema name and brand — is owned
                or licensed by Bosco Okema and protected by applicable copyright and trademark
                laws. Reproduction or redistribution without written consent is prohibited.
              </p>
            </div>
            <div>
              <h3 className="font-headline text-headline-md text-on-surface mb-4">Liability</h3>
              <p>
                The website and all services are provided on an &ldquo;as is&rdquo; basis. We make no
                warranties of any kind, express or implied, regarding the website or services
                beyond what is stated in a signed engagement agreement. Our total aggregate
                liability under any engagement is limited to fees already paid for that engagement.
              </p>
            </div>
            <div>
              <h3 className="font-headline text-headline-md text-on-surface mb-4">Contact</h3>
              <p>
                Questions about these terms should be addressed to{' '}
                <a href="mailto:hello@boscookema.com" className="text-muted-ochre hover:underline">
                  hello@boscookema.com
                </a>
                .
              </p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Link href="/contact" className="btn-outline text-primary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
