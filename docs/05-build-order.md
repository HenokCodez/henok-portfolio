# 05 · Build order — phase by phase

Work **one phase at a time**. After each phase: `npm run build` must pass, run `npm run dev`, compare with the mockup at **1440px and 390px**, tick the boxes, and tell Henok what to review.

Each phase has a **prompt** Henok can paste. Phases are small on purpose.

---

## Phase 1 — Scaffold, tokens, fonts
**Prompt:** *"Do Phase 1 of docs/05-build-order.md exactly. Follow docs/04-folder-structure.md install commands. Don't build any page yet."*
- [x] Vite + React + TS created in workspace root (kit folders untouched)
- [x] Dependencies installed (Tailwind pinned to 3.4)
- [x] `tailwind.config.js` = `design/tokens/tailwind.config.js`
- [x] `src/index.css` = Tailwind directives + `design/tokens/tokens.css` + `.container-x`, `.py-section`
- [x] Google Fonts `<link>` in `index.html` (from `docs/02-design-system.md`), `<meta name="theme-color" content="#0A0A0B">`, favicon
- [x] Copy `public-templates/_redirects`, `_headers`, `robots.txt` into `public/`; copy `public-templates/.env.example` to the project root
- [x] Folder structure from `docs/04` created (empty files OK)
- [x] `src/types/index.ts`, `src/config/site.ts`, `src/lib/cn.ts`, `src/lib/youtube.ts` (from `snippets/youtube.ts`)
- [x] A temporary test page shows: the 4 fonts, all colour swatches, a `display` headline with a `serif-accent` word, all 3 button variants → matches `docs/02-design-system.md`

## Phase 2 — Layout shell (Header, Footer, Router)
**Prompt:** *"Do Phase 2. Read pages/_global-header-footer.md and look at the header and footer in design/mockups/desktop-annotated/home.png and mobile/home.png."*
- [x] `App.tsx` router with all routes (placeholder pages with just a title)
- [x] `Header` (desktop pill nav w/ active state, live local-time clock, "Let's talk" button) → `pages/_global-header-footer.md`
- [x] `MobileMenu` (full-screen overlay, big links, closes on route change/ESC)
- [x] `Footer` incl. giant faded wordmark
- [x] `Reveal`, `Button`, `Chip`, `SectionLabel`, `SectionHeading`, `Grain` ui components
- [x] Header becomes `backdrop-blur` + `bg-bg/70` after 40px scroll

## Phase 3 — Data layer (works without Supabase)
**Prompt:** *"Do Phase 3. Read docs/03-architecture.md 'Data layer rule' and use snippets/supabase.ts and content/sample-videos.json."*
- [x] `types`, `lib/supabase.ts` (null-safe), `lib/api.ts` with fallback to sample JSON
- [x] `useVideos({ featuredOnly?, category? })`, `useSettings`
- [x] `Thumbnail` component with `maxresdefault → hqdefault` fallback and shimmer placeholder
- [x] `VideoCard` exactly per `docs/02-design-system.md` (tilt via `snippets/useTilt.ts`)

## Phase 4 — Home page
**Prompt:** *"Do Phase 4: build the Home page. Follow pages/home.md section by section ([1] to [15]). Open design/mockups/desktop-annotated/home.png first."*
- [x] [2]–[7] Hero incl. `HeroPortrait` with cursor-follow (`snippets/usePortraitLook.ts`), placeholder SVG if no `portrait.png`
- [x] [8] Marquee · [9] Selected work · [10] Showreel + Timeline · [11] Services · [12] Testimonials · [13] About teaser · [14] CTA
- [x] Scroll reveals per `docs/06-animation-spec.md`
- [x] Mobile matches `design/mockups/mobile/home.png`

## Phase 5 — Work page
**Prompt:** *"Do Phase 5. Follow pages/work.md. Mockups: work-grid.png and work-list.png (desktop, annotated, mobile)."*
- [x] Title, `FilterBar` (sliding pill), `ViewToggle` (GRID / LIST, remembered in `localStorage` in try/catch)
- [x] Grid view (3 cols, gap 12) and List view (with cursor-following floating preview)
- [x] Filter animates with `AnimatePresence` + `layout`
- [x] Category from URL: `/work?cat=Documentary`

## Phase 6 — Project modal
**Prompt:** *"Do Phase 6. Follow pages/project-modal.md and use snippets/VideoModal.tsx as the starting point."*
- [x] Opens via `?v=<slug>`, closes via ✕, ESC, scrim click; restores scroll & focus
- [x] Player mounts only after click on thumbnail; unmounts on close (stops playback)
- [x] Prev/Next (buttons + ← → keys) cycle through the currently filtered list
- [x] "More work" row; focus trap; body scroll locked

## Phase 7 — About page → Phase 8 — Contact page → Phase 9 — 404
**Prompts:** *"Do Phase 7 (pages/about.md)."* / *"Do Phase 8 (pages/contact.md)."* / *"Do Phase 9 (pages/not-found.md)."*
- [x] About: all sections [2]–[9]; sticky portrait on desktop; counters animate once
- [x] Contact: form with validation, honeypot, loading/success/error states; writes to `messages` (or logs to console in fallback mode)
- [x] 404 page

## Phase 10 — Connect Supabase
**Prompt:** *"Do Phase 10. Henok has created the Supabase project following docs/07-supabase-setup.md and put keys in .env.local. Switch api.ts to real data and verify."*
- [x] Public pages read real videos; unpublished videos are invisible when logged out
- [x] Contact form inserts a row
- [x] Fallback mode still works if env vars removed

## Phase 11 — Admin
**Prompt:** *"Do Phase 11. Follow pages/admin-login.md, admin-videos.md, admin-video-drawer.md, admin-messages.md, admin-settings.md. Use snippets/ProtectedRoute.tsx."*
- [x] `AuthProvider` + `ProtectedRoute`; admin routes lazy-loaded; `noindex`
- [x] Login with friendly errors
- [x] Videos: stats, search, filter, table, drag-reorder (persist `display_order`), toggle featured/published, edit/delete w/ confirm
- [x] Drawer: paste YouTube URL → auto ID + live preview + auto title slug
- [x] Messages inbox (unread dot, mark read, delete, reply-by-email link)
- [x] Settings form

## Phase 12 — Polish
**Prompt:** *"Do Phase 12 using docs/06-animation-spec.md and docs/09-qa-checklist.md."*
- [x] All animations per spec; `prefers-reduced-motion` honoured
- [x] `usePageMeta` on every page; OG image; robots + sitemap
- [x] Lighthouse, a11y, keyboard, no horizontal scroll at any width
- [x] Empty/loading/error states everywhere

## Phase 13 — Deploy
**Prompt:** *"Walk me through Phase 13 using docs/08-deploy-cloudflare.md. Do the code parts yourself, tell me exactly what to click for the rest."*
- [ ] Repo on GitHub → Cloudflare Pages connected → env vars set → live URL works (deep links like `/work` too)
- [ ] Keep-alive worker deployed (optional)
