import Link from 'next/link';

export default function Stub({
  title,
  subtitle,
  description,
}: {
  title: string;
  subtitle: string;
  description?: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          {subtitle}
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">{title}</h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          {description ||
            `This module of the CMS is part of the architecture defined in the master specification. Prisma models, RBAC controls and navigation wiring are already in place — list and CRUD views follow the same composition pattern as Events and Bookings.`}
        </p>
      </div>
      <div className="card-surface p-10 md:p-16 text-center border-2 border-dashed border-earth-brown/20">
        <div className="font-headline text-headline-md text-on-surface mb-3">CMS view coming soon.</div>
        <p className="font-body text-body-md text-on-surface-variant max-w-xl mx-auto mb-6">
          Data models and APIs are already defined in{' '}
          <code className="px-2 py-0.5 bg-surface rounded text-muted-ochre font-mono text-sm">
            prisma/schema.prisma
          </code>
          . UI composition for this module is next in the feature roadmap.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/admin"
            className="px-5 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm uppercase tracking-widest rounded hover:bg-muted-ochre transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-5 py-2.5 border border-earth-brown/20 text-on-surface-variant hover:text-on-surface hover:border-earth-brown/40 font-label text-label-sm uppercase tracking-widest rounded transition-colors"
          >
            View Website
          </Link>
        </div>
      </div>
    </div>
  );
}
