import Link from 'next/link';

export const metadata = { title: 'Page Builder' };

export default function AdminBuilderIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Website • Page Builder
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Page Builder
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Every page is a stack of sections. Choose a page below to start editing, or create a new one.
        </p>
      </div>

      <div className="card-surface p-10 md:p-16 text-center border-2 border-dashed border-earth-brown/20">
        <div className="font-headline text-headline-md text-on-surface mb-3">
          Open a page to begin building
        </div>
        <p className="font-body text-body-md text-on-surface-variant max-w-xl mx-auto mb-6">
          Use the Pages list to pick a page and open its builder, or create a brand new page.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/admin/pages"
            className="px-6 py-3 bg-deep-charcoal text-warm-ivory font-label text-label-sm uppercase tracking-widest rounded hover:bg-muted-ochre transition-colors"
          >
            Browse Pages
          </Link>
          <Link
            href="/admin/pages/new"
            className="px-6 py-3 border border-earth-brown/20 text-on-surface-variant hover:text-on-surface hover:border-earth-brown/40 font-label text-label-sm uppercase tracking-widest rounded transition-colors"
          >
            + Create New Page
          </Link>
        </div>
      </div>
    </div>
  );
}
