// src/components/video/VideoModal.tsx — STARTING POINT. Style it exactly per pages/project-modal.md.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Video } from '../../types';
import { embedUrl, thumbnailUrl } from '../../lib/youtube';

type Props = {
  videos: Video[];            // current (filtered) list
  activeSlug: string | null;  // from ?v=
  onClose: () => void;
  onNavigate: (slug: string) => void; // should use setSearchParams(..., { replace: true })
};

export function VideoModal({ videos, activeSlug, onClose, onNavigate }: Props) {
  const index = videos.findIndex(v => v.slug === activeSlug);
  const video = index >= 0 ? videos[index] : null;
  const [playing, setPlaying] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  const go = (d: number) => {
    if (!videos.length) return;
    onNavigate(videos[(index + d + videos.length) % videos.length].slug);
  };

  // reset player when the video changes
  useEffect(() => { setPlaying(false); }, [activeSlug]);

  // scroll lock + focus management
  useEffect(() => {
    if (!video) return;
    opener.current = document.activeElement;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = prev;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [!!video]); // eslint-disable-line react-hooks/exhaustive-deps

  // keyboard: Esc, arrows, focus trap
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }); // re-bind each render so go() sees fresh index

  const more = video ? [1, 2, 3].map(i => videos[(index + i) % videos.length]).filter(v => v && v.slug !== video.slug) : [];

  return (
    <AnimatePresence>
      {video && (
        <>
          <motion.div key="scrim" className="fixed inset-0 z-[60] bg-[rgba(5,5,6,.82)] backdrop-blur-[18px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={onClose} />
          <motion.div key="panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="modal-title"
            className="fixed left-1/2 top-[70px] z-[70] max-h-[calc(100vh-80px)] w-[calc(100%-24px)] -translate-x-1/2 overflow-y-auto md:top-[60px] md:w-[min(1180px,calc(100%-80px))]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <div className="mb-3 flex items-center justify-end gap-3">
              <span className="label-mono hidden md:inline">ESC to close</span>
              <button ref={closeRef} onClick={onClose} aria-label="Close video"
                className="h-9 rounded-full border border-line-strong px-4 text-[13px] font-semibold">Close ✕</button>
            </div>

            {/* PLAYER — iframe mounts only after click */}
            <div className="relative aspect-video overflow-hidden rounded-player border border-line-strong bg-surface">
              {playing ? (
                <iframe className="absolute inset-0 h-full w-full" src={embedUrl(video.youtube_id)} title={video.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
              ) : (
                <button className="group absolute inset-0 grain" onClick={() => setPlaying(true)} aria-label={`Play ${video.title}`}>
                  <img src={video.thumbnail_url || thumbnailUrl(video.youtube_id)} alt="" className="h-full w-full object-cover"
                    onError={e => { e.currentTarget.src = thumbnailUrl(video.youtube_id, 'hqdefault'); }} />
                  <span className="absolute left-1/2 top-1/2 grid h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-text text-bg">▶</span>
                </button>
              )}
            </div>

            {/* TITLE ROW, META, DESCRIPTION, MORE WORK → build per pages/project-modal.md [5]–[8] */}
            <h2 id="modal-title" className="display mt-7 text-4xl md:text-[56px]">{video.title}</h2>
            <div className="mt-4 flex gap-2">
              <button onClick={() => go(-1)} className="h-9 rounded-full border border-line-strong px-4 text-[13px] font-semibold">← Prev</button>
              <button onClick={() => go(1)} className="h-9 rounded-full border border-line-strong px-4 text-[13px] font-semibold">Next →</button>
            </div>
            {/* TODO: meta strip, description, more work (use `more`) */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
