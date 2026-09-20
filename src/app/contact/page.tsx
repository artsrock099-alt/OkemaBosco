import type { Metadata } from 'next';
import ContactForm from '@/components/public/ContactForm';
import SectionRenderer from '@/components/public/SectionRenderer';
import HeroMedia from '@/components/public/HeroMedia';
import { WhatsAppIcon, getSocialIcon, isMusicIconLink } from '@/components/public/SocialIcon';
import { getCmsSections } from '@/lib/cms';
import { getSiteSettings, getSocialLinks } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Bosco Okema about bookings, press questions, collaborations, or just to say hello.',
};

export default async function ContactPage() {
  const cmsSections = await getCmsSections('contact');
  if (cmsSections) return <SectionRenderer sections={cmsSections} />;

  const [settings, socials] = await Promise.all([getSiteSettings(), getSocialLinks()]);

  const email = settings?.contactEmail || 'okemabosco18@gmail.com';
  const phone = settings?.contactPhone || '+1 (240) 926-0614';
  const location = settings?.contactLocation || 'Kampala, Uganda';
  const whatsapp = socials.find(
    (s) =>
      (s.icon || '').toLowerCase() === 'whatsapp' || (s.platform || '').toLowerCase() === 'whatsapp'
  );
  const whatsappUrl = whatsapp?.url || 'https://wa.me/12409260614';
  const otherSocials = socials.filter((s) => s.id !== whatsapp?.id && !isMusicIconLink(s));

  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <HeroMedia slug="contact" gradient="from-deep-charcoal via-deep-charcoal/50 to-deep-charcoal/25" />
        <div className="relative z-10 container-x text-center max-w-3xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
          
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6">
            Get in touch.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant">
            Whether it is a booking, a press question, a collaboration, or you just want to say
            hello, I read every message myself.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-10">
            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
                Email
              </div>
              <a
                href={`mailto:${email}`}
                className="font-headline text-headline-md text-on-surface hover:text-muted-ochre transition-colors break-all"
              >
                {email}
              </a>
              <p className="font-body text-body-md text-on-surface-variant mt-2">
                For booking inquiries and collaborations.
              </p>
            </div>

            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
                Phone & Text
              </div>
              <a
                href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                className="font-headline text-headline-md text-on-surface hover:text-muted-ochre transition-colors"
              >
                {phone}
              </a>
              <p className="font-body text-body-md text-on-surface-variant mt-2">
                Available 9am to 6pm EST.
              </p>
            </div>

            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
                WhatsApp
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-headline text-headline-md text-on-surface hover:text-muted-ochre transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                {phone}
              </a>
              <p className="font-body text-body-md text-on-surface-variant mt-2">
                The quickest way to reach me.
              </p>
            </div>

            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
                Based In
              </div>
              <p className="font-headline text-headline-md text-on-surface">{location}</p>
              <p className="font-body text-body-md text-on-surface-variant mt-2">
                Available for travel across East Africa and internationally.
              </p>
            </div>

            {otherSocials.length > 0 && (
              <div>
                <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
                  Follow Along
                </div>
                <div className="flex gap-3 flex-wrap">
                  {otherSocials.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target={s.url.startsWith('http') ? '_blank' : undefined}
                      rel={s.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 px-4 py-2 font-label text-label-sm uppercase tracking-widest border border-earth-brown/20 text-on-surface-variant hover:bg-surface-container hover:text-muted-ochre transition-colors rounded-full"
                    >
                      {getSocialIcon(s.icon, s.platform, 'w-4 h-4')}
                      {s.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-8">
            <div className="card-surface p-6 md:p-10">
              <h2 className="font-headline text-headline-md md:text-headline-lg text-on-surface mb-8 leading-tight">
                Send me a message.
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-container">
        <div className="container-x text-center max-w-2xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            FOR BOOKING INQUIRIES
          </div>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-6 leading-tight">
            Looking to book a performance or program?
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-10">
            Use the dedicated booking form for the fastest response with availability and pricing.
          </p>
          <a href="/book" className="btn-primary">
            GO TO BOOKING FORM
          </a>
        </div>
      </section>
    </>
  );
}
