import { prisma } from '@/lib/db';
import { SITE_PAGES } from '@/lib/site-pages';
import HeroBackgroundForm from '@/components/admin/HeroBackgroundForm';

export const metadata = { title: 'Hero backgrounds' };

type HeroPage = {
  slug: string;
  path: string;
  title: string;
  defaultHeroImage?: string;
};

export default async function AdminHeroesPage() {
  const saved = await prisma.heroBackground.findMany();
  const savedBySlug = new Map(saved.map((row) => [row.pageSlug, row]));

  const pages: HeroPage[] = [
    { slug: 'home', path: '/', title: 'Homepage', defaultHeroImage: '/OKema/Pic1.jpeg' },
    ...SITE_PAGES.map((p) => ({
      slug: p.slug,
      path: p.path,
      title: p.title,
      defaultHeroImage: p.defaultHeroImage,
    })),
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Website • Appearance
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Hero backgrounds
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-3xl">
          Pick a page and set the image or video that sits behind its main heading. A video takes
          priority and loops silently; the image is used as its poster frame. Use Remove background
          to leave a hero plain, or Reset to layout default to go back to the image the design
          ships with. Upload new files in the Media Library first.
        </p>
      </div>

      <div className="space-y-6">
        {pages.map((page) => {
          const row = savedBySlug.get(page.slug);
          return (
            <HeroBackgroundForm
              key={page.slug}
              pageSlug={page.slug}
              pageTitle={page.title}
              pagePath={page.path}
              defaultImage={page.defaultHeroImage}
              hasSavedRow={Boolean(row)}
              initial={{
                imageUrl: row?.imageUrl || '',
                videoUrl: row?.videoUrl || '',
                overlay: row?.overlay ?? 50,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
