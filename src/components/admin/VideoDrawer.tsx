import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseYouTubeId, slugify, embedUrl } from '../../lib/youtube';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { Thumbnail } from '../video/Thumbnail';
import type { Video, Category } from '../../types';
import { X, Play, Sparkles, Loader2, Check } from 'lucide-react';

export interface VideoDrawerProps {
  isOpen: boolean;
  video: Video | null; // null = Add Mode, Video = Edit Mode
  onClose: () => void;
  onSave: (data: Omit<Video, 'id' | 'created_at'>, id?: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const DESCRIPTION_PRESETS = [
  {
    label: 'Talking Head & Retention',
    text: 'Paced and engaging talking-head edit optimized for high retention, crisp punch-ins, audio sweetening, motion graphics, and clean rhythm.',
  },
  {
    label: 'Storytelling & Narrative',
    text: 'Narrative structure and sound design cut for emotional resonance, intentional pacing, and keeping viewers hooked until the final second.',
  },
  {
    label: 'Cinematic Documentary',
    text: 'Immersive documentary cut weaving archival footage, multi-track audio soundscapes, and tailored color grading to amplify the story.',
  },
  {
    label: 'Short-Form Viral Hook',
    text: 'High-impact vertical edit with snappy 3-second visual hooks, kinetic captions, sound design, and pacing tuned for algorithmic retention.',
  },
  {
    label: 'Commercial & Brand Promo',
    text: 'Tight, brand-aligned commercial cut with modern motion aesthetics, punchy transitions, and high-conversion visual polish.',
  },
];

export function VideoDrawer({
  isOpen,
  video,
  onClose,
  onSave,
  onDelete,
}: VideoDrawerProps) {
  const [youtubeInput, setYoutubeInput] = useState('');
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);

  const [category, setCategory] = useState<Category>('Documentary');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [client, setClient] = useState('');
  const [role, setRole] = useState('');

  const [tools, setTools] = useState<string[]>([]);
  const [toolInput, setToolInput] = useState('');

  const [description, setDescription] = useState('');
  const [thumbnailUrlInput, setThumbnailUrlInput] = useState('');

  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-suggestion state
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [autoSuggestedNotice, setAutoSuggestedNotice] = useState<string | null>(null);

  // Populate or reset form
  useEffect(() => {
    if (video) {
      setYoutubeInput(video.youtube_id);
      setYoutubeId(video.youtube_id);
      setTitle(video.title);
      setSlug(video.slug);
      setIsSlugManual(true);
      setCategory(video.category);
      setYear(video.year || new Date().getFullYear());
      setClient(video.client || '');
      setRole(video.role || '');
      setTools(video.tools || []);
      setDescription(video.description || '');
      setThumbnailUrlInput(video.thumbnail_url || '');
      setPublished(video.published);
      setFeatured(video.featured);
    } else {
      setYoutubeInput('');
      setYoutubeId(null);
      setTitle('');
      setSlug('');
      setIsSlugManual(false);
      setCategory('Documentary');
      setYear(new Date().getFullYear());
      setClient('');
      setRole('');
      setTools(['Premiere Pro', 'After Effects']);
      setDescription('');
      setThumbnailUrlInput('');
      setPublished(true);
      setFeatured(false);
    }
    setIsPlayingPreview(false);
    setErrorMsg(null);
    setAutoSuggestedNotice(null);
  }, [video, isOpen]);

  // Handle YouTube parsing & auto-suggestion
  async function handleAutoSuggest(targetId: string, rawInput: string) {
    if (!targetId) return;

    setIsFetchingMeta(true);
    setAutoSuggestedNotice(null);
    try {
      const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${targetId}`);
      if (!res.ok) return;
      const data = await res.json();

      if (data && data.title) {
        // Auto-fill title if empty or default
        if (!title || title.startsWith('Talking Head') || title.startsWith('Sample') || !video) {
          setTitle(data.title);
          if (!isSlugManual) {
            setSlug(slugify(data.title));
          }
        }

        // Auto-fill client if author_name exists
        if (data.author_name && (!client || client === 'Creator' || !video)) {
          setClient(data.author_name);
        }

        // Auto-detect category
        const titleLower = (data.title || '').toLowerCase();
        const urlLower = rawInput.toLowerCase();
        let detectedCategory: Category = 'YouTube';

        if (urlLower.includes('/shorts/') || titleLower.includes('#shorts') || titleLower.includes('reel') || titleLower.includes('tiktok')) {
          detectedCategory = 'Shorts';
        } else if (titleLower.includes('documentary') || titleLower.includes('crime') || titleLower.includes('investigation') || titleLower.includes('story') || titleLower.includes('film')) {
          detectedCategory = 'Documentary';
        } else if (titleLower.includes('commercial') || titleLower.includes('promo') || titleLower.includes('ad ') || titleLower.includes('trailer')) {
          detectedCategory = 'Commercials';
        } else {
          detectedCategory = 'YouTube';
        }
        setCategory(detectedCategory);

        // Auto-suggest description if currently empty
        if (!description) {
          if (detectedCategory === 'Shorts') {
            setDescription(DESCRIPTION_PRESETS[3].text);
          } else if (detectedCategory === 'Documentary') {
            setDescription(DESCRIPTION_PRESETS[2].text);
          } else if (detectedCategory === 'Commercials') {
            setDescription(DESCRIPTION_PRESETS[4].text);
          } else if (titleLower.includes('talking head') || titleLower.includes('podcast')) {
            setDescription(DESCRIPTION_PRESETS[0].text);
          } else {
            setDescription(DESCRIPTION_PRESETS[1].text);
          }
        }

        setAutoSuggestedNotice('Auto-suggested title, author, category & description!');
        setTimeout(() => setAutoSuggestedNotice(null), 4500);
      }
    } catch {
      // ignore network errors gracefully
    } finally {
      setIsFetchingMeta(false);
    }
  }

  function handleYoutubeChange(val: string) {
    setYoutubeInput(val);
    const parsed = parseYouTubeId(val);
    setYoutubeId(parsed);
    setIsPlayingPreview(false);

    if (parsed && parsed !== youtubeId) {
      handleAutoSuggest(parsed, val);
    }
  }

  // Handle Title & Auto Slug
  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
  }

  // Tool tags management
  function handleAddTool() {
    const trimmed = toolInput.trim();
    if (trimmed && tools.length < 8 && !tools.includes(trimmed)) {
      setTools([...tools, trimmed]);
      setToolInput('');
    }
  }

  function handleRemoveTool(toolToRemove: string) {
    setTools(tools.filter((t) => t !== toolToRemove));
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!youtubeId) {
      setErrorMsg('Please enter a valid YouTube URL or 11-character video ID.');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Please provide a title for the video.');
      return;
    }

    const finalSlug = slug.trim() || slugify(title);

    try {
      setIsSaving(true);
      await onSave(
        {
          youtube_id: youtubeId,
          title: title.trim(),
          slug: finalSlug,
          category,
          year,
          client: client.trim() || null,
          role: role.trim() || null,
          tools,
          description: description.trim() || null,
          thumbnail_url: thumbnailUrlInput.trim() || null,
          published,
          featured,
          display_order: video ? video.display_order : 0,
        },
        video?.id,
      );
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save video.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!video || !onDelete) return;
    if (window.confirm(`Delete "${video.title}"? This cannot be undone.`)) {
      try {
        setIsDeleting(true);
        await onDelete(video.id);
        onClose();
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to delete video.');
      } finally {
        setIsDeleting(false);
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Scrim */}
          <motion.div
            key="drawer-scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[rgba(5,5,6,0.7)] backdrop-blur-sm"
          />

          {/* Right Sliding Drawer */}
          <motion.div
            key="drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[560px] bg-surface border-l border-line-strong p-6 sm:p-7 flex flex-col gap-5 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h2 className="font-display font-extrabold uppercase text-xl sm:text-2xl tracking-tight text-text">
                {video ? 'EDIT VIDEO' : 'ADD VIDEO'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-muted hover:text-text hover:bg-surface-2 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-danger/10 border border-danger/40 text-danger text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                {/* [3] YouTube URL / ID */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-mono text-[11px] uppercase tracking-mono text-muted">
                      YouTube URL or ID *
                    </label>
                    {youtubeId && (
                      <button
                        type="button"
                        disabled={isFetchingMeta}
                        onClick={() => handleAutoSuggest(youtubeId, youtubeInput)}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:text-accent-hover transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isFetchingMeta ? (
                          <Loader2 size={12} className="animate-spin text-accent" />
                        ) : (
                          <Sparkles size={12} className="text-accent" />
                        )}
                        <span>Auto-suggest details</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={youtubeInput}
                    onChange={(e) => handleYoutubeChange(e.target.value)}
                    placeholder="https://youtu.be/aqz-KE-bpKQ or aqz-KE-bpKQ"
                    className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-line-strong text-sm text-text placeholder:text-faint transition-all focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
                  />
                  {youtubeInput && !youtubeId && (
                    <p className="text-xs font-mono text-danger">
                      That doesn&apos;t look like a valid YouTube link or ID.
                    </p>
                  )}
                  {autoSuggestedNotice && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-ok/10 border border-ok/30 text-ok text-xs font-mono">
                      <Check size={14} />
                      <span>{autoSuggestedNotice}</span>
                    </div>
                  )}
                </div>

                {/* [4] Detected Preview */}
                {youtubeId && (
                  <div className="space-y-1.5">
                    <span className="block font-mono text-[10px] uppercase tracking-mono text-ok">
                      PREVIEW — ID DETECTED ✓ ({youtubeId})
                    </span>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-line bg-surface-2">
                      {isPlayingPreview ? (
                        <iframe
                          className="w-full h-full"
                          src={embedUrl(youtubeId)}
                          title="Preview"
                          allow="autoplay; encrypted-media; picture-in-picture"
                        />
                      ) : (
                        <div
                          onClick={() => setIsPlayingPreview(true)}
                          className="relative w-full h-full cursor-pointer group"
                        >
                          <Thumbnail
                            youtubeId={youtubeId}
                            overrideUrl={thumbnailUrlInput}
                            alt="Preview thumbnail"
                            className="w-full h-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-text text-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play size={18} className="ml-0.5 text-bg fill-bg" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* [5] Title & Slug */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] uppercase tracking-mono text-muted">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="The Last Harvest"
                    className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-line-strong text-sm text-text placeholder:text-faint transition-all focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
                  />
                  <div className="flex items-center gap-2 pt-1 font-mono text-xs text-muted">
                    <span>slug:</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setIsSlugManual(true);
                        setSlug(slugify(e.target.value));
                      }}
                      className="bg-transparent border-b border-line text-text focus:outline-none focus:border-accent text-xs"
                    />
                  </div>
                </div>

                {/* [6] 2x2 Grid: Category, Year, Client, Role */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-mono text-muted">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full h-12 px-3 rounded-xl bg-surface-2 border border-line-strong text-sm text-text focus:outline-none focus:border-accent"
                    >
                      <option value="Documentary">Documentary</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Shorts">Shorts</option>
                      <option value="Commercials">Commercials</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-mono text-muted">
                      Year
                    </label>
                    <input
                      type="number"
                      min={2000}
                      max={2100}
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full h-12 px-3 rounded-xl bg-surface-2 border border-line-strong text-sm text-text focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-mono text-muted">
                      Client
                    </label>
                    <input
                      type="text"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder="e.g. Netflix, Creator"
                      className="w-full h-12 px-3 rounded-xl bg-surface-2 border border-line-strong text-sm text-text focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-mono text-muted">
                      Role
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Lead Editor, Colorist"
                      className="w-full h-12 px-3 rounded-xl bg-surface-2 border border-line-strong text-sm text-text focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Tools tag input */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] uppercase tracking-mono text-muted">
                    Tools (Press Enter to add, max 8)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={toolInput}
                      onChange={(e) => setToolInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTool();
                        }
                      }}
                      placeholder="e.g. After Effects"
                      className="flex-1 h-11 px-3 rounded-xl bg-surface-2 border border-line-strong text-sm text-text focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={handleAddTool}
                      className="h-11 px-4 rounded-xl border border-line-strong font-mono text-xs uppercase hover:bg-surface-3"
                    >
                      Add
                    </button>
                  </div>
                  {tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tools.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-2 border border-line font-mono text-xs text-text"
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTool(t)}
                            className="text-muted hover:text-danger"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description & Smart Suggestions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-mono text-[11px] uppercase tracking-mono text-muted">
                      Description
                    </label>
                    <span className="font-mono text-[10px] text-muted">
                      {description.length}/1000
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description of the brief, editing process, and result…"
                    className="w-full p-3 rounded-xl bg-surface-2 border border-line-strong text-sm text-text placeholder:text-faint focus:outline-none focus:border-accent resize-y"
                  />
                  {/* Quick Description Suggestion Chips */}
                  <div className="space-y-1.5 pt-1">
                    <span className="block font-mono text-[10px] uppercase tracking-mono text-muted">
                      Suggested Descriptions (Click to apply):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {DESCRIPTION_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setDescription(preset.text)}
                          className="px-2.5 py-1 rounded-lg bg-surface-2 border border-line hover:border-accent hover:text-accent text-muted font-mono text-[11px] transition-all cursor-pointer"
                          title={preset.text}
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Thumbnail URL */}
                <div className="space-y-1">
                  <label className="block font-mono text-[11px] uppercase tracking-mono text-muted">
                    Custom Thumbnail URL (optional)
                  </label>
                  <input
                    type="url"
                    value={thumbnailUrlInput}
                    onChange={(e) => setThumbnailUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="w-full h-11 px-3 rounded-xl bg-surface-2 border border-line-strong text-sm text-text focus:outline-none focus:border-accent"
                  />
                  <p className="font-mono text-[10px] text-muted">
                    Leave empty to use the automatic YouTube thumbnail.
                  </p>
                </div>

                {/* [7] Switches: Published & Featured */}
                <div className="p-4 rounded-xl bg-surface-2 border border-line flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-display font-semibold text-sm text-text block">
                      Published
                    </span>
                    <span className="font-mono text-xs text-muted block">
                      Visible on public Work page
                    </span>
                  </div>
                  <Switch checked={published} onChange={setPublished} />
                </div>

                <div className="p-4 rounded-xl bg-surface-2 border border-line flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-display font-semibold text-sm text-text block">
                      Featured
                    </span>
                    <span className="font-mono text-xs text-muted block">
                      Show in Selected Work on Home (max 5)
                    </span>
                  </div>
                  <Switch checked={featured} onChange={setFeatured} />
                </div>
              </div>

              {/* [8] Footer Actions */}
              <div className="pt-6 border-t border-line flex items-center justify-between gap-3">
                {video ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-10 px-4 rounded-full border border-danger/40 text-danger text-xs font-semibold hover:bg-danger/10 transition-colors"
                  >
                    {isDeleting ? 'Deleting…' : 'Delete'}
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2.5">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="sm"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving…' : 'Save video'}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
