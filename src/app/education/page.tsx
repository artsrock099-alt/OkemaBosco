import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Education',
  description:
    'Educational programs bringing Ugandan music, culture, and storytelling to schools, communities, and senior centers.',
};

const programs = [
  {
    slug: 'school-residency',
    href: '/education/school-residency',
    badge: 'SCHOOL RESIDENCY',
    title: 'Bring Uganda into Your Classroom',
    description:
      'Interactive music, traditional instruments, storytelling, rhythm and cultural learning for students of all ages.',
    cta: 'REQUEST A SCHOOL PROGRAM',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
  },
  {
    slug: 'elderly-visits',
    href: '/education/elderly-visits',
    badge: 'ELDERLY VISITS',
    title: 'Music That Connects Generations',
    description:
      'Live musical experiences designed for senior communities, assisted living, memory care and senior centers.',
    cta: 'SCHEDULE A PERFORMANCE',
    image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1200&q=80',
  },
  {
    slug: 'live-performance',
    href: '/live-performance',
    badge: 'LIVE PERFORMANCE',
    title: 'Live Music. Real Connection.',
    description:
      'Solo, small ensemble or full band performances for concerts, festivals, weddings, churches and cultural celebrations.',
    cta: 'REQUEST A PERFORMANCE',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80',
  },
];

export default function EducationPage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-deep-charcoal text-warm-ivory">
        <div className="container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            EDUCATION
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
            Music as a way of learning.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mx-auto">
            Through interactive programs, Bosco brings the richness of Ugandan culture to
            classrooms, senior communities and organizations — creating connection through shared
            musical experience.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x space-y-24 md:space-y-32">
          {programs.map((p, i) => (
            <div
              key={p.slug}
              className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${
                i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div className="md:col-span-7">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="md:col-span-5 md:px-8">
                <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                  {p.badge}
                </div>
                <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight leading-tight mb-6">
                  {p.title}
                </h2>
                <p className="font-body text-body-md md:text-body-lg text-on-surface-variant mb-8">
                  {p.description}
                </p>
                <Link href={p.href} className="btn-ghost">
                  {p.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-surface-container">
        <div className="container-x text-center">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-6 max-w-2xl mx-auto">
            Custom programs available.
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
            Looking for something specific? Workshops, festivals, corporate events, cultural days —
            reach out to design a program for your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="btn-primary">
              START THE CONVERSATION
            </Link>
            <Link href="/contact" className="btn-outline text-primary">
              CONTACT BOSCO
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
