import type { Metadata } from 'next';
import Link from 'next/link';
import TestimonialFlipbook from '@/components/public/TestimonialFlipbook';
import { getTestimonials } from '@/lib/queries';
import SectionRenderer from '@/components/public/SectionRenderer';
import HeroMedia from '@/components/public/HeroMedia';
import { getCmsSections } from '@/lib/cms';
import { getSiteImages } from '@/lib/site-images';

export const metadata: Metadata = {
  title: 'Elderly Visits',
  description:
    'Live musical performances for senior communities, assisted living, nursing homes, memory care and senior centers. Music that brings joy and connection.',
};

const benefits = [
  {
    title: 'Triggers Memory',
    description:
      'Familiar melodies and rhythms can help residents recall and share stories from their past, opening moments of clarity and connection.',
  },
  {
    title: 'Reduces Anxiety',
    description:
      'Live, acoustic music creates a peaceful atmosphere, lowering tension and inviting a sense of safety and ease.',
  },
  {
    title: 'Encourages Engagement',
    description:
      'Toe-tapping, hand-clapping and gentle singing get everyone involved, including residents who are often withdrawn or quiet.',
  },
  {
    title: 'Brings Dignity',
    description:
      'Honouring elders with music and full attention reminds them that they are seen, valued and cherished.',
  },
];

const whatWeBring = [
  {
    title: 'Soothing Live Music',
    description:
      'The soft, ringing tones of the thumb piano and the warm sound of the adungu suit quiet spaces. No amplification and no overstimulation, just live acoustic music that invites calm and smiles, with familiar songs and sing-alongs when residents want to join in.',
  },
  {
    title: 'Cultural Connection & Storytelling',
    description:
      'Between songs we share short stories about the instruments: where they come from, how they are made and what they meant to families and communities. The stories spark conversation and memories, and many residents love touching the instruments and asking questions.',
  },
  {
    title: 'Flexible & Respectful Programs',
    description:
      'We adapt to your residents’ energy levels. We play for groups in common areas, or visit bedside for one-to-one moments, and we work around meals, medications and rest times.',
  },
];

const programFormats = [
  {
    label: 'Program 01',
    title: 'Afternoon Concert',
    duration: '45 minutes',
    description:
      'A group program with music and stories in the common area. Interactive and joyful, built for group connection, with residents taking part through clapping, singing and questions.',
  },
  {
    label: 'Program 02',
    title: 'Room-to-Room Visits',
    duration: '5-10 min per resident',
    description:
      'Bedside sets for residents who cannot join the group programs. Intimate, one-to-one moments where the music comes to them.',
  },
];

const directorPoints = [
  'Flexible scheduling, working around meals, medications and rest times',
  'No equipment needed, acoustic instruments only',
  'Adaptable programs, from lively group sessions to quiet personal presence',
  'Recurring visits available, monthly or seasonal',
  'Budget conscious, we will find a plan that fits your facility',
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
  const cmsSections = await getCmsSections('education/elderly-visits');
  if (cmsSections) return <SectionRenderer sections={cmsSections} />;

  const testimonials = (await getTestimonials(false, 6)).filter((_t, i) => i % 2 === 1);
  const images = await getSiteImages();

  return (
    <>
      <section className="relative min-h-[78vh] md:min-h-[88vh] flex flex-col justify-end pt-32 pb-16 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <HeroMedia
          slug="education/elderly-visits"
          defaultImage="/OKema/PrimRoseElders6.jpeg"
          defaultOverlay={50}
          gradient="from-deep-charcoal via-deep-charcoal/60 to-transparent"
        />
        <div className="relative z-10 container-x max-w-4xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
          
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-8">
            Music that brings memory home.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mb-8">
            Music reaches places that words sometimes cannot. Live African instruments, gentle
            rhythms and familiar melodies, creating moments of joy, comfort and connection for
            residents and staff.
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
                src={images['elderly-visits-story'].url}
                alt={images['elderly-visits-story'].alt}
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
              Whether sharing familiar African melodies, singing call-and-response songs, or playing
              gentle instrumentals on the adungu, each visit is crafted to meet the needs of the
              room. The result is moments of joy, shared across generations.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-container">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              WHAT WE BRING
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Calm, connection and joy.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {whatWeBring.map((item) => (
              <div key={item.title} className="card-surface p-8 flex flex-col h-full">
                <h3 className="font-headline text-headline-md text-on-surface mb-4">{item.title}</h3>
                <p className="font-body text-body-md text-on-surface-variant flex-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-container-low">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              BENEFITS FOR RESIDENTS
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              What music does for residents.
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
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              PROGRAM FORMATS
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Two ways to host a visit.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {programFormats.map((program) => (
              <div key={program.title} className="card-surface p-8 md:p-10 flex flex-col h-full">
                <div className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                  {program.label}
                </div>
                <div className="font-label text-label-sm text-muted-ochre uppercase tracking-widest mb-3">
                  {program.duration}
                </div>
                <h3 className="font-headline text-headline-md text-on-surface mb-4">{program.title}</h3>
                <p className="font-body text-body-md text-on-surface-variant flex-1">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
          <p className="font-body text-body-md text-on-surface-variant text-center mt-8 max-w-2xl mx-auto">
            Ask about recurring monthly visits and special holiday programs. We will work with your
            budget and schedule.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <div className="card-surface p-8 md:p-10">
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

      <section className="section-y bg-surface-container">
        <div className="container-x">
          <div className="card-surface p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                  FOR ACTIVITY DIRECTORS
                </div>
                <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8 leading-tight">
                  Planning a visit is easy.
                </h2>
                <p className="font-body text-body-md text-on-surface-variant mb-6">
                  Here is what to expect when you bring Bosco into your facility. We bring the
                  sound, the stories and the warmth. You bring the residents who deserve to feel
                  seen.
                </p>
              </div>
              <ul className="grid grid-cols-1 gap-3">
                {directorPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 p-4 bg-surface-container rounded">
                    <svg className="w-5 h-5 text-muted-ochre flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-body text-body-md text-on-surface">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-deep-charcoal text-warm-ivory">
        <div className="container-x max-w-4xl text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-6">
            A NOTE ON HEALING
          </div>
          <blockquote className="font-display text-headline-lg-mobile md:text-headline-lg text-warm-ivory leading-tight italic mb-8">
            &ldquo;In northern Uganda, music helped communities rebuild after loss. The adungu was
            played to welcome people home, and the thumb piano was played to calm the heart. We
            carry that same spirit here: music as comfort, as company, and as a way to say you are
            not alone.&rdquo;
          </blockquote>
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
            Okema Bosco
          </div>
          <div className="mt-10 pt-8 border-t border-surface-variant/20">
            <p className="font-headline text-body-lg md:text-headline-md text-surface-variant italic">
              &ldquo;The elder who sits alone has many stories no one hears. But when the drum
              speaks, they all remember.&rdquo;
            </p>
            <div className="mt-4 font-label text-label-sm uppercase tracking-widest text-muted-ochre">
              Ugandan proverb
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
            <TestimonialFlipbook testimonials={testimonials} label="From the room" />
          </div>
        </section>
      )}

      <section className="section-y">
        <div className="container-x card-surface p-8 md:p-12 text-center">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-8 max-w-3xl mx-auto">
            Ready to bring music to your residents?
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
            Let us talk about your facility, your residents&rsquo; needs, and what kind of program
            fits best. We will work with your budget and schedule.
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
