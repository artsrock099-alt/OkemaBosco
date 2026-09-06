import Image from 'next/image';
import type { Testimonial, Media } from '@prisma/client';

type TestimonialWithImage = Testimonial & {
  image?: Media | null;
};

type Props = {
  testimonial: TestimonialWithImage;
  variant?: 'default' | 'featured';
};

export function TestimonialCard({ testimonial, variant = 'default' }: Props) {
  if (variant === 'featured') {
    return (
      <div className="bg-deep-charcoal text-warm-ivory p-8 md:p-16">
        <div className="max-w-4xl mx-auto text-center">
          <svg
            className="w-12 h-12 text-muted-ochre mx-auto mb-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="font-display text-headline-lg-mobile md:text-headline-lg text-warm-ivory leading-tight mb-8">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <div className="flex flex-col items-center gap-4">
            {testimonial.image && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-muted-ochre">
                <Image
                  src={testimonial.image.url}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-headline text-headline-md text-warm-ivory">{testimonial.name}</div>
              {(testimonial.role || testimonial.organization) && (
                <div className="font-body text-body-md text-surface-variant">
                  {[testimonial.role, testimonial.organization].filter(Boolean).join(' • ')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-surface p-8 h-full flex flex-col">
      <svg
        className="w-8 h-8 text-muted-ochre/40 mb-6"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <blockquote className="font-body text-body-lg text-on-surface mb-8 flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4 pt-6 border-t border-earth-brown/10">
        {testimonial.image ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={testimonial.image.url}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-earth-brown/20 flex items-center justify-center flex-shrink-0">
            <span className="font-headline text-headline-md text-earth-brown">{testimonial.name.charAt(0)}</span>
          </div>
        )}
        <div className="min-w-0">
          <div className="font-headline text-body-lg text-on-surface truncate">{testimonial.name}</div>
          {(testimonial.role || testimonial.organization) && (
            <div className="font-label text-label-sm text-on-surface-variant truncate">
              {[testimonial.role, testimonial.organization].filter(Boolean).join(' • ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
