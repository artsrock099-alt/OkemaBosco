import type { Metadata } from 'next';
import Link from 'next/link';
import TestimonialFlipbook from '@/components/public/TestimonialFlipbook';
import { getTestimonials } from '@/lib/queries';
import SectionRenderer from '@/components/public/SectionRenderer';
import HeroMedia from '@/components/public/HeroMedia';
import { getCmsSections } from '@/lib/cms';
import { getSiteImages } from '@/lib/site-images';

export const metadata: Metadata = {
  title: 'School Residency Program',
  description:
    'Bring traditional Ugandan music, instruments, storytelling, and cultural learning directly into your classroom with Bosco Okema.',
};

const galleryKeys = [
  'school-residency-gallery-1',
  'school-residency-gallery-2',
  'school-residency-gallery-3',
  'school-residency-gallery-4',
  'school-residency-gallery-5',
  'school-residency-gallery-6',
  'school-residency-gallery-7',
];

const experiences = [
  {
    title: 'Live Performance & Demonstration',
    description:
      'Students meet traditional instruments up close: thumb piano, adungu and drums. We explore how they are made, how they sound and the stories they carry, with live music that invites listening, clapping and call-and-response.',
  },
  {
    title: 'Hands-On Workshops',
    description:
      'Learners try the instruments themselves. From plucking a first thumb piano note to learning basic adungu patterns, students discover music through touch and play. No experience needed, only curiosity.',
  },
  {
    title: 'Culture & Context',
    description:
      'Music does not live alone. We share the history behind each instrument: where it comes from, when it is played and what it means to the people who made it, so music becomes a window into another world.',
  },
  {
    title: 'Curriculum Connections',
    description:
      'Residencies align with music, social studies, history and global arts standards. Themes include oral tradition, migration, craftsmanship and how instruments travel across cultures.',
  },
];

const formats = [
  {
    title: 'Assembly Program',
    duration: '45-50 min',
    description:
      'Whole grades and large groups, with high energy and plenty of participation.',
  },
  {
    title: 'Classroom Workshops',
    duration: '45-60 min',
    description:
      'Single classes, with deeper learning and hands-on time for every student.',
  },
  {
    title: 'Multi-Day Residency',
    duration: '2-5 days',
    description:
      'Full cultural immersion that finishes with a student showcase performance.',
  },
  {
    title: 'Professional Development',
    duration: '90 min',
    description:
      'For music and classroom teachers integrating global music into the curriculum.',
  },
];

const outcomes = [
  'Identify African instruments by sight and sound: thumb piano, adungu and traditional percussion.',
  'Play simple patterns on the thumb piano or percussion with confidence and joy.',
  'Understand how music reflects history, community and cultural identity.',
  'Explore rhythm, pitch and storytelling through an entirely new cultural lens.',
  'Develop genuine respect for cultural traditions beyond their own lived experience.',
];

const curriculumAreas = ['Music Education', 'Social Studies', 'History', 'Global Arts', 'Language Arts'];

const curriculumThemes = [
  'Oral tradition and storytelling across cultures',
  'Migration, and how instruments travel across continents',
  'Craftsmanship and the making of traditional instruments',
  'Community, and the role of music in healing',
  'Call-and-response as a form of cultural dialogue',
];

const steps = [
  { title: 'Reach out', description: 'Tell us your grade levels, your schedule and your goals.' },
  { title: 'We customise', description: 'The residency is shaped around your students and curriculum.' },
  { title: 'We schedule', description: 'Dates are locked in around your term and timetable.' },
  { title: 'Students experience it', description: 'Instruments, stories and live music in the room.' },
];

