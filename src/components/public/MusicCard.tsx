import Image from 'next/image';
import { Play, ExternalLink } from 'lucide-react';
import type { Music, Album, Media } from '@prisma/client';
import { formatDuration } from '@/lib/utils';

type MusicWithRelations = Music & {
  album?: Album | null;
  artwork?: Media | null;
  audio?: Media | null;
};

type Props = {
  music: MusicWithRelations;
  onPlay?: (music: MusicWithRelations) => void;
};

export function MusicCard({ music, onPlay }: Props) {
  return (
    <div className="group card-surface overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-surface-container-high">
        {music.artwork ? (
          <Image
            src={music.artwork.url}
            alt={music.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-6xl text-on-surface-variant/30">
              {music.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-deep-charcoal/0 group-hover:bg-deep-charcoal/40 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={() => onPlay?.(music)}
            className="w-16 h-16 rounded-full bg-warm-ivory text-deep-charcoal flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-muted-ochre hover:text-white"
            aria-label={`Play ${music.title}`}
          >
            <Play className="w-6 h-6 ml-1" fill="currentColor" />
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-headline text-headline-md text-on-surface leading-tight group-hover:text-muted-ochre transition-colors">
            {music.title}
          </h3>
          {music.platformUrls && Object.keys(music.platformUrls as Record<string, string>).length > 0 && (
            <a
              href={Object.values(music.platformUrls as Record<string, string>)[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-muted-ochre transition-colors flex-shrink-0 mt-1"
              aria-label="Stream on external platform"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-3 font-label text-label-sm text-on-surface-variant uppercase tracking-widest">
          {music.album && <span>{music.album.title}</span>}
          {music.year && (
            <>
              {music.album && <span>•</span>}
              <span>{music.year}</span>
            </>
          )}
          {music.duration && (
            <>
              <span>•</span>
              <span>{formatDuration(music.duration)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
