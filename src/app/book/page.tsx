import type { Metadata } from 'next';
import BookingForm from '@/components/public/BookingForm';

export const metadata: Metadata = {
  title: 'Book Bosco',
  description:
    'Book Bosco Okema for live performances, school residencies, elderly visits, cultural presentations, workshops, festivals and private events.',
};

export default function BookPage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-surface-container">
        <div className="container-x text-center max-w-3xl">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
            BOOK BOSCO
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight leading-tight mb-6">
            Start the conversation.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Bring an engaging musician and cultural educator to your next event. Fill out the
            details below and I will respond with availability, format options and tailored pricing.
          </p>
        </div>
      </section>
      <section className="pb-section-gap">
        <div className="container-x max-w-4xl">
          <div className="card-surface p-6 md:p-10 lg:p-16">
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}
