import { prisma } from '@/lib/db';
import { groupSiteImageSlots } from '@/lib/site-image-slots';
import SiteImageForm from '@/components/admin/SiteImageForm';

export const metadata = { title: 'Site images' };

export default async function AdminSiteImagesPage() {
  const saved = await prisma.siteImage.findMany();
  const savedByKey = new Map(saved.map((row) => [row.key, row]));
  const groups = groupSiteImageSlots();

  return (
    <div className="space-y-10">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Website • Appearance
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Site images
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-3xl">
          Every picture inside the built-in page layouts, grouped by page. Point any of them at a
          photo from the library or any URL, remove one to leave the section without a picture, or
          reset it to the photograph the layout ships with. Hero backgrounds are separate, under
          Hero backgrounds. Photographs added to the Media Library can also be dropped into any
          section from the Page Builder.
        </p>
      </div>

      {groups.map((group) => (
        <section key={group.pageSlug} className="space-y-4">
          <div className="border-b border-earth-brown/15 pb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-headline-md text-on-surface">{group.pageTitle}</h2>
            <span className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
              /{group.pageSlug === 'home' ? '' : group.pageSlug}
            </span>
          </div>

          <div className="space-y-4">
            {group.slots.map((slot) => {
              const row = savedByKey.get(slot.key);
              return (
                <SiteImageForm
                  key={slot.key}
                  imageKey={slot.key}
                  label={slot.label}
                  defaultUrl={slot.defaultUrl}
                  hasSavedRow={Boolean(row)}
                  initial={{ url: row?.url || '', altText: row?.altText || '' }}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
