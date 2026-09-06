import type { Metadata } from 'next';
import ContactForm from '@/components/public/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Bosco Okema — booking inquiries, press questions, collaborations, or just to say hello.',
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-deep-charcoal text-warm-ivory">
        <div className="container-x text-center max-w-3xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            CONTACT
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6">
            Get in touch.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant">
            Whether it is a booking, a press inquiry, a collaboration, or you just want to say
            hello — I read every message personally.
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
                href="mailto:hello@boscookema.com"
                className="font-headline text-headline-md text-on-surface hover:text-muted-ochre transition-colors break-all"
              >
                hello@boscookema.com
              </a>
            </div>
            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
                Phone & WhatsApp
              </div>
              <a
                href="tel:+256700000000"
                className="font-headline text-headline-md text-on-surface hover:text-muted-ochre transition-colors"
              >
                +256 700 000 000
              </a>
            </div>
            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
                Based In
              </div>
              <p className="font-headline text-headline-md text-on-surface">
                Kampala, Uganda
              </p>
              <p className="font-body text-body-md text-on-surface-variant mt-2">
                Available for travel across East Africa, the continent, and internationally.
              </p>
            </div>
            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
                Follow Along
              </div>
              <div className="flex gap-3 flex-wrap">
                {['Instagram', 'Facebook', 'YouTube', 'Spotify', 'TikTok'].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="px-4 py-2 font-label text-label-sm uppercase tracking-widest border border-earth-brown/20 text-on-surface-variant hover:bg-surface-container hover:text-muted-ochre transition-colors rounded-full"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
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
