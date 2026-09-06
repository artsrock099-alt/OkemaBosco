import type { Metadata } from 'next';
import Link from 'next/link';
import { TestimonialCard } from '@/components/public/TestimonialCard';
import { getTestimonials } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'School Residency Program',
  description:
    'Bring traditional Ugandan music, instruments, storytelling, and cultural learning directly into your classroom with Bosco Okema.',
};

const experiences = [
  {
    title: 'Traditional Instruments',
    description:
      'Hands-on exploration of the Adungu (bow harp), thumb piano, percussion, guitar and voice.',
  },
  {
    title: 'Music & Rhythm',
    description:
      'Call-and-response songs, polyrhythms, and group percussion that get the whole room moving.',
  },
  {
    title: 'Storytelling',
    description:
      'Folktales and personal narratives from Uganda that connect the music to the culture.',
  },
  {
    title: 'Audience Participation',
    description:
      'Students actively participate — singing, playing, dancing, and asking questions.',
  },
];

const formats = [
  {
    title: 'Single Workshop',
    duration: '1–2 hours',
    description: 'A focused visit perfect for a cultural day, music class, or special event.',
  },
  {
    title: 'Multi-Day Residency',
    duration: '2–5 days',
    description: 'Deeper learning that builds across sessions, culminating in a student performance.',
  },
  {
    title: 'School-Wide Assembly',
    duration: '45–60 mins',
    description: 'Engaging, high-energy performance introducing Ugandan music to the whole school.',
  },
  {
    title: 'Grade-Level Presentations',
    duration: '30–60 mins each',
    description: 'Age-appropriate sessions tailored for Early Years through High School.',
  },
];

export default async function SchoolResidencyPage() {
  const testimonials = (await getTestimonials(false, 3)).filter(
    (_t, i) => i > 0
  );

  return (
    <>
      <section className="relative min-h-[70vh] flex flex-col justify-end pt-32 pb-16 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80"
            alt="Students engaged in music learning in a classroom"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal via-deep-charcoal/60 to-transparent" />
        </div>
        <div className="relative z-10 container-x max-w-4xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            EDUCATION • SCHOOL RESIDENCY
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-8">
            Bring Uganda into your classroom.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mb-8">
            An interactive cultural immersion program where students experience traditional
            instruments, music, rhythm, storytelling and the living culture of Uganda — firsthand.
          </p>
          <Link href="/book" className="btn-primary-light inline-flex">
            REQUEST A SCHOOL PROGRAM
          </Link>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x max-w-3xl text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            PROGRAM OVERVIEW
          </div>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8">
            What students experience.
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant">
            Each session is designed to actively engage, educate and inspire. Whether for a single
            workshop or a multi-week residency, the goal is to create an experience students
            remember long after the final song.
          </p>
        </div>
      </section>

      <section className="pb-section-gap">
        <div className="container-x grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {experiences.map((e) => (
            <div key={e.title} className="card-surface p-8 md:p-10">
              <h3 className="font-headline text-headline-md text-on-surface mb-4">{e.title}</h3>
              <p className="font-body text-body-md text-on-surface-variant">{e.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-surface-container">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              PROGRAM FORMATS
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Tailored for every school.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {formats.map((f) => (
              <div key={f.title} className="card-surface p-8 flex flex-col h-full">
                <div className="font-label text-label-sm text-muted-ochre uppercase tracking-widest mb-2">
                  {f.duration}
                </div>
                <h3 className="font-headline text-headline-md text-on-surface mb-4">{f.title}</h3>
                <p className="font-body text-body-md text-on-surface-variant flex-1">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-tl-3xl rounded-br-3xl">
            <img
              src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=1000&q=80"
              alt="Children learning music together"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8 leading-tight">
              Designed for educators, loved by students.
            </h2>
            <ul className="space-y-4 font-body text-body-md text-on-surface-variant">
              {[
                'Aligned with core curriculum standards in music, social studies and culture',
                'Age-appropriate content from Pre-K to Grade 12 and beyond',
                'All instruments provided — no prior musical experience needed',
                'Flexible scheduling — mornings, afternoons, or special events',
                'Pre- and post-visit learning resources available on request',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <svg className="w-6 h-6 text-muted-ochre flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section-y bg-surface-container-low">
          <div className="container-x">
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight text-center mb-12">
              What teachers say.
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
            Ready to bring Ugandan music to your students?
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
            Tell Bosco about your school, your students and your goals. He will respond with a
            tailored program proposal and pricing.
          </p>
          <Link href="/book" className="btn-primary">
            REQUEST A SCHOOL PROGRAM
          </Link>
        </div>
      </section>
    </>
  );
}
