import { useState } from 'react';
import { embedUrl, thumbnailUrl } from '../../lib/youtube';
import { Grain } from '../ui/Grain';
import { cn } from '../../lib/cn';

export interface YouTubePlayerProps {
  youtubeId: string;
  title: string;
  overrideThumbnailUrl?: string | null;
  aspectClass?: string;
  roundedClass?: string;
  autoPlayOnClick?: boolean;
}

export function YouTubePlayer({
  youtubeId,
  title,
  overrideThumbnailUrl,
  aspectClass = 'aspect-video',
  roundedClass = 'rounded-player',
}: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const thumbSrc =
    overrideThumbnailUrl ||
    thumbnailUrl(youtubeId, useFallback ? 'hqdefault' : 'maxresdefault');

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden border border-line-strong bg-surface',
        aspectClass,
        roundedClass,
      )}
    >
      {isPlaying ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl(youtubeId)}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 w-full h-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {/* Thumbnail */}
          <img
            src={thumbSrc}
            alt={title}
            onError={() => {
              if (!useFallback && !overrideThumbnailUrl) {
                setUseFallback(true);
              }
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />

          {/* Film Grain & Vignette */}
          <Grain />

          {/* Centered Play Button */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-[76px] h-[76px] rounded-full bg-text/95 flex items-center justify-center shadow-2xl transition-transform duration-300 ease-out group-hover:scale-110">
              <span className="w-0 h-0 ml-1 border-t-[11px] border-t-transparent border-b-[11px] border-b-transparent border-l-[18px] border-l-bg" />
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
