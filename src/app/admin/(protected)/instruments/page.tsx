import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const metadata = { title: 'Instruments' };

/**
 * Instruments power the "Sounds of Uganda" section on the homepage and the
 * Instrument Gallery page, so they are edited here.
 */
async function saveInstrument(formData: FormData) {
  'use server';

  const id = String(formData.get('id') || '');
  const name = String(formData.get('name') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const imageId = String(formData.get('imageId') || '');
  const order = Number(formData.get('order') || 0);
  const isVisible = formData.get('isVisible') === 'on';

  if (!name) return;

  const data = {
    name,
    description: description || null,
    imageId: imageId || null,
    order,
    isVisible,
  };

  if (id) {
    await prisma.instrument.update({ where: { id }, data });
  } else {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await prisma.instrument.create({ data: { ...data, slug } });
  }

  revalidatePath('/admin/instruments');
  revalidatePath('/');
  revalidatePath('/media/instruments');
}

async function deleteInstrument(formData: FormData) {
  'use server';
  const id = String(formData.get('id') || '');
  if (!id) return;
  await prisma.instrument.delete({ where: { id } });
  revalidatePath('/admin/instruments');
  revalidatePath('/');
}

export default async function AdminInstrumentsPage() {
  const [instruments, images] = await Promise.all([
    prisma.instrument.findMany({ include: { image: true }, orderBy: { order: 'asc' } }),
    prisma.media.findMany({
      where: { type: 'IMAGE' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ]);

  const imageField = (defaultValue?: string | null) => (
    <select name="imageId" defaultValue={defaultValue || ''} className="input-field appearance-none">
      <option value="">No image</option>
      {images.map((img) => (
        <option key={img.id} value={img.id}>
          {img.title} — {img.url}
        </option>
      ))}
    </select>
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Website • Content
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Instruments</h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-3xl">
          These entries fill the “Sounds of Uganda” section on the homepage. Write a full
          description for each instrument and pick one of your uploaded photos. New photos can be
          added from the Media Library first.
        </p>
      </div>

      <div className="card-surface p-6 border-2 border-muted-ochre/20">
        <h2 className="font-headline text-headline-md text-on-surface mb-5">Add an instrument</h2>
        <form action={saveInstrument} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          <div className="md:col-span-4">
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Name
            </label>
            <input name="name" type="text" className="input-field" placeholder="Adungu" />
          </div>
          <div className="md:col-span-4">
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Photo
            </label>
            {imageField()}
          </div>
          <div className="md:col-span-1">
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Order
            </label>
            <input name="order" type="number" defaultValue={instruments.length} className="input-field" />
          </div>
          <div className="md:col-span-3">
            <button type="submit" className="btn-primary w-full !px-6">
              Add instrument
            </button>
          </div>
          <div className="md:col-span-12">
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="input-field resize-y"
              placeholder="A nine-string bow harp and the instrument Bosco grew up with..."
            />
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {instruments.length === 0 && (
          <p className="card-surface p-10 text-center font-body text-body-md text-on-surface-variant">
            No instruments yet. Add the first one above.
          </p>
        )}

        {instruments.map((instrument) => (
          <form
            key={instrument.id}
            action={saveInstrument}
            className="card-surface p-6 grid grid-cols-1 md:grid-cols-12 gap-5"
          >
            <input type="hidden" name="id" value={instrument.id} />

            <div className="md:col-span-3">
              <div className="aspect-[4/3] bg-surface-container overflow-hidden mb-3">
                {instrument.image ? (
                  <img
                    src={instrument.image.url}
                    alt={instrument.image.altText || instrument.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
                    No image
                  </div>
                )}
              </div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Photo
              </label>
              {imageField(instrument.imageId)}
            </div>

            <div className="md:col-span-9 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7">
                  <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                    Name
                  </label>
                  <input name="name" type="text" defaultValue={instrument.name} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                    Order
                  </label>
                  <input name="order" type="number" defaultValue={instrument.order} className="input-field" />
                </div>
                <div className="md:col-span-3 flex items-end gap-3 pb-3">
                  <input
                    id={`visible-${instrument.id}`}
                    name="isVisible"
                    type="checkbox"
                    defaultChecked={instrument.isVisible}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`visible-${instrument.id}`} className="font-body text-body-md text-on-surface">
                    Show on site
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={instrument.description || ''}
                  className="input-field resize-y"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" className="btn-primary !px-8">
                  Save
                </button>
                <span className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
                  /{instrument.slug}
                </span>
              </div>
            </div>
          </form>
        ))}

        {instruments.length > 0 && (
          <div className="card-surface p-6">
            <h3 className="font-headline text-headline-md text-on-surface mb-4">Remove an instrument</h3>
            <div className="flex flex-wrap gap-3">
              {instruments.map((instrument) => (
                <form key={instrument.id} action={deleteInstrument}>
                  <input type="hidden" name="id" value={instrument.id} />
                  <button
                    type="submit"
                    className="px-4 py-2 border border-earth-brown/20 hover:border-error hover:text-error font-label text-label-sm uppercase tracking-widest rounded transition-colors"
                  >
                    Delete {instrument.name}
                  </button>
                </form>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
