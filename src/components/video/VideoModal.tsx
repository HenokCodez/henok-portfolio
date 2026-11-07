import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { embedUrl, thumbnailUrl } from '../../lib/youtube';
import { Chip } from '../ui/Chip';
import { Grain } from '../ui/Grain';
import type { Video } from '../../types';

export interface VideoModalProps {
  videos: Video[];
  activeSlug: string | null;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

export function VideoModal({
  videos,
  activeSlug,
  onClose,
  onNavigate,
}: VideoModalProps) {
  const index = videos.findIndex((v) => v.slug === activeSlug);
  const video = index >= 0 ? videos[index] : null;
  const isShowreel = video?.id === 'showreel' || video?.slug === 'showreel';

  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbFallback, setThumbFallback] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);

  // Reset player when video slug changes
  useEffect(() => {
    setIsPlaying(false);
    setThumbFallback(false);
  }, [activeSlug]);

  const go = (delta: number) => {
    if (!videos.length || index < 0) return;
    const nextIndex = (index + delta + videos.length) % videos.length;
    onNavigate(videos[nextIndex].slug);
  };

  // Scroll lock and focus management
  useEffect(() => {
    if (!video) return;
    openerRef.current = document.activeElement;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.documentElement.style.overflow = prevOverflow;
      (openerRef.current as HTMLElement | null)?.focus?.();
    };
  }, [video]);

  // Keyboard navigation & focus trap
  useEffect(() => {
    if (!video) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        go(1);
      } else if (e.key === 'ArrowLeft') {
        go(-1);
      } else if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), iframe, input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Calculate next 3 videos for "More work"
  const moreWork = video
    ? [1, 2, 3]
        .map((offset) => videos[(index + offset) % videos.length])
        .filter((v) => v && v.slug !== video.slug)
    : [];

  return (
    <AnimatePresence>
      {video && (
        <>
          {/* [1] Scrim with Backdrop Blur */}
          <motion.div
            key="scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[rgba(5,5,6,0.82)] backdrop-blur-[18px]"
          />

          {/* [2] Centered Modal Panel */}
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-video-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[60px] md:top-[60px] -translate-x-1/2 z-[70] w-[calc(100%-24px)] md:w-[min(1180px,calc(100%-80px))] max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar pb-12"
          >
            {/* [3] Close Bar */}
            <div className="mb-3 flex items-center justify-end gap-3 select-none">
              <span className="font-mono text-[11px] uppercase tracking-mono text-muted hidden md:inline">
                ESC to close
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close video"
                className="h-9 px-4 rounded-full border border-line-strong text-[13px] font-semibold text-text hover:bg-surface-2 hover:border-line-strong transition-colors"
              >
                Close ✕
              </button>
            </div>

            {/* [4] YouTube Player Container */}
            <div className="relative aspect-video w-full rounded-player overflow-hidden border border-line-strong bg-surface select-none">
              {isPlaying ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={embedUrl(video.youtube_id)}
                  title={video.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  aria-label={`Play ${video.title}`}
                  className="group absolute inset-0 w-full h-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <img
                    src={
                      video.thumbnail_url ||
                      thumbnailUrl(video.youtube_id, thumbFallback ? 'hqdefault' : 'maxresdefault')
                    }
                    alt={video.title}
                    onError={() => setThumbFallback(true)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
                  />
                  <Grain />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[76px] h-[76px] rounded-full bg-text flex items-center justify-center shadow-2xl transition-transform duration-300 ease-out group-hover:scale-110">
                      <span className="w-0 h-0 ml-1 border-t-[11px] border-t-transparent border-b-[11px] border-b-transparent border-l-[18px] border-l-bg" />
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* [5] Title Row & Prev/Next Controls */}
            <div className="mt-7 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                {!isShowreel && (
                  <Chip variant="acc" size="sm" className="mb-3.5">
                    {video.category}
                  </Chip>
                )}
                <h2
                  id="modal-video-title"
                  className="font-display font-extrabold uppercase tracking-tight text-3xl sm:text-4xl md:text-[56px] leading-tight text-text"
                >
                  {video.title}
                </h2>
              </div>

              {!isShowreel && (
                <div className="flex items-center gap-2.5 self-start sm:self-end shrink-0">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="h-9 px-4 rounded-full border border-line-strong text-[13px] font-semibold text-text hover:bg-surface-2 transition-colors"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="h-9 px-4 rounded-full border border-line-strong text-[13px] font-semibold text-text hover:bg-surface-2 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            {/* [6] Meta Strip */}
            {!isShowreel && (
              <div className="my-7 py-6 border-y border-line grid grid-cols-2 sm:grid-cols-4 gap-6 select-none">
                {video.client && (
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-mono text-faint mb-1">
                      Client
                    </span>
                    <span className="font-display font-semibold text-[15px] text-text">
                      {video.client}
                    </span>
                  </div>
                )}
                {video.year && (
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-mono text-faint mb-1">
                      Year
                    </span>
                    <span className="font-display font-semibold text-[15px] text-text">
                      {video.year}
                    </span>
                  </div>
                )}
                {video.role && (
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-mono text-faint mb-1">
                      Role
                    </span>
                    <span className="font-display font-semibold text-[15px] text-text">
                      {video.role}
                    </span>
                  </div>
                )}
                {video.tools && video.tools.length > 0 && (
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-mono text-faint mb-1">
                      Tools
                    </span>
                    <span className="font-display font-semibold text-[15px] text-text">
                      {video.tools.join(' · ')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* [7] Description */}
            {!isShowreel && video.description && (
              <p className="text-muted text-base md:text-[17px] leading-relaxed max-w-[760px]">
                {video.description}
              </p>
            )}

            {/* [8] More Work */}
            {!isShowreel && moreWork.length > 0 && (
              <div className="mt-9 select-none">
                <p className="font-mono text-[11px] uppercase tracking-mono text-muted mb-3.5">
                  More work
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {moreWork.map((other) => (
                    <div
                      key={other.id}
                      onClick={() => onNavigate(other.slug)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && onNavigate(other.slug)}
                      className="group p-2.5 sm:p-3.5 rounded-[14px] bg-surface border border-line hover:border-line-strong flex items-center gap-3.5 cursor-pointer transition-colors"
                    >
                      <div className="w-[104px] aspect-video rounded-lg overflow-hidden shrink-0 relative bg-surface-2">
                        <img
                          src={
                            other.thumbnail_url ||
                            thumbnailUrl(other.youtube_id, 'hqdefault')
                          }
                          alt={other.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <Grain />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-display font-semibold text-sm text-text truncate group-hover:text-accent transition-colors">
                          {other.title}
                        </h4>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-muted">
                          {other.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
