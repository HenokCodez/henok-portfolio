# 01 · Project brief

## Who & what
**Henok** is a video editor and visual storyteller. This site is his portfolio: it must make clients *want to watch his work* and then *contact him*.

## Goals (in priority order)
1. Make the work look premium and cinematic — big thumbnails, dark canvas, restrained UI.
2. Let visitors **watch videos without leaving the site** (modal player, YouTube embed).
3. Make contacting Henok effortless (CTA on every page, simple form).
4. Let Henok **add / edit / hide / reorder videos himself** from `/admin` without redeploying.
5. Cost **$0** on free tiers; load fast on mobile and slow networks.

## Audience
Creators, agencies, brands and filmmakers hiring an editor. They skim fast, judge on feel in 5 seconds, and mostly browse on phones.

## Personality of the site
Cinematic · confident · minimal · editorial · a little playful (the portrait follows your cursor). Think "film title card", not "template".

## Signature ideas (use consistently)
- **Timecode motif:** mono-font labels such as `00:00:12:04`, `REC` dot, `01 / 09` counters, `[ 01 — Selected work ]` section labels.
- **Timeline motif:** the showreel section has a fake editor timeline with V2 / V1 / A1 tracks and an orange playhead.
- **Serif accent word:** every big headline has exactly one lowercase italic serif word in the accent colour.
- **Cursor-following portrait** in the hero.
- **Tilting cards** with a play button that appears on hover.

## Scope
**In scope (v1):** Home, Work (grid + list + category filter), project modal, About, Contact (form saved to Supabase), 404, Admin (login, videos CRUD + reorder + featured + publish, messages inbox, site settings).

**Out of scope (v1) — do NOT build:** blog, e-commerce, multi-language, dark/light toggle, user accounts for visitors, comments, video uploads (YouTube hosts the videos), analytics dashboards, custom cursor, WebGL/Three.js.

## Reference sites Henok likes (see `design/references/`)
| # | Site | What to take |
|---|---|---|
| 1 | Filippos Tsapekis | Huge condensed-feeling headline, small uppercase sub-lines, edge-to-edge dark cards |
| 2 | Kumar Abhishek | 3D character in the center, text either side, soft coloured glow behind it, vertical social icons |
| 3 | Raphaël Bourdin | "ALL WORK" page title, 2-up large cards, floating pill filter bar |
| 4 | Hovig Hagopian | Dense cinematic grid, GRID / LIST toggle, tiny mono labels |

## Success looks like
A visitor lands, sees the hero, scrolls, clicks a video, watches it in the modal, clicks "Let's talk" — all without friction on a phone.
