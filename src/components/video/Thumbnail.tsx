import { useState } from 'react';
import { thumbnailUrl } from '../../lib/youtube';
import { Grain } from '../ui/Grain';
import { cn } from '../../lib/cn';

export interface ThumbnailProps {
  youtubeId: string;
  overrideUrl?: string | null;
  alt: string;
  eager?: boolean;
  className?: string;
  aspectClassName?: string;
}

export function Thumbnail({
  youtubeId,
  overrideUrl,
  alt,
  eager = false,
  className,
  aspectClassName,
}: ThumbnailProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const src = overrideUrl || thumbnailUrl(youtubeId, useFallback ? 'hqdefault' : 'maxresdefault');

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-surface-2 rounded-card select-none',
        aspectClassName || 'aspect-video',
        className,
      )}
    >
      {/* Shimmer skeleton placeholder */}
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-surface-3 animate-pulse"
        />
      )}

      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!useFallback && !overrideUrl) {
            setUseFallback(true);
          }
        }}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Film grain + vignette overlay */}
      <Grain />
    </div>
  );
}
