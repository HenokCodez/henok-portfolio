import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTilt } from '../../hooks/useTilt';
import { Thumbnail } from './Thumbnail';
import { Chip } from '../ui/Chip';
import type { Video } from '../../types';
import { cn } from '../../lib/cn';

export interface VideoCardProps {
  video: Video;
  indexStr?: string; // e.g. "01 / 09"
  eager?: boolean;
  className?: string;
  aspectClassName?: string;
  onClick?: () => void;
}

export function VideoCard({
  video,
  indexStr,
  eager = false,
  className,
  aspectClassName,
  onClick,
}: VideoCardProps) {
  const tilt = useTilt(5);
  const prefersReduced = useReducedMotion();

  const cardContent = (
    <motion.div
      style={prefersReduced ? undefined : tilt.style}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      whileHover={prefersReduced ? undefined : { scale: 1.015 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative w-full rounded-card overflow-hidden bg-surface-2 border border-line cursor-pointer select-none transition-[box-shadow,border-color] duration-300 hover:border-accent hover:shadow-[0_0_0_1.5px_var(--accent),0_30px_60px_-20px_var(--accent-glow)]',
        aspectClassName || 'aspect-video',
        className,
      )}
    >
      {/* Background Thumbnail */}
      <Thumbnail
        youtubeId={video.youtube_id}
        overrideUrl={video.thumbnail_url}
        alt={video.title}
        eager={eager}
        aspectClassName={aspectClassName || 'aspect-video'}
        className="h-full w-full"
      />

      {/* Top Metadata */}
      <div className="absolute top-4 inset-x-[18px] z-20 flex items-center justify-between pointer-events-none font-mono text-[10px] tracking-[0.12em] uppercase text-white/75">
        <span>{indexStr || '01 / 09'}</span>
        <span>{video.year || 2025}</span>
      </div>

      {/* Center Play Button (Reveals on Hover) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[76px] h-[76px] rounded-full bg-text/95 flex items-center justify-center shadow-2xl opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out">
          <span className="w-0 h-0 ml-1 border-t-[11px] border-t-transparent border-b-[11px] border-b-transparent border-l-[18px] border-l-bg" />
        </div>
      </div>

      {/* Bottom Metadata Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-5 pt-12 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
        <div className="mb-2">
          <Chip size="sm">{video.category}</Chip>
        </div>
        <h3 className="font-display text-[22px] md:text-[22px] font-bold text-text tracking-[-0.02em] leading-tight line-clamp-1">
          {video.title}
        </h3>
      </div>
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Watch ${video.title}`}
        className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent rounded-card"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link
      to={`/work?v=${video.slug}`}
      aria-label={`Watch ${video.title}`}
      className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent rounded-card"
    >
      {cardContent}
    </Link>
  );
}
