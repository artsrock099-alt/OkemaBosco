import Link from 'next/link';
import Image from 'next/image';
import { EventCard } from '@/components/public/EventCard';
import { TestimonialCard } from '@/components/public/TestimonialCard';
import NewsletterForm from '@/components/public/NewsletterForm';
import {
  getUpcomingEvents,
  getPastEvents,
  getTestimonials,
  getMusic,
  getInstruments,
  getSocialLinks,
} from '@/lib/queries';
import type { PageSection } from '@prisma/client';

type Content = Record<string, any>;

// ---------- helpers ----------

function cx(content: Content, key: string, fallback = '') {
  const v = content?.[key];
  return v == null || v === '' ? fallback : String(v);
}

function ButtonsRow({ buttons, variant }: { buttons?: any[]; variant?: string }) {
  if (!buttons || !Array.isArray(buttons) || buttons.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-4">
      {buttons.map((b, i) => {
        const href = b?.href || '#';
        const label = b?.label || 'Learn More';
        const cls =
          b?.variant === 'outline'
            ? variant === 'dark'
              ? 'btn-outline text-warm-ivory'
              : 'btn-outline text-primary'
            : variant === 'dark'
            ? 'btn-primary-light'
            : 'btn-primary';
        return (
          <Link key={i} href={href} className={cls}>
            {label}
          </Link>
        );
      })}
    </div>
  );
}

function SectionHead({ eyebrow, heading, dark = false }: { eyebrow?: string; heading?: string; dark?: boolean }) {
  if (!eyebrow && !heading) return null;
  return (
    <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
      {eyebrow && (
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
          {eyebrow}
        </div>
      )}
      {heading && (
        <h2
          className={`font-display text-headline-lg-mobile md:text-headline-lg tracking-tight ${
            dark ? 'text-warm-ivory' : 'text-on-surface'
          }`}
        >
          {heading}
        </h2>
      )}
    </div>
  );
}

// ---------- section renderers ----------

