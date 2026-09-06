import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Bosco',
  description:
    'About Bosco Okema — Ugandan musician, cultural educator and performer. Learn the story behind the music.',
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-deep-charcoal text-warm-ivory overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1600&q=80"
            alt="Bosco Okema portrait"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-charcoal/40 via-deep-charcoal/60 to-deep-charcoal" />
        </div>
        <div className="relative z-10 container-x text-center max-w-4xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            ABOUT
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-8">
            I am Bosco.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mx-auto">
            A musician, cultural educator, and performer from Uganda. I travel the world with an
            Adungu in hand and a story to tell.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-tl-3xl rounded-br-3xl">
              <img
                src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1000&q=80"
                alt="Bosco playing Adungu"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7 order-1 md:order-2">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              THE STORY
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight leading-tight mb-8">
              Music was my first language.
            </h2>
            <div className="space-y-6 font-body text-body-md md:text-body-lg text-on-surface-variant leading-relaxed">
              <p>
                I grew up in a home where music was not something you turned on — it was something
                you did. My grandfather played the Adungu, my mother sang while she cooked, and
                the children in our village danced when the drums started at sunset. Music was how
                we said hello, how we said goodbye, and how we told stories we could not put into
                words.
              </p>
              <p>
                As I grew older, I realized that this music — the music of my home — was something
                many people had never heard. I began playing in schools, then in community
                centers, then at festivals, then on stages far from Uganda. And everywhere I went,
                the same thing happened: people leaned in. They listened. They joined in.
              </p>
              <p>
                That is when I understood: my job is not just to perform. It is to create a space
                where culture becomes a conversation — not something behind glass in a museum, but
                something alive, that we all get to make together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-container">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              WHAT I BELIEVE
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              A few things I hold onto.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Music belongs to everyone.',
                description:
                  'You do not need talent to enjoy it, training to play it, or permission to love it. You only need to be present.',
              },
              {
                title: 'Culture is living.',
                description:
                  'It grows, it changes, it travels — and that is how it stays alive. Tradition is not a museum. It is a conversation.',
              },
              {
                title: 'The audience is half the band.',
                description:
                  'Every performance is co-created with the room. If you are there, you are part of the music. You always are.',
              },
            ].map((b, i) => (
              <div key={b.title} className="card-surface p-8 md:p-10">
                <div className="font-display text-6xl text-on-surface/5 mb-6">0{i + 1}</div>
                <h3 className="font-headline text-headline-md text-on-surface mb-4 leading-tight">
                  {b.title}
                </h3>
                <p className="font-body text-body-md text-on-surface-variant">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              THE WORK
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight leading-tight mb-8">
              What I spend my days doing.
            </h2>
            <div className="space-y-6 font-body text-body-md text-on-surface-variant leading-relaxed">
              <p>
                On any given week, I might be in a classroom full of five-year-olds pretending to
                be elephants, in a rehearsal hall with a five-piece band, or in a quiet living
                room playing the Adungu for someone who has not heard a live song in years.
              </p>
              <p>
                These seem like very different rooms. But to me, they are the same work — bringing
                music to the places where it is needed, using it to connect people who might not
                otherwise find a reason to talk.
              </p>
              <p>
                If any of this resonates — whether you are a teacher, an event organizer, a
                festival programmer, or someone who just loves a good song &mdash; I would love to hear
                from you.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link href="/book" className="btn-primary">
                LET&apos;S CREATE SOMETHING
              </Link>
              <Link href="/contact" className="btn-outline text-primary">
                SAY HELLO
              </Link>
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8 grid grid-cols-2 gap-3 md:gap-4">
            {[
              'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
              'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80',
              'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&q=80',
              'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
            ].map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden aspect-square ${i % 2 === 1 ? 'mt-12' : ''}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-deep-charcoal text-warm-ivory">
        <div className="container-x max-w-4xl text-center">
          <blockquote className="font-display text-headline-lg-mobile md:text-headline-lg text-warm-ivory leading-tight italic">
            &ldquo;The song is never finished. It is only waiting for the next person to sing it.&rdquo;
          </blockquote>
          <div className="mt-8 font-label text-label-sm uppercase tracking-widest text-muted-ochre">
            — A saying from my grandfather
          </div>
        </div>
      </section>
    </>
  );
}
