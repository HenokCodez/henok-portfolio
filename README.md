# Henok — Video Editor Portfolio · Starter Kit

A complete design + build kit for a cinematic, interactive video-editing portfolio.
Open this folder in **Anti-gravity** and let Gemini build the site by following the files.

**Stack:** React + Vite + TypeScript + Tailwind v3 · Framer Motion · Supabase (DB + Auth) · YouTube embeds · Cloudflare Pages (free).

---

## What's in this folder

```
henok-portfolio-kit/
├── AGENTS.md                ← strict rules for the AI (also copied to GEMINI.md and .agent/rules/)
├── GEMINI.md                ← same rules (some tools look for this name)
├── README.md                ← you are here
├── .agent/
│   ├── rules/00-golden-rules.md        ← same rules, in Anti-gravity's rules folder
│   └── workflows/build-phase.md        ← reusable "build the next phase" workflow
├── docs/                    ← the guide (brief, design system, architecture, build order, …)
├── pages/                   ← one spec per page, section by section, with mockup links
├── design/
│   ├── mockups/
│   │   ├── desktop/         ← clean desktop layout image for every page
│   │   ├── desktop-annotated/ ← same, with numbered cyan boxes matching the specs
│   │   ├── mobile/          ← mobile layout image for every page
│   │   └── html/            ← the mockups as HTML+CSS (exact spacing & sizes)
│   ├── references/          ← the 4 inspiration screenshots + notes on what to take from each
│   └── tokens/              ← tokens.css + tailwind.config.js (copy into the project)
├── public-templates/        ← _redirects, _headers, robots.txt, .env.example → copy into the project
├── snippets/                ← tricky code already written (SQL, Supabase client, tilt hook, modal…)
└── content/                 ← site.config.json + sample-videos.json (works without Supabase)
```

---

## How to use it (step by step)

1. **Unzip** and open the folder in Anti-gravity as the workspace.
2. In the agent chat, paste this **starter prompt**:

   ```text
   Read AGENTS.md completely, then README.md, then docs/01 to docs/05 in order.
   Do not write code yet. Reply with: (a) a 10-line summary of the design system,
   (b) the list of phases from docs/05-build-order.md, (c) anything unclear.
   ```
3. When it answers correctly, paste the **phase prompt** from `docs/05-build-order.md` for **Phase 1**. Wait until it finishes and shows you the result. Check it against the mockup yourself. Then Phase 2, and so on.
4. **One phase per conversation turn.** Don't ask it to build everything at once — older models drift on long tasks.
5. If it drifts, paste: *"Stop. Re-read AGENTS.md and pages/<page>.md. Open the mockup image and compare. List every difference, then fix them."*

## Things YOU must provide (the AI cannot make these)

| Asset | Where it goes | Notes |
|---|---|---|
| Portrait with transparent background | `public/images/portrait.png` | ~1200×1500 PNG, head & shoulders, good light. Optional layered version — see `pages/home.md` §[5]. A placeholder SVG is used until it exists. |
| Showreel YouTube ID | Admin → Settings (or `content/site.config.json`) | 11-character ID |
| Your videos | Admin → Videos (or `content/sample-videos.json` for dev) | Sample file uses open-source films as placeholders |
| Your real name, email, socials, location | `content/site.config.json` | Mockups show placeholders (`hello@henok.studio`, "Based in Ethiopia"…). Replace with the truth. |
| Testimonials, experience, stats | `content/site.config.json` | Mockups show placeholders — replace with real ones or remove the section |
| Supabase project + keys | `.env.local` | Follow `docs/07-supabase-setup.md` |
| Cloudflare + GitHub accounts | — | Follow `docs/08-deploy-cloudflare.md` |

## Design in one paragraph

Near-black canvas (`#0A0A0B`), warm off-white text, one ember-orange accent. Enormous tight uppercase headlines with a single lowercase **italic serif** word for contrast ("I turn ideas into *stories*."). A hero with a portrait that follows the cursor, a film-timeline motif (timecodes, REC dot, V1/V2/A1 tracks), cinematic thumbnail cards that tilt on hover, and an in-page player modal so visitors never leave the site.

## Pages

| Route | Spec | Mockup |
|---|---|---|
| `/` | `pages/home.md` | `home.png` |
| `/work` (grid & list) | `pages/work.md` | `work-grid.png`, `work-list.png` |
| `/work?v=<slug>` (modal) | `pages/project-modal.md` | `project-modal.png` |
| `/about` | `pages/about.md` | `about.png` |
| `/contact` | `pages/contact.md` | `contact.png` |
| `*` | `pages/not-found.md` | `not-found.png` |
| `/admin/login` | `pages/admin-login.md` | `admin-login.png` |
| `/admin` | `pages/admin-videos.md` | `admin-videos.png` |
| `/admin` (drawer) | `pages/admin-video-drawer.md` | `admin-video-drawer.png` |
| `/admin/messages` | `pages/admin-messages.md` | `admin-messages.png` |
| `/admin/settings` | `pages/admin-settings.md` | (reuses drawer form style) |

## Honest notes

- Mockups use **placeholder gradients and a cartoon stand-in portrait** — they show layout, not final imagery.
- Mockups were rendered with stand-in fonts (offline renderer). The real fonts load from Google Fonts in the project.
- Free-tier limits: Supabase free projects **pause after ~1 week of inactivity** — `docs/07-supabase-setup.md` includes a free keep-alive. Check current limits on each provider's pricing page before launch.
- Anti-gravity picks up `AGENTS.md`/`GEMINI.md` and `.agent/` files; if your version doesn't auto-load them, the starter prompt above makes it read them explicitly.
