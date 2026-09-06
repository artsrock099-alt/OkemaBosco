import Link from 'next/link';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-surface-container">
        <div className="container-x max-w-4xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            LEGAL
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight leading-tight">
            Privacy Policy
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
              Bosco Okema (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your
              privacy. This policy explains how we collect, use, and safeguard your information
              when you visit our website or use our services.
            </p>
            <div>
              <h3 className="font-headline text-headline-md text-on-surface mb-4">Information We Collect</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Contact details you provide through booking, contact, or newsletter forms (name, email, phone, organization).</li>
                <li>Event and booking details you submit, including dates, venues, and preferences.</li>
                <li>Usage data such as pages visited, referral sources, and device information — collected via standard website analytics.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-headline-md text-on-surface mb-4">How We Use It</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>To respond to booking and contact inquiries and manage the booking lifecycle.</li>
                <li>To send occasional newsletters (you can unsubscribe at any time).</li>
                <li>To improve the website and understand audience interests.</li>
                <li>For internal administration, invoicing, and record-keeping required to deliver our services.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-headline-md text-on-surface mb-4">Data Sharing & Retention</h3>
              <p>
                We do not sell, rent or trade personal information with third parties for
                marketing. We share information only with service providers essential to delivering
                our services (e.g. payment processors, email service providers) and as required by
                law. We retain data only for as long as necessary for the purposes described.
              </p>
            </div>
            <div>
              <h3 className="font-headline text-headline-md text-on-surface mb-4">Your Rights</h3>
              <p>
                You may request access, correction, or deletion of your personal information by
                writing to{' '}
                <a href="mailto:hello@boscookema.com" className="text-muted-ochre hover:underline">
                  hello@boscookema.com
                </a>
                . We will respond to all lawful requests promptly.
              </p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Link href="/contact" className="btn-outline text-primary">
              Contact with Questions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
