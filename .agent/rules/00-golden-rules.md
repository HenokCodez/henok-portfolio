# AGENTS.md — READ THIS FIRST, EVERY SESSION

You are building a **cinematic video-editor portfolio website** for **Henok**.
All design decisions have ALREADY been made. Your job is to **implement them exactly**, not to redesign them.

> If anything in this file conflicts with your own habits or defaults, **this file wins**.
> If something is not specified anywhere in this kit, **ask Henok**. Do not guess, do not invent.

---

## 0. The 60-second summary

| Thing | Decision |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS **v3.4** |
| Routing | `react-router-dom` v6 |
| Animation | `framer-motion` |
| Icons | `lucide-react` |
| Drag & drop (admin) | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Backend / DB / Auth | Supabase (`@supabase/supabase-js`) |
| Video | YouTube embeds (IFrame), loaded **only on click** |
| Hosting | Cloudflare Pages (SPA) |
| Look | Near-black, warm off-white text, ONE accent colour (ember orange `#FF4D1F`), huge tight type, italic serif accent words |
| Pages | Home, Work (grid + list), Project modal, About, Contact, 404, Admin (login, videos, drawer, messages, settings) |

---

## 1. Reading order (do this before writing any code)

1. `README.md`
2. `docs/01-project-brief.md`
3. `docs/02-design-system.md`  ← colours, fonts, sizes, spacing. Memorise it.
4. `docs/03-architecture.md`
5. `docs/05-build-order.md`  ← you will work **phase by phase** from this file
6. The page spec in `pages/` for the phase you are on
7. **OPEN AND LOOK AT the mockup images** listed at the top of that page spec (see §3)

---

## 2. GOLDEN RULES (violating any of these is a bug)

### Design rules
1. **Never invent colours.** Use only the tokens in `design/tokens/tokens.css` / `tailwind.config.js`. No raw hex values inside components.
2. **Never invent fonts.** Only: `Inter Tight` (display), `Inter` (body), `Instrument Serif` italic (accent words), `JetBrains Mono` (labels/timecodes).
3. **Display headlines are UPPERCASE, weight 800, letter-spacing `-0.045em`, line-height `0.9`.** The *one* accent word in a headline is lowercase `Instrument Serif` italic in the accent colour. Example: `SELECTED <em>work</em>`.
4. **There is exactly ONE accent colour.** Never add blue, purple, green gradients, etc. (The small green "available" dot is the only other colour.)
5. **Dark theme only.** Do not build a light mode.
6. **Do not use stock UI-kit looks.** No default Tailwind blue buttons, no shadcn defaults, no Material look, no emoji as icons.
7. Spacing comes from the scale in the design system. Section vertical padding: **160px desktop / 96px mobile**. Page side padding: **40px desktop / 20px mobile**. Max content width **1360px**.
8. Every page must match its mockup **at 1440px wide and at 390px wide**. Layout, order of sections, proportions, alignment.
9. Never use lorem ipsum or "Welcome to my website". Copy lives in `docs/10-content-and-copy.md` and `content/`.

### Code rules
10. TypeScript, **no `any`**. Components are function components with typed props.
11. **One component per file**, PascalCase filename. Keep files under ~250 lines; split if bigger.
12. Folder structure must follow `docs/04-folder-structure.md` exactly.
13. No inline `style={{}}` for static styling — use Tailwind classes (inline style only for dynamic values like motion values).
14. Do **not** add libraries that are not listed in §0. Ask first.
15. Never put the Supabase **service-role** key anywhere. Only the **anon** key goes in the frontend, via `VITE_` env vars.
16. Never load a YouTube iframe on page load. Show the thumbnail; mount the iframe only after click.
17. All images need `alt`. All icon-only buttons need `aria-label`. Everything interactive must be keyboard reachable with a visible focus ring (accent colour).
18. Respect `prefers-reduced-motion`: disable parallax, tilt, marquee, and large reveals.
19. Data comes from Supabase **through `src/lib/api.ts` only**. If Supabase env vars are missing, fall back to `content/sample-videos.json` (see `docs/03-architecture.md`).

### Process rules
20. **Work one phase at a time** (`docs/05-build-order.md`). After each phase: run `npm run build` (must pass with zero errors), run the dev server, and **compare your result to the mockup**. Fix differences before moving on.
21. When you finish a phase, tick its checklist in `docs/05-build-order.md` and tell Henok what to look at.
22. If a mockup and a written spec ever disagree, **the written spec wins on numbers; the mockup wins on layout/proportion**. Mention the conflict to Henok.
23. Do not "improve" the design. If you think something could be better, write it in `docs/NOTES-FOR-HENOK.md` instead of changing it.
24. Do not delete or rewrite anything inside `design/` or `docs/` (except ticking checkboxes and `NOTES-FOR-HENOK.md`).

---

## 3. How to use the mockup images

Each page spec starts with a **Mockups** table. For every page you MUST:

1. **Open the desktop PNG** (`design/mockups/desktop/<page>.png`) and look at it.
2. **Open the annotated PNG** (`design/mockups/desktop-annotated/<page>.png`). Cyan dashed boxes with numbers mark each section. The numbers match the numbered sections in the page spec (`[1]`, `[2]`, …).
3. **Open the mobile PNG** (`design/mockups/mobile/<page>.png`).
4. **Read the mockup HTML** (`design/mockups/html/<page>.html` + `mock.css`). It contains exact sizes, spacing and structure. You may copy structure and CSS values and translate them to Tailwind. Do **not** ship the mockup HTML itself.
5. The mockups use **placeholder gradients** for video thumbnails and a **stand-in cartoon** for the portrait. Real thumbnails come from YouTube; the real portrait is `public/images/portrait.png`.

> The mockup renderer was offline, so it used stand-in fonts. **Use the real fonts listed above**, not the stand-ins.

Reference screenshots from websites Henok likes are in `design/references/` with notes in `design/references/REFERENCE-NOTES.md`. They show the *feel*. **Do not copy them** — the mockups are the layouts to build.

---

## 4. Definition of done (for the whole project)

- [ ] All pages in `pages/` implemented and visually match mockups at 1440 and 390.
- [ ] `npm run build` passes with no TypeScript or ESLint errors.
- [ ] Lighthouse (mobile) ≥ 90 Performance, ≥ 95 Accessibility, ≥ 95 SEO on Home and Work.
- [ ] No horizontal scroll at 320px, 390px, 768px, 1024px, 1440px, 1920px.
- [ ] YouTube iframes only load after click; modal closing stops playback.
- [ ] Admin routes are protected; RLS verified (anonymous users cannot write or read hidden videos).
- [ ] `docs/09-qa-checklist.md` fully ticked.
- [ ] Deployed on Cloudflare Pages following `docs/08-deploy-cloudflare.md`.
