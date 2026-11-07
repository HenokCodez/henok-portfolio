import { motion, AnimatePresence } from 'framer-motion';
import { VideoCard } from './VideoCard';
import type { Video } from '../../types';

export interface VideoGridProps {
  videos: Video[];
  onSelectVideo?: (slug: string) => void;
}

export function VideoGrid({ videos, onSelectVideo }: VideoGridProps) {
  const total = String(videos.length).padStart(2, '0');

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full"
    >
      <AnimatePresence mode="popLayout">
        {videos.map((video, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          return (
            <motion.div
              layout
              key={video.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <VideoCard
                video={video}
                indexStr={`${num} / ${total}`}
                onClick={onSelectVideo ? () => onSelectVideo(video.slug) : undefined}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
