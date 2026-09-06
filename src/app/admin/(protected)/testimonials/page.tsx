import { prisma } from '@/lib/db';
import TestimonialsManager from '@/components/admin/TestimonialsManager';

export const metadata = { title: 'Testimonials' };

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Engagement • Testimonials
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Testimonials</h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Create, feature, reorder and manage testimonials from clients, teachers and audience members.
        </p>
      </div>
      <TestimonialsManager testimonials={testimonials as any} />
    </div>
  );
}
