import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableRow } from './SortableRow';
import type { Video } from '../../types';

export interface VideoTableProps {
  videos: Video[];
  isFilteredOrSearched?: boolean;
  onReorder: (activeId: string, overId: string) => void;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
  onToggleFeatured: (video: Video) => void;
  onTogglePublished: (video: Video) => void;
  onAddNew: () => void;
}

export function VideoTable({
  videos,
  isFilteredOrSearched = false,
  onReorder,
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePublished,
  onAddNew,
}: VideoTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id));
    }
  }

  if (videos.length === 0) {
    return (
      <div className="rounded-[14px] border border-line bg-surface p-12 text-center space-y-4">
        <p className="text-muted text-sm font-mono">No videos found.</p>
        <button
          type="button"
          onClick={onAddNew}
          className="h-9 px-4 rounded-full bg-accent text-accent-ink text-xs font-semibold hover:bg-accent/90 transition-colors"
        >
          Add your first video
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[14px] border border-line bg-surface overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden md:grid grid-cols-[34px_110px_1fr_140px_70px_80px_90px] gap-4 items-center px-4.5 py-3 bg-surface-2 font-mono text-[10px] uppercase tracking-mono text-muted select-none">
        <span />
        <span>Thumb</span>
        <span>Title &amp; Info</span>
        <span>Category</span>
        <span className="text-center">Featured</span>
        <span className="text-center">Live</span>
        <span className="text-right">Actions</span>
      </div>

      {/* Dnd Sortable Rows */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={videos.map((v) => v.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="divide-y divide-line">
            {videos.map((video) => (
              <SortableRow
                key={video.id}
                video={video}
                isDragDisabled={isFilteredOrSearched}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFeatured={onToggleFeatured}
                onTogglePublished={onTogglePublished}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Table Footer Hint */}
      <div className="p-3 bg-surface-2/40 border-t border-line text-center">
        <span className="font-mono text-[11px] text-muted">
          {isFilteredOrSearched
            ? 'Reordering is disabled while search or category filters are active.'
            : 'Drag the handle to reorder. Changes save automatically.'}
        </span>
      </div>
    </div>
  );
}
