/**
 * Helpers for background and embedded media.
 */

/**
 * Turns a YouTube, Vimeo or already-embedded link into a URL that can sit in an
 * iframe. Returns null for plain video files (mp4/webm) so they can use the
 * native player instead.
 */
export function toEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const value = String(url).trim();

  const youtube = value.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}?rel=0`;

  const vimeo = value.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  if (
    /^https?:\/\/(www\.)?(youtube\.com\/embed\/|player\.vimeo\.com|player\.twitch\.tv)/.test(value)
  ) {
    return value;
  }

  return null;
}

export type MediaKind = 'iframe' | 'video' | 'none';

/** Classifies a URL as an embeddable link, a video file, or nothing usable. */
export function resolveMedia(url?: string | null): { kind: MediaKind; src: string } {
  const embed = toEmbedUrl(url);
  if (embed) return { kind: 'iframe', src: embed };

  const value = (url || '').trim();
  if (value && /^(https?:)?\/\//.test(value)) return { kind: 'video', src: value };
  if (value && value.startsWith('/')) return { kind: 'video', src: value };

  return { kind: 'none', src: '' };
}

/**
 * Same as resolveMedia, but for muted looping playback behind hero text:
 * autoplay, no controls, no chrome.
 */
export function resolveBackgroundMedia(url?: string | null): { kind: MediaKind; src: string } {
  const media = resolveMedia(url);
  if (media.kind !== 'iframe') return media;

  const isYouTube = media.src.includes('youtube.com/embed');
  const id = media.src.match(/embed\/([^?]+)/)?.[1] || '';
  const joiner = media.src.includes('?') ? '&' : '?';

  const src = isYouTube
    ? `${media.src}${joiner}autoplay=1&mute=1&loop=1&controls=0&playsinline=1&modestbranding=1${
        id ? `&playlist=${id}` : ''
      }`
    : `${media.src}${joiner}autoplay=1&muted=1&loop=1&background=1`;

  return { kind: 'iframe', src };
}
