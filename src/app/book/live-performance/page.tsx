import Link from 'next/link';
import SectionRenderer from '@/components/public/SectionRenderer';
import HeroMedia from '@/components/public/HeroMedia';
import { getCmsSections } from '@/lib/cms';

export const metadata = { title: 'Book Live Performance' };

export default async function BookLivePage() {
  const cmsSections = await getCmsSections('book/live-performance');
  if (cmsSections) return <SectionRenderer sections={cmsSections} />;

  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <HeroMedia
          slug="book/live-performance"
          gradient="from-deep-charcoal via-deep-charcoal/50 to-deep-charcoal/25"
        />
        <div className="relative z-10 container-x max-w-4xl text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            BOOK • LIVE PERFORMANCE
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6">
            Book a live performance.
          </h1>
          <p className="font-body text-body-lg text-surface-variant max-w-2xl mx-auto mb-10">
            The booking form is the fastest route. Choose &ldquo;Live Performance&rdquo; and tell me
            about your event, or look at the performance formats first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="btn-primary-light">
              GO TO BOOKING FORM
            </Link>
            <Link href="/live-performance" className="btn-outline text-warm-ivory">
              SEE THE FORMATS
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
