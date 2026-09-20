import NewsletterForm from './NewsletterForm';
import { getSiteSettings } from '@/lib/queries';

/**
 * The newsletter band that closes every public page, just above the footer.
 * Visibility follows the same `newsletterEnabled` flag the footer uses, and
 * every sign-up is written to the NewsletterSubscriber table.
 */
export default async function NewsletterSection() {
  let settings: any = null;

  try {
    settings = await getSiteSettings();
  } catch (error) {
    console.warn('Newsletter section could not read site settings:', error);
  }

  if (settings?.newsletterEnabled === false) return null;

  return (
    <section id="newsletter" className="section-y bg-deep-charcoal text-warm-ivory">
      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-7">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              Stay in the loop
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-warm-ivory tracking-tight leading-tight mb-5">
              Hear about new shows and music first.
            </h2>
            <p className="font-body text-body-md text-surface-variant max-w-xl">
              One short email when there is a date near you, a new recording, or a story worth
              sharing. No spam, and you can leave the list whenever you like.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="bg-warm-ivory/5 border border-surface-variant/20 p-6 md:p-8 rounded-lg">
              <NewsletterForm variant="dark" />
              <p className="font-body text-body-md text-surface-variant/80 mt-4">
                Prefer a message instead? Write to{' '}
                <a
                  href={`mailto:${settings?.contactEmail || 'okemabosco18@gmail.com'}`}
                  className="text-muted-ochre hover:underline"
                >
                  {settings?.contactEmail || 'okemabosco18@gmail.com'}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
