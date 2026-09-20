import { getHeroBackground } from '@/lib/heroes';
import { resolveBackgroundMedia } from '@/lib/media';

type Props = {
  /** Built-in page slug, e.g. "events" or "media/photos". */
  slug: string;
  /** Background the layout ships with, used when nothing is set in the admin. */
  defaultImage?: string;
  /** 0 = full brightness, 100 = almost black. */
  defaultOverlay?: number;
  gradient?: string;
};

/**
 * Background layer for a page hero. The admin can set an image or a video for
 * any page (Admin -> Hero backgrounds); clearing both removes the background
 * from that page.
 */
export default async function HeroMedia({
  slug,
  defaultImage,
  defaultOverlay = 50,
  gradient = 'from-deep-charcoal via-deep-charcoal/60 to-deep-charcoal/25',
}: Props) {
  const saved = await getHeroBackground(slug);

  // A saved row means the admin has taken control of this hero: whatever is in
  // it wins, including "nothing at all".
  const videoUrl = saved ? saved.videoUrl || '' : '';
  const imageUrl = saved ? saved.imageUrl || '' : defaultImage || '';
  const overlay = saved?.overlay ?? defaultOverlay;

  const background = resolveBackgroundMedia(videoUrl);

  if (background.kind === 'none' && !imageUrl) return null;

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {background.kind === 'iframe' ? (
        <iframe
          src={background.src}
          title=""
          tabIndex={-1}
          className="pointer-events-none absolute top-1/2 left-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2"
          style={{ opacity: overlay / 100 }}
          allow="autoplay; encrypted-media"
        />
      ) : background.kind === 'video' ? (
        <video
          src={background.src}
          poster={imageUrl || defaultImage || undefined}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ opacity: overlay / 100 }}
        />
      ) : (
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: overlay / 100 }}
        />
      )}
      <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
    </div>
  );
}
