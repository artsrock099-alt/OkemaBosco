/**
 * One-off maintenance script.
 *
 * 1. Registers every photograph in public/OKema as a Media record so it shows
 *    up in Admin -> Media -> Photos and can be dropped into any section.
 * 2. Points the homepage CMS sections at the real photographs instead of the
 *    stock images the original seed used.
 *
 * Safe to re-run: existing Media rows are matched on url and left alone.
 *
 *   npx tsx scripts/sync-photo-library.ts
 */
import { PrismaClient } from '@prisma/client';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const prisma = new PrismaClient();

const PHOTO_DIR = join(process.cwd(), 'public', 'OKema');
const INSTRUMENT_PHOTO = /^pic(?:5|6|7|8|9|10|11)\.png$/i;
const IMAGE_FILE = /\.(jpe?g|png)$/i;

/** Read the pixel size straight from the file header (PNG or JPEG). */
function readImageSize(buffer: Buffer): { width: number; height: number } | null {
  // PNG: IHDR width/height are the two big-endian uint32s at byte 16.
  if (buffer.length > 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  // JPEG: walk the markers until a start-of-frame segment, which carries the size.
  if (buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      const isStartOfFrame =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isStartOfFrame) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }
      const segmentLength = buffer.readUInt16BE(offset + 2);
      if (segmentLength < 2) return null;
      offset += 2 + segmentLength;
    }
  }

  return null;
}

function sizeOf(filename: string) {
  try {
    return readImageSize(readFileSync(join(PHOTO_DIR, filename)));
  } catch {
    return null;
  }
}

const TITLES: Record<string, string> = {
  'AboutOkema.jpg': 'Portrait of Bosco Okema with his instrument',
  'pic4.jpeg': 'Bosco Okema with his instruments',
  'Pic1.jpeg': 'Bosco Okema performing live',
  'pic2.jpeg': 'Bosco Okema holding a traditional Adungu instrument',
  'pic3.jpeg': 'Bosco Okema on stage',
  'culturePerformance.JPG': 'Bosco Okema in cultural performance',
  'liveperformance1.JPG': 'Bosco Okema performing live',
  'liveperformance2.JPG': 'Bosco Okema performing with his band',
  'schoolresidency1.jpeg': 'Music session in a school hall',
  'schoolresidency2.jpg': 'Children learning traditional music',
  'schoolresidency3.jpg': 'Students learning the instruments',
  'schoolresidency4.jpeg': 'Classroom music workshop',
  'schoolresidency5.jpeg': 'Students taking part in a music workshop',
  'schoolresidency6.jpeg': 'Hands-on instrument session with students',
  'schoolresidency7.jpeg': 'Bosco Okema leading a school workshop',
  'schoolresidency8.jpeg': 'Students gathered around traditional instruments',
  'schoolresidency9.jpeg': 'Students joining in with percussion',
  'schoolresidency10.jpeg': 'A whole class taking part',
  'schoolresidency12.jpeg': 'A student trying a traditional instrument',
  'schoolresidency13.jpeg': 'Classroom music session in progress',
  'schoolresidency14.jpeg': 'Students singing together during a residency',
  'schoolresidency15.jpeg': 'Residency workshop in a school',
  'PrimRoseElders4.jpeg': 'Residents sharing a musical moment',
  'PrimRoseElders6.jpeg': 'Residents enjoying a live music visit',
  'PrimRoseElders9.jpeg': 'Elderly residents clapping along',
  'ElderFlower1.jpeg': 'Bosco Okema playing music for residents',
};

function titleFor(filename: string) {
  return TITLES[filename] || filename.replace(/\.[a-z]+$/i, '').replace(/[-_]+/g, ' ');
}

