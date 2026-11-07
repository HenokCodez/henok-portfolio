import { useState, useEffect, useCallback, useMemo } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import {
  getAllVideosAdmin,
  saveOrder,
  createVideo,
  updateVideo,
  deleteVideo,
  getMessages,
} from '../../lib/api';
import { StatCards } from '../../components/admin/StatCards';
import { VideoTable } from '../../components/admin/VideoTable';
import { VideoDrawer } from '../../components/admin/VideoDrawer';
import { FilterBar } from '../../components/video/FilterBar';
import { Button } from '../../components/ui/Button';
import type { Video, Category } from '../../types';
import { Plus, Search } from 'lucide-react';

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [allVids, allMsgs] = await Promise.all([
        getAllVideosAdmin(),
        getMessages(),
      ]);
      setVideos(allVids);
      setNewMessagesCount(allMsgs.filter((m) => !m.read).length);
    } catch {
      showToast('Error loading video data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Videos — Henok Admin';
    loadData();
  }, [loadData]);

  // Filtered and Searched Videos list
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchesCat =
        activeCategory === 'All' || v.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.title.toLowerCase().includes(q) ||
        (v.client && v.client.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [videos, activeCategory, searchQuery]);

  const isFilteredOrSearched =
    activeCategory !== 'All' || searchQuery.trim().length > 0;

  // Reorder handler
  async function handleReorder(activeId: string, overId: string) {
    const oldIndex = videos.findIndex((v) => v.id === activeId);
    const newIndex = videos.findIndex((v) => v.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(videos, oldIndex, newIndex);
    setVideos(reordered);

    try {
      await saveOrder(reordered.map((v) => v.id));
      showToast('Order saved automatically.');
    } catch {
      showToast('Failed to save reorder. Reverting.');
      loadData();
    }
  }

  // Toggles
  async function handleToggleFeatured(video: Video) {
    const nextFeatured = !video.featured;
    setVideos((prev) =>
      prev.map((v) => (v.id === video.id ? { ...v, featured: nextFeatured } : v)),
    );
    try {
      await updateVideo(video.id, { featured: nextFeatured });
      showToast(nextFeatured ? 'Marked as featured.' : 'Removed from featured.');
    } catch {
      showToast('Error updating featured status.');
      loadData();
    }
  }

  async function handleTogglePublished(video: Video) {
    const nextPublished = !video.published;
    setVideos((prev) =>
      prev.map((v) => (v.id === video.id ? { ...v, published: nextPublished } : v)),
    );
    try {
      await updateVideo(video.id, { published: nextPublished });
      showToast(nextPublished ? 'Video published.' : 'Video hidden from public site.');
    } catch {
      showToast('Error updating published status.');
      loadData();
    }
  }

  // Drawer handlers
  function handleOpenAdd() {
    setEditingVideo(null);
    setDrawerOpen(true);
  }

  function handleOpenEdit(video: Video) {
    setEditingVideo(video);
    setDrawerOpen(true);
  }

  async function handleSaveVideo(
    data: Omit<Video, 'id' | 'created_at'>,
    id?: string,
  ) {
    if (id) {
      await updateVideo(id, data);
      showToast('Video updated successfully.');
    } else {
      await createVideo(data);
      showToast('New video added.');
    }
    await loadData();
  }

  async function handleDeleteVideo(video: Video) {
    if (window.confirm(`Delete "${video.title}"? This cannot be undone.`)) {
      await deleteVideo(video.id);
      showToast('Video deleted.');
      await loadData();
    }
  }

  async function handleDeleteFromDrawer(id: string) {
    await deleteVideo(id);
    showToast('Video deleted.');
    await loadData();
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold uppercase text-3xl sm:text-[34px] tracking-tight leading-none text-text">
            VIDEOS
          </h1>
          <p className="font-mono text-xs text-muted uppercase tracking-mono mt-1.5">
            Manage your public video edits and order
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="accent"
          size="md"
          className="gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add video</span>
        </Button>
      </div>

      {/* [3] Stat Cards */}
      <StatCards
        total={videos.length}
        published={videos.filter((v) => v.published).length}
        featured={videos.filter((v) => v.featured).length}
        newMessages={newMessagesCount}
      />

      {/* [4] Toolbar: Search + Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[320px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos by title or client…"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface border border-line-strong text-sm text-text placeholder:text-faint focus:outline-none focus:border-accent"
          />
        </div>

        <FilterBar
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      {/* [5] Videos Table */}
      {loading ? (
        <div className="rounded-[14px] border border-line bg-surface p-12 text-center font-mono text-sm text-muted">
          Loading videos…
        </div>
      ) : (
        <VideoTable
          videos={filteredVideos}
          isFilteredOrSearched={isFilteredOrSearched}
          onReorder={handleReorder}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteVideo}
          onToggleFeatured={handleToggleFeatured}
          onTogglePublished={handleTogglePublished}
          onAddNew={handleOpenAdd}
        />
      )}

      {/* Video Add / Edit Drawer */}
      <VideoDrawer
        isOpen={drawerOpen}
        video={editingVideo}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveVideo}
        onDelete={handleDeleteFromDrawer}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-surface-2 border border-line-strong shadow-2xl text-text font-mono text-xs flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
