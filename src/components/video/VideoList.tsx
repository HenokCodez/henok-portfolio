import { useState, useCallback } from 'react';
import type { PointerEvent } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { thumbnailUrl } from '../../lib/youtube';
import { Grain } from '../ui/Grain';
import type { Video } from '../../types';

export interface VideoListProps {
  videos: Video[];
  onSelectVideo?: (slug: string) => void;
}

export function VideoList({ videos, onSelectVideo }: VideoListProps) {
  const [hoveredVideo, setHoveredVideo] = useState<Video | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handlePointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    mouseX.set(e.clientX + 40);
    mouseY.set(e.clientY - 100);
  }, [mouseX, mouseY]);

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setHoveredVideo(null)}
      className="relative w-full select-none divide-y divide-line border-b border-line"
    >
      {videos.map((video, idx) => {
        const num = String(idx + 1).padStart(2, '0');

        return (
          <div
            key={video.id}
            onClick={() => onSelectVideo?.(video.slug)}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') setHoveredVideo(video);
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${video.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectVideo?.(video.slug);
              }
            }}
            className="group relative block py-5 sm:py-[26px] cursor-pointer transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-accent-soft hover:to-transparent"
          >
            {/* Desktop Full Columns / Mobile Compact Layout */}
            <div className="flex items-center justify-between gap-4 md:grid md:grid-cols-[70px_1.6fr_1fr_1fr_80px] md:gap-5 transition-transform duration-300 ease-out group-hover:translate-x-2">
              {/* Mono Number (Desktop) */}
              <span className="hidden md:inline-block font-mono text-xs uppercase tracking-mono text-muted group-hover:text-accent transition-colors">
                {num}
              </span>

              {/* Title */}
              <h3 className="font-display font-extrabold text-lg sm:text-xl md:text-2xl lg:text-[28px] uppercase tracking-[-0.02em] leading-tight text-text group-hover:text-accent transition-colors">
                {video.title}
              </h3>

              {/* Category (Desktop) */}
              <span className="hidden md:inline-block font-mono text-xs uppercase text-muted tracking-wider">
                {video.category}
              </span>

              {/* Client (Desktop) */}
              <span className="hidden md:inline-block font-mono text-xs uppercase text-muted tracking-wider">
                {video.client || '—'}
              </span>

              {/* Year (Both) */}
              <span className="font-mono text-xs tracking-mono uppercase text-muted text-right">
                {video.year || 2025}
              </span>
            </div>
          </div>
        );
      })}

      {/* Floating Preview (Follows Cursor, Desktop Only) */}
      {hoveredVideo && (
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed top-0 left-0 z-50 hidden md:block w-[340px] aspect-video rounded-xl overflow-hidden border border-line-strong shadow-[0_30px_70px_rgba(0,0,0,0.7)] rotate-3 bg-surface"
        >
          <img
            src={hoveredVideo.thumbnail_url || thumbnailUrl(hoveredVideo.youtube_id)}
            alt={hoveredVideo.title}
            className="w-full h-full object-cover"
          />
          <Grain />
        </motion.div>
      )}
    </div>
  );
}
