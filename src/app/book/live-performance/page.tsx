import Link from 'next/link';

export const metadata = { title: 'Book Live Performance' };

export default function BookLivePage() {
  return (
    <section className="pt-32 pb-section-gap container-x max-w-4xl text-center">
      <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
        BOOK • LIVE PERFORMANCE
      </div>
      <h1 className="font-display text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight leading-tight mb-6">
        Book a Live Performance.
      </h1>
      <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
        You will be redirected to the general booking form. Select &ldquo;Live Performance&rdquo;
        to proceed — or browse formats below.
      </p>
      <Link href="/book" className="btn-primary">
        GO TO BOOKING FORM
      </Link>
    </section>
  );
}
