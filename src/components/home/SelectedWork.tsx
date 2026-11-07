import { useVideos } from '../../hooks/useVideos';
import { VideoCard } from '../video/VideoCard';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function SelectedWork() {
  const { videos, loading, error } = useVideos({ featuredOnly: true });

  if (error) {
    return (
      <section className="container-x py-section text-center">
        <p className="text-muted text-sm font-mono">Couldn&apos;t load the work. Please refresh.</p>
      </section>
    );
  }

  if (!loading && videos.length === 0) {
    return null;
  }

  const firstCard = videos[0];
  const gridCards = videos.slice(1, 5);

  return (
    <section className="py-section pt-20 pb-28 md:pb-32 bg-bg border-t border-line">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            label="[ 01 — Selected work ]"
            title="SELECTED"
            accentWord="work"
            count={`(0${videos.length})`}
          />
        </Reveal>

        {loading ? (
          <div className="space-y-6">
            <div className="w-full aspect-[16/10] min-[701px]:aspect-[21/9] min-[701px]:max-h-[min(520px,68vh)] rounded-card bg-surface-2 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full aspect-video rounded-card bg-surface-2 animate-pulse" />
              <div className="w-full aspect-video rounded-card bg-surface-2 animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* First Featured Card: Full Width constrained to max 520px / 68vh */}
            {firstCard && (
              <Reveal>
                <div className="mb-6">
                  <VideoCard
                    video={firstCard}
                    indexStr="01 / 09"
                    eager={true}
                    aspectClassName="aspect-[16/10] min-[701px]:aspect-[21/9] min-[701px]:max-h-[min(520px,68vh)]"
                    className="w-full"
                  />
                </div>
              </Reveal>
            )}

            {/* Cards 2-5: 2-Column Grid */}
            {gridCards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {gridCards.map((video, idx) => {
                  const num = String(idx + 2).padStart(2, '0');
                  return (
                    <Reveal key={video.id} delay={idx * 0.1}>
                      <VideoCard
                        video={video}
                        indexStr={`${num} / 09`}
                      />
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* View All Work Button */}
        <Reveal delay={0.2}>
          <div className="flex justify-center mt-12 md:mt-16">
            <Button to="/work" variant="ghost" size="lg" arrow="right">
              View all work
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
