// src/lib/api.ts — PATTERN to follow. Every function: use Supabase if configured, else fall back to local JSON.
import { supabase } from './supabase';
import sampleVideos from '../../content/sample-videos.json';
import type { Video, NewMessage } from '../types';

export async function getVideos(opts: { featuredOnly?: boolean } = {}): Promise<Video[]> {
  if (!supabase) {
    const all = (sampleVideos as Video[]).filter(v => v.published).sort((a, b) => a.display_order - b.display_order);
    return opts.featuredOnly ? all.filter(v => v.featured).slice(0, 5) : all;
  }
  let q = supabase.from('videos').select('*').eq('published', true).order('display_order', { ascending: true });
  if (opts.featuredOnly) q = q.eq('featured', true).limit(5);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Video[];
}

export async function sendMessage(m: NewMessage): Promise<void> {
  if (!supabase) { console.warn('[fallback] message not sent', m); return; }
  const { error } = await supabase.from('messages').insert({ ...m, read: false });
  if (error) throw error;
}

// Admin: persist drag-and-drop order
export async function saveOrder(ids: string[]): Promise<void> {
  if (!supabase) return;
  const rows = ids.map((id, i) => ({ id, display_order: i + 1 }));
  // upsert needs all NOT NULL columns on insert, so update one by one (small list) :
  const results = await Promise.all(rows.map(r => supabase!.from('videos').update({ display_order: r.display_order }).eq('id', r.id)));
  const failed = results.find(r => r.error);
  if (failed?.error) throw failed.error;
}
