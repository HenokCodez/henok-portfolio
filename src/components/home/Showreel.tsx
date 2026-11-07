import { useState } from 'react';
import { siteConfig } from '../../config/site';
import { useSettings } from '../../hooks/useSettings';
import { SectionHeading } from '../ui/SectionHeading';
import { Timeline } from './Timeline';
import { Grain } from '../ui/Grain';
import { Reveal } from '../ui/Reveal';
import { VideoModal } from '../video/VideoModal';
import { thumbnailUrl } from '../../lib/youtube';
import type { Video } from '../../types';

export function Showreel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const { settings } = useSettings();

  const youtubeId = settings?.showreel_youtube_id || siteConfig.showreel.youtubeId;
  const duration = settings?.showreel_duration || siteConfig.showreel.duration;
  const posterUrl = settings?.showreel_poster_url || (siteConfig.showreel as { posterUrl?: string }).posterUrl;

  const thumbSrc = posterUrl || thumbnailUrl(youtubeId, useFallback ? 'hqdefault' : 'maxresdefault');

  const showreelVideo: Video = {
    id: 'showreel',
    slug: 'showreel',
    title: 'Showreel 2026',
    category: 'Commercials',
    youtube_id: youtubeId,
    thumbnail_url: posterUrl || null,
    year: 2026,
    role: 'Editor',
    client: null,
    description: null,
    tools: ['Premiere Pro', 'After Effects'],
    featured: false,
    published: true,
    display_order: 0,
    created_at: new Date().toISOString(),
  };

  return (
    <section className="py-section pt-16 md:pt-20 bg-bg border-t border-line">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            label="[ 02 — Showreel ]"
            title="THE"
            accentWord="reel"
            suffix="— 2026"
            count={duration}
          />
        </Reveal>

        {/* 21:9 Video Player Frame (Single button opening modal; never mounts iframe in page) */}
        <Reveal delay={0.1}>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            aria-label="Play showreel"
            className="group relative block w-full aspect-[16/10] min-[701px]:aspect-[21/9] min-[701px]:max-h-[min(520px,68vh)] rounded-reel overflow-hidden bg-surface-2 border border-line-strong select-none text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {/* Thumbnail Image */}
            <img
              src={thumbSrc}
              alt="Showreel 2026"
              onError={() => {
                if (!useFallback) setUseFallback(true);
              }}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015]"
            />

            {/* Dark Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55))' }}
            />

            {/* Film Grain */}
            <Grain />

            {/* Top-left & Top-right Labels */}
            <div className="absolute top-4 inset-x-5 md:top-5 md:inset-x-6 z-20 flex items-center justify-between font-mono text-[10px] md:text-[11px] tracking-mono uppercase text-white/80 pointer-events-none">
              <span>SHOWREEL_2026</span>
              <span>{duration}</span>
            </div>

            {/* Centered Play Button & Pill 56px below */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="relative flex flex-col items-center">
                {/* 76px Play Button */}
                <div className="w-[76px] h-[76px] rounded-full bg-text flex items-center justify-center shadow-2xl transition-transform duration-300 ease-out group-hover:scale-110">
                  <span className="w-0 h-0 ml-1 border-t-[11px] border-t-transparent border-b-[11px] border-b-transparent border-l-[18px] border-l-bg" />
                </div>

                {/* Small solid pill "Play showreel" (11px, chip on) 56px below it */}
                <div className="absolute top-[calc(100%+56px)] max-[700px]:top-[calc(100%+24px)] whitespace-nowrap h-[26px] px-3.5 inline-flex items-center rounded-full bg-text text-bg font-mono text-[11px] font-semibold uppercase tracking-wider shadow-md">
                  Play showreel
                </div>
              </div>
            </div>
          </button>
        </Reveal>

        {/* Small Decorative Timeline */}
        <Reveal delay={0.2}>
          <Timeline />
        </Reveal>
      </div>

      {/* Video Modal Player */}
      {isModalOpen && (
        <VideoModal
          videos={[showreelVideo]}
          activeSlug="showreel"
          onClose={() => setIsModalOpen(false)}
          onNavigate={() => {}}
        />
      )}
    </section>
  );
}
