import type { Metadata } from 'next';
import BookingForm from '@/components/public/BookingForm';
import SectionRenderer from '@/components/public/SectionRenderer';
import HeroMedia from '@/components/public/HeroMedia';
import { WhatsAppIcon } from '@/components/public/SocialIcon';
import { getCmsSections } from '@/lib/cms';
import { getSiteSettings, getSocialLinks } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Book Bosco',
  description:
    'Book Bosco Okema for live performances, school residencies, elderly visits, cultural presentations, workshops, festivals and private events.',
};

export default async function BookPage() {
  const cmsSections = await getCmsSections('book');
  if (cmsSections) return <SectionRenderer sections={cmsSections} />;

  const [settings, socials] = await Promise.all([getSiteSettings(), getSocialLinks()]);
  const phone = settings?.contactPhone || '+1 (240) 926-0614';
  const whatsappUrl =
    socials.find(
      (s) =>
        (s.icon || '').toLowerCase() === 'whatsapp' ||
        (s.platform || '').toLowerCase() === 'whatsapp'
    )?.url || 'https://wa.me/12409260614';

  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <HeroMedia slug="book" gradient="from-deep-charcoal via-deep-charcoal/50 to-deep-charcoal/25" />
        <div className="relative z-10 container-x text-center max-w-3xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
          
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6">
            Start the conversation.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mx-auto">
            Bring an engaging musician and cultural educator to your next event. Fill out the
            details below and I will respond with availability, format options and tailored pricing.
          </p>
        </div>
      </section>
      <section className="pb-section-gap">
        <div className="container-x max-w-4xl">
          <div className="card-surface p-6 md:p-8 lg:p-10">
            <BookingForm contactEmail={settings?.contactEmail || undefined} />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
            <span className="font-body text-body-md text-on-surface-variant">
              In a hurry and prefer to chat?
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-earth-brown/25 font-label text-label-sm uppercase tracking-widest text-on-surface hover:border-muted-ochre hover:text-muted-ochre transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              WhatsApp {phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
