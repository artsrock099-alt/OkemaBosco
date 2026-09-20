'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';

export type FlipTestimonial = {
  id: string;
  quote: string;
  name: string;
  role?: string | null;
  organization?: string | null;
  image?: { url: string; altText?: string | null } | null;
};

type Props = {
  testimonials: FlipTestimonial[];
  /** Label shown above the page counter, e.g. "Kind words" */
  label?: string;
};

/**
 * Turns testimonials one at a time, like pages in a book.
 * Each turn re-mounts the page so the flip animation replays from the
 * correct edge (left edge going forward, right edge going back).
 */
export default function TestimonialFlipbook({ testimonials, label = 'Kind words' }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const total = testimonials.length;

  const turn = useCallback(
    (next: 'next' | 'prev') => {
      if (total < 2) return;
      setDirection(next);
      setIndex((current) =>
        next === 'next' ? (current + 1) % total : (current - 1 + total) % total
      );
    },
    [total]
  );

  if (total === 0) return null;

  const page = testimonials[index];
  const role = [page.role, page.organization].filter(Boolean).join(', ');
  const initials = page.name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* stacked sheets behind the active page, so it reads as a book */}
      <div className="absolute inset-x-3 top-3 bottom-0 bg-surface-container-high/60 rounded-sm -z-10" />
      <div className="absolute inset-x-6 top-6 bottom-0 bg-surface-container-high/35 rounded-sm -z-20" />

      <div
        className="relative"
        style={{ perspective: '2200px' }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') turn('next');
          if (e.key === 'ArrowLeft') turn('prev');
        }}
      >
        <article
          key={`${page.id}-${index}`}
          tabIndex={0}
          aria-live="polite"
          className={`relative bg-warm-ivory border border-earth-brown/15 shadow-[0_18px_50px_-24px_rgba(28,28,22,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-muted-ochre ${
            direction === 'next' ? 'flip-next' : 'flip-prev'
          }`}
        >
          {/* binding line */}
          <div className="absolute inset-y-0 left-0 w-[6px] bg-gradient-to-b from-earth-brown/25 via-earth-brown/10 to-earth-brown/25" />

          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-earth-brown/10 bg-surface-container/60 p-8 md:p-10 flex md:flex-col items-center md:items-start gap-5">
              {page.image ? (
                <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0 overflow-hidden rounded-full border border-earth-brown/20">
                  <Image
                    src={page.image.url}
                    alt={page.image.altText || page.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-full bg-earth-brown/15 flex items-center justify-center">
                  <span className="font-display text-headline-md text-earth-brown">{initials}</span>
                </div>
              )}
              <div className="md:mt-6">
                <div className="font-headline text-headline-md text-on-surface leading-tight">
                  {page.name}
                </div>
                {role && (
                  <div className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant mt-2">
                    {role}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-8 p-8 md:p-10 flex flex-col justify-between min-h-[15rem]">
              <svg
                className="w-10 h-10 text-muted-ochre/40 mb-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="font-display text-headline-lg-mobile md:text-headline-md text-on-surface leading-snug">
                &ldquo;{page.quote}&rdquo;
              </blockquote>
              <div className="mt-10 flex items-center justify-between border-t border-earth-brown/10 pt-5">
                <span className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
                  {label}
                </span>
                <span className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
                  Page {index + 1} of {total}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      {total > 1 && (
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => turn('prev')}
            aria-label="Previous testimonial"
            className="w-11 h-11 rounded-full border border-earth-brown/25 text-on-surface-variant hover:text-muted-ochre hover:border-muted-ochre transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-label={`Go to page ${i + 1}`}
                aria-current={i === index}
                onClick={() => {
                  setDirection(i > index ? 'next' : 'prev');
                  setIndex(i);
                }}
                className={`h-[3px] transition-all duration-300 ${
                  i === index ? 'w-8 bg-muted-ochre' : 'w-4 bg-earth-brown/25 hover:bg-earth-brown/50'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => turn('next')}
            aria-label="Next testimonial"
            className="w-11 h-11 rounded-full border border-earth-brown/25 text-on-surface-variant hover:text-muted-ochre hover:border-muted-ochre transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