async function syncMediaLibrary() {
  const files = readdirSync(PHOTO_DIR)
    .filter((name) => IMAGE_FILE.test(name))
    .sort();

  let created = 0;
  let measured = 0;
  for (const filename of files) {
    const url = `/OKema/${filename}`;
    if (INSTRUMENT_PHOTO.test(filename)) continue;
    const size = sizeOf(filename);
    const existing = await prisma.media.findFirst({ where: { url } });

    if (existing) {
      // Keep the recorded pixel size up to date so pages can lay the photo out
      // in a frame that matches its real shape.
      if (size && (existing.width !== size.width || existing.height !== size.height)) {
        await prisma.media.update({
          where: { id: existing.id },
          data: { width: size.width, height: size.height },
        });
        measured += 1;
      }
      continue;
    }

    const title = titleFor(filename);
    await prisma.media.create({
      data: {
        type: 'IMAGE',
        title,
        filename,
        url,
        mimeType: /\.png$/i.test(filename) ? 'image/png' : 'image/jpeg',
        size: 0,
        width: size?.width ?? null,
        height: size?.height ?? null,
        altText: title,
      },
    });
    created += 1;
  }
  console.log(
    `Media library: ${created} photo(s) added, ${measured} size(s) recorded, ${files.length} file(s) on disk.`
  );
}

async function assignPressAndArticlePhotos() {
  const mediaByUrl = new Map(
    (await prisma.media.findMany({ where: { type: 'IMAGE' } })).map((m) => [m.url, m.id])
  );

  const pressWanted = ['/OKema/IMG_4864.JPG', '/OKema/culturePerformance.JPG', '/OKema/schoolresidency9.jpeg'];
  const pressItems = await prisma.press.findMany({ orderBy: { date: 'desc' } });
  let pressTouched = 0;
  for (const [i, item] of pressItems.entries()) {
    if (item.imageId) continue;
    const id = mediaByUrl.get(pressWanted[i % pressWanted.length]);
    if (!id) continue;
    await prisma.press.update({ where: { id: item.id }, data: { imageId: id } });
    pressTouched += 1;
  }

  const articleWanted: Record<string, string> = {
    'the-story-of-the-adungu': '/OKema/pic5.png',
    'music-in-the-classroom': '/OKema/schoolresidency6.jpeg',
    'why-i-play-for-seniors': '/OKema/PrimRoseElders6.jpeg',
  };
  const articleFallback = ['/OKema/pic4.jpeg', '/OKema/schoolresidency8.jpeg', '/OKema/PrimRoseElders4.jpeg'];
  const articles = await prisma.article.findMany({ orderBy: { createdAt: 'asc' } });
  let articleTouched = 0;
  for (const [i, article] of articles.entries()) {
    if (article.featuredImageId) continue;
    const wanted = articleWanted[article.slug] || articleFallback[i % articleFallback.length];
    const id = mediaByUrl.get(wanted);
    if (!id) continue;
    await prisma.article.update({ where: { id: article.id }, data: { featuredImageId: id } });
    articleTouched += 1;
  }

  console.log(`Press items: ${pressTouched} given a photo. Articles: ${articleTouched} given a photo.`);
}

async function fixHomepageImages() {
  const home = await prisma.page.findUnique({
    where: { slug: 'home' },
    include: { sections: true },
  });
  if (!home) {
    console.log('Homepage page record not found, skipping.');
    return;
  }

  let touched = 0;
  for (const section of home.sections) {
    const content = (section.content || {}) as Record<string, any>;
    const next = { ...content };
    let changed = false;

    if (section.type === 'HERO' && next.image !== '/OKema/Pic1.jpeg') {
      next.image = '/OKema/Pic1.jpeg';
      changed = true;
    }
    if (section.type === 'IMAGE_TEXT' && next.image !== '/OKema/pic4.jpeg') {
      next.image = '/OKema/pic4.jpeg';
      changed = true;
    }
    if (section.type === 'FEATURED_VIDEO' && next.thumbnail !== '/OKema/IMG_4864.JPG') {
      next.thumbnail = '/OKema/IMG_4864.JPG';
      changed = true;
    }
    if (section.type === 'SERVICES' && Array.isArray(next.items)) {
      const wanted: Record<string, string> = {
        '/live-performance': '/OKema/pic3.jpeg',
        '/education/school-residency': '/OKema/schoolresidency3.jpg',
        '/education/elderly-visits': '/OKema/ElderFlower1.jpeg',
      };
      next.items = next.items.map((item: any) => {
        const target = wanted[item?.href];
        if (target && item.image !== target) {
          changed = true;
          return { ...item, image: target };
        }
        return item;
      });
    }

    if (!changed) continue;
    await prisma.pageSection.update({ where: { id: section.id }, data: { content: next } });
    touched += 1;
  }
  console.log(`Homepage sections: ${touched} updated.`);
}

async function main() {
  await syncMediaLibrary();
  await fixHomepageImages();
  await assignPressAndArticlePhotos();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
