import Link from 'next/link';

export const metadata = { title: 'Page Not Found' };

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface pt-32 pb-16 px-5">
      <div className="text-center max-w-md">
        <div className="font-display text-[120px] md:text-[180px] leading-none text-earth-brown/20 tracking-tighter">
          404
        </div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4 -mt-6">
          Page Not Found
        </div>
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight leading-tight mb-6">
          This song has ended, but the music plays on.
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mb-10">
          The page you are looking for might have been moved, renamed, or might never have
          existed. Let us get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Back Home
          </Link>
          <Link href="/contact" className="btn-outline text-primary">
            Report a Broken Link
          </Link>
        </div>
      </div>
    </div>
  );
}
