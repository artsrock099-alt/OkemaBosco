import CreatePageForm from '@/components/admin/CreatePageForm';

export const metadata = { title: 'Create New Page' };

export default function AdminCreatePagePage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Website • Pages
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Create New Page
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Every page on the site is composed using the Page Builder — stack sections of any type, in any order.
        </p>
      </div>
      <CreatePageForm />
    </div>
  );
}
