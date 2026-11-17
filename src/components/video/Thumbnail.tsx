import { useState, useEffect, useRef } from 'react';
import { Film } from 'lucide-react';
import { Grain } from '../ui/Grain';
import { cn } from '../../lib/cn';
import { parseYouTubeId } from '../../lib/youtube';

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
  eager = true,
  className,
  aspectClassName,
}: ThumbnailProps) {
  // Clean / normalize YouTube ID even if raw URL or extra whitespace was passed
  const cleanedId = youtubeId
    ? parseYouTubeId(youtubeId) || (youtubeId.trim().length === 11 ? youtubeId.trim() : null)
    : null;

  // Ordered quality candidates: overrideUrl -> maxres -> hq -> mq -> 0.jpg
  const candidates: string[] = [];
  if (overrideUrl && overrideUrl.trim()) {
    candidates.push(overrideUrl.trim());
  }
  if (cleanedId) {
    candidates.push(`https://i.ytimg.com/vi/${cleanedId}/maxresdefault.jpg`);
    candidates.push(`https://i.ytimg.com/vi/${cleanedId}/hqdefault.jpg`);
    candidates.push(`https://i.ytimg.com/vi/${cleanedId}/mqdefault.jpg`);
    candidates.push(`https://i.ytimg.com/vi/${cleanedId}/0.jpg`);
  }

  const [candidateIdx, setCandidateIdx] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasErrorAll, setHasErrorAll] = useState(candidates.length === 0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when props change
  useEffect(() => {
    setCandidateIdx(0);
    setIsLoaded(false);
    setHasErrorAll(candidates.length === 0);
  }, [youtubeId, overrideUrl]);

  const currentSrc = candidates[candidateIdx];

  const advanceCandidate = () => {
    if (candidateIdx + 1 < candidates.length) {
      setCandidateIdx((prev) => prev + 1);
      setIsLoaded(false);
    } else {
      setHasErrorAll(true);
      setIsLoaded(true);
    }
  };

  const handleError = () => {
    advanceCandidate();
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // YouTube returns a 120x90 placeholder when maxres/hq is missing or placeholder
    if (img.naturalWidth > 0 && img.naturalWidth <= 120) {
      advanceCandidate();
      return;
    }
    setIsLoaded(true);
  };

  // Immediate check for cached images (browser already has them in memory)
  useEffect(() => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    if (img.complete) {
      if (img.naturalWidth > 0 && img.naturalWidth <= 120) {
        advanceCandidate();
      } else if (img.naturalWidth > 120) {
        setIsLoaded(true);
      }
    }
  }, [currentSrc]);

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-surface-2 rounded-card select-none',
        aspectClassName || 'aspect-video',
        className,
      )}
    >
      {/* Background Shimmer placeholder while loading */}
      {!isLoaded && !hasErrorAll && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-surface-3 animate-pulse"
        />
      )}

      {!hasErrorAll && currentSrc ? (
        <img
          ref={imgRef}
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          loading={eager ? 'eager' : 'eager'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-200',
            isLoaded ? 'opacity-100' : 'opacity-90',
          )}
        />
      ) : (
        /* Cinematic Dark Fallback Poster if no valid thumbnail exists */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1c1c22] via-[#121216] to-[#0c0c0e] text-center border border-line">
          <div className="w-12 h-12 rounded-full bg-surface-3 border border-line flex items-center justify-center text-accent mb-3 shadow-[0_0_25px_-5px_rgba(255,77,31,0.3)]">
            <Film className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-sm text-text uppercase tracking-tight line-clamp-1">
            {alt}
          </span>
          <span className="font-mono text-[10px] text-muted uppercase tracking-widest mt-1">
            Henok · Video Story
          </span>
        </div>
      )}

      {/* Film grain + vignette overlay */}
      <Grain />
    </div>
  );
}
