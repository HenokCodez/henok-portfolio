# 03 · Architecture

```
Browser (React SPA on Cloudflare Pages)
   ├── reads public data  ──► Supabase (anon key, RLS: only published videos)
   ├── contact form insert ─► Supabase `messages` (RLS: insert-only for anon)
   ├── admin (logged in)  ──► Supabase Auth + full CRUD on videos/messages/settings
   └── videos play from   ──► YouTube IFrame (mounted only on click)

Cloudflare Worker (optional, free): cron ping so Supabase free project never pauses.
```

**Why no Express server?** Nothing here needs one. Supabase gives DB + auth + REST; Cloudflare gives hosting. Do NOT create a Node/Express backend.

## Data model (see `snippets/schema.sql`)
- `videos`: id, slug, title, description, youtube_id, category (`Documentary|YouTube|Shorts|Commercials`), client, role, tools[], year, thumbnail_url, featured, published, display_order, created_at
- `messages`: id, name, email, project_type, budget, message, read, created_at
- `site_settings` (single row, id=1): available (bool), availability_text, email, showreel_youtube_id, socials (jsonb)

## Security (RLS) — non-negotiable
| Who | videos | messages | site_settings |
|---|---|---|---|
| Anonymous visitor | SELECT only where `published = true` | INSERT only (validated) | SELECT |
| Admin (Henok's email) | everything | SELECT / UPDATE / DELETE | UPDATE |
Also: **disable public sign-ups** in Supabase → Authentication → Providers → Email → "Allow new users to sign up" OFF. Create Henok's account manually.

## Data layer rule
All network calls live in `src/lib/api.ts`. Components call hooks in `src/hooks/` (`useVideos`, `useSettings`), never Supabase directly.

**Fallback mode:** if `import.meta.env.VITE_SUPABASE_URL` is missing, `api.ts` returns data from `content/sample-videos.json` and `content/site.config.json`, and admin pages show a banner "Supabase not configured". This lets every public page be built and tested before Supabase exists.

## Routing (`react-router-dom` v6)
| Path | Component | Layout |
|---|---|---|
| `/` | `pages/Home` | `SiteLayout` (header + footer) |
| `/work` | `pages/Work` (modal opens on `?v=<slug>`) | `SiteLayout` |
| `/about` | `pages/About` | `SiteLayout` |
| `/contact` | `pages/Contact` | `SiteLayout` |
| `/admin/login` | `pages/admin/Login` | none |
| `/admin` | `pages/admin/Videos` | `AdminLayout` (protected) |
| `/admin/messages` | `pages/admin/Messages` | `AdminLayout` (protected) |
| `/admin/settings` | `pages/admin/Settings` | `AdminLayout` (protected) |
| `*` | `pages/NotFound` | `SiteLayout` |

Modal on Home too: clicking a featured card navigates to `/work?v=<slug>` (do not duplicate the modal logic).
Use `React.lazy` for all admin pages (keeps public bundle small). Admin is `noindex`.

## State
No Redux/Zustand. React state + hooks. Auth state via `onAuthStateChange` in `AuthProvider`.

## Performance budget
- Public JS (gzipped) < 180 KB excluding admin chunk. Admin & dnd-kit lazy-loaded.
- LCP < 2.5s on 4G: preload fonts, first card `loading="eager"`, portrait `fetchpriority="high"`.
- No iframe until click. Thumbnails lazy.

## SEO
`react-helmet-async` is NOT allowed (extra dependency). Instead: a tiny `usePageMeta(title, description)` hook that sets `document.title` and the meta description. Static `index.html` contains OG tags, favicon, theme-color `#0A0A0B`. Add `public/robots.txt` and `public/sitemap.xml` (static, 4 URLs).

## Env vars (`.env.local`, never commit)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
Commit a `.env.example` with empty values.
