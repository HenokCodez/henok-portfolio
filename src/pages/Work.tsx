import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVideos } from '../hooks/useVideos';
import { usePageMeta } from '../hooks/usePageMeta';
import { SectionLabel } from '../components/ui/SectionLabel';
import { FilterBar } from '../components/video/FilterBar';
import { ViewToggle, type ViewMode } from '../components/video/ViewToggle';
import { VideoGrid } from '../components/video/VideoGrid';
import { VideoList } from '../components/video/VideoList';
import { CTASection } from '../components/home/CTASection';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { VideoModal } from '../components/video/VideoModal';
import type { Category } from '../types';

export default function Work() {
  usePageMeta(
    'Work — Henok',
    'Explore commercial, documentary, shorts and creator video projects edited by Henok.',
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const rawCat = searchParams.get('cat') as Category | null;
  const activeCategory: Category | 'All' = rawCat || 'All';

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem('view') as ViewMode | null;
      if (saved === 'grid' || saved === 'list') return saved;
    } catch {
      // ignore
    }
    return 'grid';
  });

  function handleViewChange(mode: ViewMode) {
    setViewMode(mode);
    try {
      localStorage.setItem('view', mode);
    } catch {
      // ignore
    }
  }

  function handleCategoryChange(cat: Category | 'All') {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') {
      next.delete('cat');
    } else {
      next.set('cat', cat);
    }
    setSearchParams(next, { replace: true });
  }

  function handleSelectVideo(slug: string) {
    const next = new URLSearchParams(searchParams);
    next.set('v', slug);
    setSearchParams(next, { replace: true });
  }

  const { videos, loading, error, refetch } = useVideos({
    category: activeCategory,
  });

  useEffect(() => {
    refetch();
  }, [activeCategory, refetch]);

  const countStr = `(${String(videos.length).padStart(2, '0')})`;

  function handleCloseModal() {
    const next = new URLSearchParams(searchParams);
    next.delete('v');
    setSearchParams(next, { replace: true });
  }

  const activeSlug = searchParams.get('v');

  return (
    <div className="w-full">
      {/* Title & Header Block */}
      <section className="pt-28 sm:pt-36 md:pt-[170px] pb-8 md:pb-10 border-b border-line bg-bg">
        <div className="container-x">
          <Reveal>
            <SectionLabel>[ Archive 2024 — 2026 ]</SectionLabel>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h1 className="font-display font-extrabold uppercase leading-[0.85] tracking-display text-text text-page">
                ALL <span className="serif-accent">work</span>
              </h1>
              <span className="font-mono text-sm tracking-widest text-muted pb-2 self-start sm:self-end">
                {loading ? '(--)' : countStr}
              </span>
            </div>
          </Reveal>

          {/* [4] Toolbar: FilterBar + ViewToggle */}
          <div className="mt-7 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <FilterBar
              activeCategory={activeCategory}
              onChange={handleCategoryChange}
            />

            <div className="flex justify-end">
              <ViewToggle mode={viewMode} onChange={handleViewChange} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Work Area */}
      <section className="py-12 md:py-20 min-h-[450px]" aria-label="Project Gallery">
        <h2 className="sr-only">Project Gallery</h2>
        <div className="container-x">
          {error && (
            <div className="text-center py-20 space-y-4">
              <p className="text-danger font-mono text-sm">Failed to load videos.</p>
              <Button onClick={() => refetch()} variant="ghost" size="sm">
                Retry
              </Button>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-full aspect-video rounded-card bg-surface-2 animate-pulse border border-line"
                />
              ))}
            </div>
          )}

          {!loading && !error && videos.length === 0 && (
            <div className="text-center py-24 space-y-5">
              <p className="text-muted text-base">
                Nothing here yet — check back soon.
              </p>
              <Button
                onClick={() => handleCategoryChange('All')}
                variant="ghost"
                size="md"
              >
                Show all work
              </Button>
            </div>
          )}

          {!loading && !error && videos.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <VideoGrid videos={videos} onSelectVideo={handleSelectVideo} />
              ) : (
                <VideoList videos={videos} onSelectVideo={handleSelectVideo} />
              )}
            </>
          )}
        </div>
      </section>

      {/* Shared CTA */}
      <CTASection />

      {/* Project Player Modal */}
      <VideoModal
        videos={videos}
        activeSlug={activeSlug}
        onClose={handleCloseModal}
        onNavigate={handleSelectVideo}
      />
    </div>
  );
}
