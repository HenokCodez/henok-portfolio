import { supabase } from './supabase';
import sampleVideos from '../../content/sample-videos.json';
import { siteConfig } from '../config/site';
import type { Video, Message, NewMessage, SiteSettings, Category } from '../types';

const ADMIN_STORAGE_KEY = 'henok_local_videos';
const MESSAGES_STORAGE_KEY = 'henok_local_messages';
const SETTINGS_STORAGE_KEY = 'henok_local_settings';

function getLocalVideos(): Video[] {
  try {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return sampleVideos as Video[];
}

function saveLocalVideos(videos: Video[]) {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(videos));
  } catch {
    // ignore
  }
}

export async function getVideos(opts: { featuredOnly?: boolean; category?: Category | 'All' } = {}): Promise<Video[]> {
  if (!supabase) {
    let all = getLocalVideos()
      .filter((v) => v.published)
      .sort((a, b) => a.display_order - b.display_order);

    if (opts.category && opts.category !== 'All') {
      all = all.filter((v) => v.category === opts.category);
    }
    if (opts.featuredOnly) {
      all = all.filter((v) => v.featured).slice(0, 5);
    }
    return all;
  }

  let q = supabase
    .from('videos')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true });

  if (opts.category && opts.category !== 'All') {
    q = q.eq('category', opts.category);
  }
  if (opts.featuredOnly) {
    q = q.eq('featured', true).limit(5);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Video[];
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  if (!supabase) {
    const video = getLocalVideos().find((v) => v.slug === slug);
    return video ?? null;
  }

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data as Video | null;
}

export async function getAllVideosAdmin(): Promise<Video[]> {
  if (!supabase) {
    return getLocalVideos().sort((a, b) => a.display_order - b.display_order);
  }

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Video[];
}

export async function createVideo(video: Omit<Video, 'id' | 'created_at'>): Promise<Video> {
  if (!supabase) {
    const newVideo: Video = {
      ...video,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const list = getLocalVideos();
    list.push(newVideo);
    saveLocalVideos(list);
    return newVideo;
  }

  const { data, error } = await supabase
    .from('videos')
    .insert([video])
    .select()
    .single();

  if (error) throw error;
  return data as Video;
}

export async function updateVideo(id: string, updates: Partial<Video>): Promise<Video> {
  if (!supabase) {
    const list = getLocalVideos();
    const idx = list.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Video not found');
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    saveLocalVideos(list);
    return updated;
  }

  const { data, error } = await supabase
    .from('videos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Video;
}

export async function deleteVideo(id: string): Promise<void> {
  if (!supabase) {
    const list = getLocalVideos().filter((v) => v.id !== id);
    saveLocalVideos(list);
    return;
  }

  const { error } = await supabase.from('videos').delete().eq('id', id);
  if (error) throw error;
}

export async function saveOrder(ids: string[]): Promise<void> {
  if (!supabase) {
    const list = getLocalVideos();
    const map = new Map(list.map((v) => [v.id, v]));
    const reordered: Video[] = [];
    ids.forEach((id, i) => {
      const v = map.get(id);
      if (v) {
        v.display_order = i + 1;
        reordered.push(v);
      }
    });
    saveLocalVideos(reordered);
    return;
  }

  const rows = ids.map((id, i) => ({ id, display_order: i + 1 }));
  const results = await Promise.all(
    rows.map((r) =>
      supabase!.from('videos').update({ display_order: r.display_order }).eq('id', r.id),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}

export async function sendMessage(m: NewMessage): Promise<void> {
  if (!supabase) {
    console.warn('[fallback] Supabase not configured. Message stored locally:', m);
    try {
      const existing: Message[] = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
      existing.unshift({
        ...m,
        id: `msg-${Date.now()}`,
        read: false,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // ignore
    }
    return;
  }

  const { error } = await supabase.from('messages').insert([{ ...m, read: false }]);
  if (error) throw error;
}

export async function getMessages(): Promise<Message[]> {
  if (!supabase) {
    try {
      const saved = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'msg-demo-1',
        name: 'Sarah Connor',
        email: 'sarah@skynet-docs.com',
        project_type: 'Documentary',
        budget: '$1.5k–5k',
        message: 'Looking for a cinematic editor for a 45-minute documentary feature. Loved your style!',
        read: false,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'msg-demo-2',
        name: 'Alex Rivera',
        email: 'alex@creatorcollective.io',
        project_type: 'YouTube edit',
        budget: '$500–1.5k',
        message: 'Hey Henok, we need monthly pacing and narrative editing for our creator series.',
        read: true,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Message[];
}

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  if (!supabase) {
    try {
      const existing: Message[] = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
      const msg = existing.find((m) => m.id === id);
      if (msg) msg.read = read;
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // ignore
    }
    return;
  }

  const { error } = await supabase.from('messages').update({ read }).eq('id', id);
  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  if (!supabase) {
    try {
      const existing: Message[] = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
      const filtered = existing.filter((m) => m.id !== id);
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
    return;
  }

  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
}

export async function getSettings(): Promise<SiteSettings> {
  const defaultSettings: SiteSettings = {
    id: 1,
    available: siteConfig.available,
    availability_text: 'Available for projects',
    email: siteConfig.email,
    showreel_youtube_id: siteConfig.showreel.youtubeId,
    showreel_duration: siteConfig.showreel.duration,
    showreel_poster_url: (siteConfig.showreel as { posterUrl?: string }).posterUrl || null,
    booking_url: siteConfig.bookingUrl,
    socials: siteConfig.socials,
  };

  if (!supabase) {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultSettings;
  }

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error || !data) return defaultSettings;
  return data as SiteSettings;
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  if (!supabase) {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  }

  const { data, error } = await supabase
    .from('site_settings')
    .update(settings)
    .eq('id', 1)
    .select()
    .single();

  if (error) throw error;
  return data as SiteSettings;
}
