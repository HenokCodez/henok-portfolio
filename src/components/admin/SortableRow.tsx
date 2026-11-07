import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Star, Pencil, Trash2 } from 'lucide-react';
import { Switch } from '../ui/Switch';
import { Chip } from '../ui/Chip';
import { thumbnailUrl } from '../../lib/youtube';
import type { Video } from '../../types';
import { cn } from '../../lib/cn';

export interface SortableRowProps {
  video: Video;
  isDragDisabled?: boolean;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
  onToggleFeatured: (video: Video) => void;
  onTogglePublished: (video: Video) => void;
}

export function SortableRow({
  video,
  isDragDisabled = false,
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePublished,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: video.id,
    disabled: isDragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const thumbSrc =
    video.thumbnail_url || thumbnailUrl(video.youtube_id, 'hqdefault');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative border-t border-line bg-surface hover:bg-surface-2/60 transition-colors duration-150',
        isDragging && 'opacity-60 bg-surface-2 ring-1 ring-accent z-20',
      )}
    >
      {/* Desktop Layout: grid cols 34px 110px 1fr 140px 70px 80px 90px */}
      <div className="hidden md:grid grid-cols-[34px_110px_1fr_140px_70px_80px_90px] gap-4 items-center px-4.5 py-3 text-sm">
        {/* 1. Drag Handle */}
        <button
          type="button"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
          disabled={isDragDisabled}
          className={cn(
            'flex items-center justify-center text-faint hover:text-text cursor-grab active:cursor-grabbing p-1 -ml-1 transition-colors',
            isDragDisabled && 'opacity-30 cursor-not-allowed',
          )}
        >
          <GripVertical size={16} />
        </button>

        {/* 2. Thumbnail */}
        <div className="w-[110px] aspect-video rounded-md overflow-hidden bg-surface-2 relative shrink-0 border border-line">
          <img
            src={thumbSrc}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 3. Title + Meta */}
        <div className="min-w-0 pr-2">
          <p className="font-display font-semibold text-text truncate">
            {video.title}
          </p>
          <p className="font-mono text-xs text-muted truncate mt-0.5">
            {video.client || 'Independent'} · {video.year || 2025}
          </p>
        </div>

        {/* 4. Category Chip */}
        <div>
          <Chip variant="default" size="sm">
            {video.category}
          </Chip>
        </div>

        {/* 5. Featured Toggle */}
        <div className="flex justify-center">
          <button
            type="button"
            aria-label={video.featured ? 'Unmark featured' : 'Mark featured'}
            onClick={() => onToggleFeatured(video)}
            className="p-1.5 rounded-lg hover:bg-surface-3 transition-colors"
          >
            <Star
              size={18}
              className={cn(
                video.featured
                  ? 'text-accent fill-accent'
                  : 'text-faint hover:text-muted',
              )}
            />
          </button>
        </div>

        {/* 6. Live / Published Switch */}
        <div className="flex justify-center">
          <Switch
            checked={video.published}
            onChange={() => onTogglePublished(video)}
            aria-label={`Toggle publication for ${video.title}`}
          />
        </div>

        {/* 7. Actions (Edit & Delete) */}
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            aria-label="Edit video"
            onClick={() => onEdit(video)}
            className="w-8 h-8 rounded-lg border border-line flex items-center justify-center text-muted hover:text-text hover:border-line-strong hover:bg-surface-3 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            aria-label="Delete video"
            onClick={() => onDelete(video)}
            className="w-8 h-8 rounded-lg border border-line flex items-center justify-center text-muted hover:text-danger hover:border-danger/40 hover:bg-danger/10 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Mobile Layout: grid cols 70px 1fr 60px */}
      <div
        onClick={() => onEdit(video)}
        role="button"
        tabIndex={0}
        aria-label={`Edit ${video.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEdit(video);
          }
        }}
        className="md:hidden grid grid-cols-[70px_1fr_60px] gap-3 items-center p-3 text-sm cursor-pointer"
      >
        <div className="w-[70px] aspect-video rounded overflow-hidden bg-surface-2 relative shrink-0 border border-line">
          <img
            src={thumbSrc}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <p className="font-display font-semibold text-text text-sm truncate">
            {video.title}
          </p>
          <p className="font-mono text-[11px] text-muted truncate mt-0.5">
            {video.category} · {video.year}
          </p>
        </div>

        <div
          className="flex justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <Switch
            checked={video.published}
            onChange={() => onTogglePublished(video)}
            aria-label={`Toggle publication for ${video.title}`}
          />
        </div>
      </div>
    </div>
  );
}