async function HeroSection({ content }: { content: Content }) {
  const headline = cx(content, 'headline', 'BOSCO OKEMA');
  const subheadline = cx(content, 'subheadline', 'Ugandan Musician • Cultural Educator • Performer');
  const description = cx(
    content,
    'description',
    'Experience the music, stories and traditions of Uganda through live performance, cultural education and meaningful community experiences.'
  );
  const image = cx(content, 'image');
  const imageAlt = cx(content, 'imageAlt', 'Bosco Okema performing live');
  const buttons = content?.buttons || [
    { label: 'BOOK BOSCO', href: '/book' },
    { label: 'WATCH & LISTEN', href: '/listen', variant: 'outline' },
  ];
  const socials: string[] = content?.socials || ['INSTAGRAM', 'SPOTIFY', 'YOUTUBE', 'FACEBOOK'];

  return (
    <section className="relative min-h-screen flex flex-col justify-end pt-32 pb-16 md:pb-24 bg-deep-charcoal text-white overflow-hidden">
      {image && (
        <div className="absolute inset-0 z-0">
          <img src={image} alt={imageAlt} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal via-deep-charcoal/40 to-transparent" />
        </div>
      )}
      <div className="relative z-10 container-x grid grid-cols-1 md:grid-cols-12 gap-gutter items-end">
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tighter leading-none">
            {headline}
          </h1>
          <p className="font-headline text-headline-lg-mobile md:text-headline-md text-surface-variant font-light max-w-2xl">
            {subheadline}
          </p>
          <p className="font-body text-body-md md:text-body-lg text-surface-container-highest max-w-xl mb-2">
            {description}
          </p>
          <div className="mt-4">
            <ButtonsRow buttons={buttons} variant="dark" />
          </div>
        </div>
        {socials.length > 0 && (
          <div className="hidden md:flex md:col-span-4 lg:col-span-3 justify-end items-end pb-8">
            <div className="flex flex-col gap-4 text-right">
              {socials.map((s) => (
                <a key={s} href="#" className="nav-link text-surface-variant">
                  {s}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ImageTextSection({ content }: { content: Content }) {
  const eyebrow = cx(content, 'eyebrow');
  const heading = cx(content, 'heading');
  const body: string[] = Array.isArray(content?.body) ? content.body : content?.body ? [content.body] : [];
  const image = cx(content, 'image');
  const imageAlt = cx(content, 'imageAlt', '');
  const buttons = content?.buttons;

  return (
    <section className="section-y">
      <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {image && (
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-tl-3xl rounded-br-3xl">
              <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <div className={`${image ? 'md:col-span-6 md:col-start-7 order-1 md:order-2' : 'md:col-span-8 md:col-start-3 text-center'}`}>
          {eyebrow && (
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              {eyebrow}
            </div>
          )}
          {heading && (
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight leading-tight mb-8">
              {heading}
            </h2>
          )}
          {body.length > 0 && (
            <div className="space-y-6">
              {body.map((p, i) => (
                <p key={i} className={i === 0 ? 'font-body text-body-lg text-on-surface-variant' : 'font-body text-body-md text-on-surface-variant'}>
                  {p}
                </p>
              ))}
            </div>
          )}
          {buttons && buttons.length > 0 && (
            <div className="mt-10">
              <ButtonsRow buttons={buttons} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RichTextSection({ content }: { content: Content }) {
  const eyebrow = cx(content, 'eyebrow');
  const heading = cx(content, 'heading');
  const body = Array.isArray(content?.body) ? content.body : content?.body ? [content.body] : [];
  const align = cx(content, 'align', 'center');

  return (
    <section className="section-y">
      <div className={`container-x max-w-4xl ${align === 'center' ? 'text-center' : ''}`}>
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <div className="space-y-6 font-body text-body-lg text-on-surface-variant">
          {body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ content }: { content: Content }) {
  const eyebrow = cx(content, 'eyebrow', 'OFFERINGS');
  const heading = cx(content, 'heading', 'Experiences that bring Uganda to you.');
  const items: any[] = Array.isArray(content?.items) ? content.items : [];

  if (items.length === 0) return null;

  return (
    <section className="section-y bg-surface-container">
      <div className="container-x">
        <div className="text-center mb-16 md:mb-24 max-w-2xl mx-auto">
          {eyebrow && (
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              {eyebrow}
            </div>
          )}
          {heading && (
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              {heading}
            </h2>
          )}
        </div>
        <div className="space-y-24 md:space-y-32">
          {items.map((s, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${
                i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div className="md:col-span-7">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={s.image} alt={s.subtitle || s.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="md:col-span-5 md:px-8">
                {s.title && (
                  <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                    {s.title}
                  </div>
                )}
                {s.subtitle && (
                  <h3 className="font-display text-headline-md md:text-headline-lg text-on-surface leading-tight mb-6">
                    {s.subtitle}
                  </h3>
                )}
                {s.description && (
                  <p className="font-body text-body-md text-on-surface-variant mb-8">{s.description}</p>
                )}
                {s.href && (
                  <Link href={s.href} className="btn-ghost">
                    EXPLORE {String(s.title || '').split(' ').slice(1).join(' ') || 'MORE'} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function InstrumentsSection({ content }: { content: Content }) {
  const instruments = await getInstruments();
  if (instruments.length === 0) return null;
  const eyebrow = cx(content, 'eyebrow', 'SOUNDS OF UGANDA');
  const heading = cx(content, 'heading', 'Traditional instruments that carry the heartbeat of a nation.');

  return (
    <section className="section-y">
      <div className="container-x">
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {instruments.map((inst) => (
            <div key={inst.id} className="group">
              <div className="relative aspect-square overflow-hidden bg-surface-container mb-4">
                {inst.image ? (
                  <Image
                    src={inst.image.url}
                    alt={inst.image.altText || inst.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-5xl text-on-surface-variant/30">
                      {inst.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="font-headline text-headline-md text-on-surface mb-2 group-hover:text-muted-ochre transition-colors">
                {inst.name}
              </h3>
              {inst.description && (
                <p className="font-body text-body-md text-on-surface-variant line-clamp-3">
                  {inst.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function EventsSection({ content }: { content: Content }) {
  const eyebrow = cx(content, 'eyebrow', 'UPCOMING EVENTS');
  const heading = cx(content, 'heading', 'Where to find Bosco.');
  const limit = Number(content?.limit || 3);
  const showPast = Boolean(content?.showPast);
  const events = showPast ? await getPastEvents(limit) : await getUpcomingEvents(limit);
  const viewAllHref = cx(content, 'viewAllHref', '/events');

  return (
    <section className="section-y bg-surface-container-low">
      <div className="container-x">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div>
            {eyebrow && (
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                {heading}
              </h2>
            )}
          </div>
          <Link href={viewAllHref} className="btn-ghost">
            VIEW ALL EVENTS →
          </Link>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        ) : (
          <div className="card-surface p-16 text-center">
            <h3 className="font-headline text-headline-md text-on-surface mb-2">
              Stay tuned for upcoming performances.
            </h3>
            <p className="font-body text-body-md text-on-surface-variant mb-6">
              New dates are being added. Subscribe to be the first to know.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

async function TestimonialsSection({ content }: { content: Content }) {
  const eyebrow = cx(content, 'eyebrow', 'WHAT PEOPLE ARE SAYING');
  const heading = cx(content, 'heading', 'Kind words from communities.');
  const limit = Number(content?.limit || 4);
  const testimonials = await getTestimonials(true, limit);
  if (testimonials.length === 0) return null;

  return (
    <section className="section-y">
      <div className="container-x">
        <SectionHead eyebrow={eyebrow} heading={heading} />
        {testimonials[0] && <TestimonialCard testimonial={testimonials[0]} variant="featured" />}
        {testimonials.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-16">
            {testimonials.slice(1, 4).map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

async function FeaturedVideoSection({ content }: { content: Content }) {
  const eyebrow = cx(content, 'eyebrow', 'EXPERIENCE THE MUSIC');
  const heading = cx(content, 'heading', 'Live performance at the Kampala National Theatre.');
  const videoUrl = cx(content, 'videoUrl');
  const thumbnail = cx(content, 'thumbnail');
  const ctaLabel = cx(content, 'ctaLabel', 'MORE PERFORMANCES');
  const ctaHref = cx(content, 'ctaHref', '/listen');

  return (
    <section className="section-y bg-deep-charcoal text-warm-ivory">
      <div className="container-x">
        <SectionHead eyebrow={eyebrow} heading={heading} dark />
        <div className="relative aspect-video w-full max-w-5xl mx-auto overflow-hidden">
          {thumbnail ? (
            <img src={thumbnail} alt={heading} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-surface-container/20 flex items-center justify-center">
              <span className="font-label text-label-sm uppercase tracking-widest text-surface-variant">
                No video selected
              </span>
            </div>
          )}
          {videoUrl && (
            <button
              type="button"
              onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
              className="absolute inset-0 flex items-center justify-center group cursor-pointer"
              aria-label="Play video"
            >
              <span className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-warm-ivory/90 text-deep-charcoal flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-muted-ochre group-hover:text-white">
                <svg className="w-10 h-10 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </div>
        {ctaLabel && (
          <div className="text-center mt-10">
            <Link href={ctaHref} className="btn-outline text-warm-ivory">
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function CTASection({ content }: { content: Content }) {
  const eyebrow = cx(content, 'eyebrow', 'BRING BOSCO TO YOUR COMMUNITY');
  const headline = cx(
    content,
    'headline',
    'School programs • Senior communities • Festivals • Concerts • Cultural events • Private events'
  );
  const buttons = content?.buttons || [
    { label: 'BOOK BOSCO', href: '/book' },
    { label: 'GET IN TOUCH', href: '/contact', variant: 'outline' },
  ];

  return (
    <section className="section-y">
      <div className="container-x">
        <div className="card-surface p-10 md:p-20 text-center">
          {eyebrow && (
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              {eyebrow}
            </div>
          )}
          {headline && (
            <h2 className="font-display text-headline-lg-mobile md:text-display-lg text-on-surface tracking-tight leading-tight mb-10 max-w-4xl mx-auto">
              {headline}
            </h2>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonsRow buttons={buttons} />
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteSection({ content }: { content: Content }) {
  const quote = cx(content, 'quote');
  const attribution = cx(content, 'attribution');
  const role = cx(content, 'role');
  if (!quote) return null;
  return (
    <section className="section-y bg-deep-charcoal text-warm-ivory">
      <div className="container-x max-w-4xl text-center">
        <blockquote className="font-display text-headline-lg-mobile md:text-headline-lg text-warm-ivory leading-tight italic">
          &ldquo;{quote}&rdquo;
        </blockquote>
        {(attribution || role) && (
          <div className="mt-8 font-label text-label-sm uppercase tracking-widest text-muted-ochre">
            — {attribution}
            {role ? ` • ${role}` : ''}
          </div>
        )}
      </div>
    </section>
  );
}

function ImageSection({ content }: { content: Content }) {
  const image = cx(content, 'image');
  const imageAlt = cx(content, 'imageAlt', '');
  const caption = cx(content, 'caption');
  if (!image) return null;
  return (
    <section className="section-y">
      <div className="container-x">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
        </div>
        {caption && (
          <p className="font-label text-label-sm text-on-surface-variant mt-3 text-center">{caption}</p>
        )}
      </div>
    </section>
  );
}

function GallerySection({ content }: { content: Content }) {
  const images: any[] = Array.isArray(content?.images) ? content.images : [];
  if (images.length === 0) return null;
  return (
    <section className="section-y">
      <div className="container-x">
        <SectionHead eyebrow={cx(content, 'eyebrow')} heading={cx(content, 'heading')} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden">
              <img src={img?.url || img} alt={img?.alt || ''} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function MusicSection({ content }: { content: Content }) {
  const featured = Boolean(content?.featured);
  const limit = Number(content?.limit || 6);
  const tracks = await getMusic(featured, limit);
  if (tracks.length === 0) return null;
  return (
    <section className="section-y">
      <div className="container-x">
        <SectionHead eyebrow={cx(content, 'eyebrow', 'MUSIC')} heading={cx(content, 'heading')} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((t) => (
            <div key={t.id} className="card-surface p-6 flex flex-col">
              {t.artwork ? (
                <Image src={t.artwork.url} alt={t.artwork.altText || t.title} width={600} height={600} className="w-full aspect-square object-cover mb-4" />
              ) : (
                <div className="w-full aspect-square bg-surface-container mb-4 flex items-center justify-center font-display text-4xl text-on-surface-variant/30">
                  {t.title.charAt(0)}
                </div>
              )}
              <h3 className="font-headline text-headline-md text-on-surface">{t.title}</h3>
              {t.album && <p className="font-label text-label-sm text-on-surface-variant mt-1">{t.album.title}</p>}
              {t.description && <p className="font-body text-body-md text-on-surface-variant mt-2 line-clamp-2">{t.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection({ content }: { content: Content }) {
  const eyebrow = cx(content, 'eyebrow', 'STAY CONNECTED');
  const heading = cx(content, 'heading', 'Join the community.');
  const description = cx(content, 'description', 'Subscribe for news, upcoming events and releases.');
  return (
    <section className="section-y bg-surface-container">
      <div className="container-x max-w-2xl text-center">
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <p className="font-body text-body-md text-on-surface-variant mb-8">{description}</p>
        <div className="max-w-md mx-auto">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}

function VideoSection({ content }: { content: Content }) {
  const videoUrl = cx(content, 'videoUrl');
  const title = cx(content, 'title');
  const description = cx(content, 'description');
  if (!videoUrl) return null;
  return (
    <section className="section-y">
      <div className="container-x max-w-5xl">
        <SectionHead eyebrow={cx(content, 'eyebrow')} heading={cx(content, 'heading')} />
        <div className="relative aspect-video overflow-hidden bg-deep-charcoal">
          <video src={videoUrl} controls className="w-full h-full object-contain" poster={cx(content, 'thumbnail') || undefined} />
        </div>
        {(title || description) && (
          <div className="mt-6">
            {title && <h3 className="font-headline text-headline-md text-on-surface">{title}</h3>}
            {description && <p className="font-body text-body-md text-on-surface-variant mt-2">{description}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

function AudioSection({ content }: { content: Content }) {
  const audioUrl = cx(content, 'audioUrl');
  if (!audioUrl) return null;
  return (
    <section className="section-y">
      <div className="container-x max-w-3xl">
        <SectionHead eyebrow={cx(content, 'eyebrow')} heading={cx(content, 'heading')} />
        <div className="card-surface p-6">
          <audio src={audioUrl} controls className="w-full" />
          {cx(content, 'title') && <p className="font-headline text-headline-md text-on-surface mt-4">{cx(content, 'title')}</p>}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ content }: { content: Content }) {
  const items: any[] = Array.isArray(content?.items) ? content.items : [];
  if (items.length === 0) return null;
  return (
    <section className="section-y">
      <div className="container-x max-w-3xl">
        <SectionHead eyebrow={cx(content, 'eyebrow', 'FAQ')} heading={cx(content, 'heading')} />
        <div className="space-y-4">
          {items.map((item, i) => (
            <details key={i} className="card-surface p-6 group">
              <summary className="font-headline text-headline-md text-on-surface cursor-pointer list-none flex justify-between items-center">
                {item?.question || 'Question'}
                <span className="text-muted-ochre group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="font-body text-body-md text-on-surface-variant mt-4">{item?.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialLinksSection() {
  return (
    <section className="section-y bg-surface-container">
      <div className="container-x text-center">
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-6">
          FOLLOW ALONG
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/contact" className="btn-ghost">
            FIND BOSCO ON SOCIAL →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ContactFormSection({ content }: { content: Content }) {
  return (
    <section className="section-y">
      <div className="container-x max-w-3xl">
        <SectionHead eyebrow={cx(content, 'eyebrow', 'CONTACT')} heading={cx(content, 'heading', 'Get in touch.')} />
        <Link href="/contact" className="btn-primary mx-auto inline-flex">
          GO TO CONTACT PAGE
        </Link>
      </div>
    </section>
  );
}

function BookingFormSection({ content }: { content: Content }) {
  return (
    <section className="section-y bg-surface-container">
      <div className="container-x max-w-3xl text-center">
        <SectionHead eyebrow={cx(content, 'eyebrow', 'BOOK BOSCO')} heading={cx(content, 'heading', 'Start the conversation.')} />
        <Link href="/book" className="btn-primary mx-auto inline-flex">
          GO TO BOOKING FORM
        </Link>
      </div>
    </section>
  );
}

function EmbedSection({ content }: { content: Content }) {
  const html = cx(content, 'html');
  if (!html) return null;
  return (
    <section className="section-y">
      <div className="container-x">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </section>
  );
}

function ButtonsSection({ content }: { content: Content }) {
  const buttons = Array.isArray(content?.buttons) ? content.buttons : [];
  if (buttons.length === 0) return null;
  return (
    <section className="section-y">
      <div className="container-x flex flex-wrap justify-center gap-4">
        <ButtonsRow buttons={buttons} />
      </div>
    </section>
  );
}

// ---------- dispatcher ----------

export default async function SectionRenderer({ sections }: { sections: PageSection[] }) {
  const visible = [...sections]
    .filter((s) => s.isVisible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const rendered: React.ReactNode[] = [];
  for (const section of visible) {
    const content = (section.content || {}) as Content;
    switch (section.type) {
      case 'HERO':
        rendered.push(<HeroSection key={section.id} content={content} />);
        break;
      case 'IMAGE_TEXT':
        rendered.push(<ImageTextSection key={section.id} content={content} />);
        break;
      case 'RICH_TEXT':
        rendered.push(<RichTextSection key={section.id} content={content} />);
        break;
      case 'SERVICES':
        rendered.push(<ServicesSection key={section.id} content={content} />);
        break;
      case 'INSTRUMENTS':
        rendered.push(<InstrumentsSection key={section.id} content={content} />);
        break;
      case 'EVENTS':
        rendered.push(<EventsSection key={section.id} content={content} />);
        break;
      case 'TESTIMONIALS':
        rendered.push(<TestimonialsSection key={section.id} content={content} />);
        break;
      case 'FEATURED_VIDEO':
        rendered.push(<FeaturedVideoSection key={section.id} content={content} />);
        break;
      case 'CTA':
        rendered.push(<CTASection key={section.id} content={content} />);
        break;
      case 'QUOTE':
        rendered.push(<QuoteSection key={section.id} content={content} />);
        break;
      case 'IMAGE':
        rendered.push(<ImageSection key={section.id} content={content} />);
        break;
      case 'GALLERY':
        rendered.push(<GallerySection key={section.id} content={content} />);
        break;
      case 'MUSIC':
        rendered.push(<MusicSection key={section.id} content={content} />);
        break;
      case 'NEWSLETTER':
        rendered.push(<NewsletterSection key={section.id} content={content} />);
        break;
      case 'VIDEO':
        rendered.push(<VideoSection key={section.id} content={content} />);
        break;
      case 'AUDIO':
        rendered.push(<AudioSection key={section.id} content={content} />);
        break;
      case 'FAQ':
        rendered.push(<FAQSection key={section.id} content={content} />);
        break;
      case 'SOCIAL_LINKS':
        rendered.push(<SocialLinksSection key={section.id} />);
        break;
      case 'CONTACT_FORM':
        rendered.push(<ContactFormSection key={section.id} content={content} />);
        break;
      case 'BOOKING_FORM':
        rendered.push(<BookingFormSection key={section.id} content={content} />);
        break;
      case 'EMBED':
        rendered.push(<EmbedSection key={section.id} content={content} />);
        break;
      case 'BUTTONS':
        rendered.push(<ButtonsSection key={section.id} content={content} />);
        break;
      default:
        break;
    }
  }

  return <>{rendered}</>;
}
