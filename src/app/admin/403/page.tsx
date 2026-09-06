import Link from 'next/link';

export const metadata = { title: 'Access Denied' };

export default function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-5">
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
          403 • Forbidden
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight leading-tight mb-6">
          You do not have permission to view this page.
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mb-10">
          Your account does not have the required role. Please contact a super administrator if
          you believe this is a mistake.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/admin" className="btn-primary !py-3">
            Back to Dashboard
          </Link>
          <Link href="/" className="btn-outline text-primary !py-3">
            Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