export default async function SchoolResidencyPage() {
  const cmsSections = await getCmsSections('education/school-residency');
  if (cmsSections) return <SectionRenderer sections={cmsSections} />;

  const testimonials = (await getTestimonials(false, 6)).filter((_t, i) => i % 2 === 0);
  const images = await getSiteImages();
  const gallery = galleryKeys.map((key) => ({ key, ...images[key] })).filter((item) => item.url);

  return (
    <>
      <section className="relative min-h-[78vh] md:min-h-[88vh] flex flex-col justify-end pt-32 pb-16 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <HeroMedia
          slug="education/school-residency"
          defaultImage="/OKema/schoolresidency1.jpeg"
          defaultOverlay={50}
          gradient="from-deep-charcoal via-deep-charcoal/60 to-transparent"
        />
        <div className="relative z-10 container-x max-w-4xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
          
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-8">
            Bring Uganda into your classroom.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mb-8">
            Hands-on workshops and live music that connect students with the instruments, rhythms
            and cultural heritage of Uganda. Curriculum-friendly, and built to spark curiosity.
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
            Every session is an adventure. Each visit is designed to actively engage, educate and
            inspire, whether it is a single assembly or a multi-day residency.
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
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              PROGRAM FORMATS
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Choose the format that fits.
            </h2>
            <p className="font-body text-body-md text-on-surface-variant mt-4">
              We work with you to fit your schedule, grade level and learning goals. From a single
              assembly to a week-long immersion, every format delivers.
            </p>
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
              src={images['school-residency-feature'].url}
              alt={images['school-residency-feature'].alt}
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
                'All instruments provided, no prior musical experience needed',
                'Flexible scheduling across mornings, afternoons and special events',
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

      <section className="section-y bg-surface-container-low">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              LEARNING OUTCOMES
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Students leave different.
            </h2>
          </div>
          <div className="card-surface p-8 md:p-12 max-w-4xl mx-auto">
            <ol className="space-y-6">
              {outcomes.map((outcome, i) => (
                <li key={outcome} className="flex gap-5">
                  <span className="font-display text-headline-md text-muted-ochre leading-none pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-body text-body-md md:text-body-lg text-on-surface-variant">
                    {outcome}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <div className="card-surface p-8 md:p-12">
            <div className="max-w-3xl mb-8">
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                CURRICULUM CONNECTIONS
              </div>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-6">
                Where the music meets the classroom.
              </h2>
              <div className="flex flex-wrap gap-3">
                {curriculumAreas.map((area) => (
                  <span
                    key={area}
                    className="px-4 py-2 font-label text-label-sm uppercase tracking-widest border border-earth-brown/20 text-on-surface-variant rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {curriculumThemes.map((theme) => (
                <li key={theme} className="flex items-start gap-3 p-4 bg-surface-container rounded">
                  <svg className="w-5 h-5 text-muted-ochre flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-body text-body-md text-on-surface">{theme}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section-y">
          <div className="container-x">
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                IN THE CLASSROOM
              </div>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                What a residency looks like.
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {gallery.map((photo, i) => (
                <figure
                  key={photo.key}
                  className={`relative overflow-hidden rounded-xl bg-surface-container ${
                    i % 5 === 0 ? 'md:col-span-2 aspect-[4/3]' : 'aspect-square'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-y bg-surface-container">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              HOW IT WORKS
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Four simple steps.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="card-surface p-6 md:p-8 flex flex-col h-full">
                <span className="font-display text-headline-md text-muted-ochre mb-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-headline text-headline-md text-on-surface mb-3">{step.title}</h3>
                <p className="font-body text-body-md text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section-y bg-surface-container-low">
          <div className="container-x">
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight text-center mb-12">
              What teachers say.
            </h2>
            <TestimonialFlipbook testimonials={testimonials} label="From teachers" />
          </div>
        </section>
      )}

      <section className="section-y">
        <div className="container-x card-surface p-8 md:p-12 text-center">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8 max-w-3xl mx-auto">
            Ready to build a residency for your students?
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
            Tell us your grade levels, your schedule and your goals. We will take it from there with
            a tailored program proposal and pricing.
          </p>
          <Link href="/book" className="btn-primary">
            REQUEST A SCHOOL PROGRAM
          </Link>
        </div>
      </section>
    </>
  );
}
