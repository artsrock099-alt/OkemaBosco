import type { Metadata } from 'next';
import Link from 'next/link';
import { TestimonialCard } from '@/components/public/TestimonialCard';
import { getTestimonials } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Elderly Visits',
  description:
    'Live musical performances for senior communities, assisted living, nursing homes, memory care and senior centers — fostering joy and connection.',
};

const benefits = [
  {
    title: 'Joy & Emotional Wellbeing',
    description:
      'Music has a unique ability to awaken memories, spark smiles, and lift spirits — especially meaningful for those experiencing isolation or cognitive decline.',
  },
  {
    title: 'Meaningful Connection',
    description:
      'Live, in-person music creates moments of shared experience — between residents, staff, family and the musician.',
  },
  {
    title: 'Cultural Discovery',
    description:
      'Songs and stories from Uganda open a window to another culture, creating conversation and curiosity.',
  },
  {
    title: 'Interactive & Gentle',
    description:
      'Programs are tailored to the needs of the room — whether high-energy sing-alongs or quiet instrumental moments.',
  },
];

const settings = [
  'Assisted Living Facilities',
  'Nursing Homes',
  'Memory Care / Dementia Care',
  'Independent Living Communities',
  'Senior Centers',
  'Adult Day Programs',
  'Hospice & Palliative Care',
  'Church & Community Groups',
];

export default async function ElderlyVisitsPage() {
  const testimonials = (await getTestimonials(false, 3)).filter((_t, i) => i > 1);

  return (
    <>
      <section className="relative min-h-[70vh] flex flex-col justify-end pt-32 pb-16 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1600&q=80"
            alt="Seniors enjoying a live music performance"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal via-deep-charcoal/60 to-transparent" />
        </div>
        <div className="relative z-10 container-x max-w-4xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            EDUCATION • ELDERLY VISITS
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-8">
            Music that connects generations.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mb-8">
            Bosco brings live music and cultural experiences to senior communities across the
            region — gentle, joyful visits designed to spark memories, create connection, and
            brighten the day.
          </p>
          <Link href="/book" className="btn-primary-light inline-flex">
            SCHEDULE A PERFORMANCE
          </Link>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-tl-3xl rounded-br-3xl">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1000&q=80"
                alt="Elderly person smiling and enjoying music"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7 order-1 md:order-2">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              WHY IT MATTERS
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight leading-tight mb-8">
              Live music is medicine for the heart.
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant mb-8">
              Whether sharing familiar African melodies, singing call-and-response songs, or
              playing gentle instrumentals on the Adungu, each visit is crafted to meet the needs
              of the room. The result is moments of joy, shared across generations.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-container">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              PROGRAM EXPERIENCE
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              The difference music makes.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="card-surface p-8 md:p-10">
                <h3 className="font-headline text-headline-md text-on-surface mb-4">{b.title}</h3>
                <p className="font-body text-body-md text-on-surface-variant">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <div className="card-surface p-8 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                  WHERE BOSCO VISITS
                </div>
                <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8 leading-tight">
                  Programs designed for every type of senior community.
                </h2>
                <p className="font-body text-body-md text-on-surface-variant mb-6">
                  From small, intimate group sessions to full-community performances, programs are
                  flexible in length, format and intensity.
                </p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {settings.map((s) => (
                  <li key={s} className="flex items-start gap-3 p-4 bg-surface-container rounded">
                    <svg className="w-5 h-5 text-muted-ochre flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-body text-body-md text-on-surface">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section-y bg-surface-container-low">
          <div className="container-x">
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight text-center mb-12">
              What communities share.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-y">
        <div className="container-x card-surface p-10 md:p-20 text-center">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8 max-w-3xl mx-auto">
            Ready to bring music to your community?
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
            Bosco offers free 15-minute consultations for activity directors and program
            coordinators to design the perfect visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="btn-primary">
              SCHEDULE A PERFORMANCE
            </Link>
            <Link href="/contact" className="btn-outline text-primary">
              ASK A QUESTION
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
