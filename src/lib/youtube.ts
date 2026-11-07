const ID_RE = /^[A-Za-z0-9_-]{11}$/;

/** Accepts youtu.be/ID, youtube.com/watch?v=ID, /shorts/ID, /embed/ID, /live/ID or a bare 11-char ID. */
export function parseYouTubeId(input: string): string | null {
  const v = input.trim();
  if (ID_RE.test(v)) return v;
  try {
    const url = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    const host = url.hostname.replace(/^(www|m|music)\./, '');
    if (host === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0];
      return ID_RE.test(id) ? id : null;
    }
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const q = url.searchParams.get('v');
      if (q && ID_RE.test(q)) return q;
      const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{11})/);
      if (m) return m[1];
    }
  } catch {
    /* invalid URL */
  }
  return null;
}

export const thumbnailUrl = (id: string, q: 'maxresdefault' | 'hqdefault' = 'maxresdefault') =>
  `https://i.ytimg.com/vi/${id}/${q}.jpg`;

export const embedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');

