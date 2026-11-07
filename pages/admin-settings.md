# Page spec · ADMIN · SETTINGS  `/admin/settings`

File: `pages/admin/Settings.tsx`. **No dedicated mockup** — reuse the look of `design/mockups/desktop/admin-video-drawer.png` (boxed inputs, mono labels, switches) inside a single card on the `AdminLayout`.

## Layout
`h1` **SETTINGS**. One card (`surface`, 1px `line`, radius 16, padding 28, max-width 720px, `display:grid; gap:22px`).

## Fields → `site_settings` row `id = 1`
| Field | Control | Notes |
|---|---|---|
| Available for projects | Switch | Controls green/muted dot site-wide |
| Availability text | Input | e.g. `Booking projects for November 2026` (empty → auto "Available — <Month YYYY>") |
| Contact email | Input (email) | Used by CTA + contact page |
| Showreel YouTube URL or ID | Input + small preview | Parsed with `parseYouTubeId` |
| Showreel duration label | Input | e.g. `01:48` |
| Social links | 4 inputs: YouTube, Instagram, LinkedIn, Telegram | Empty = hidden on site |
| Booking link (Cal.com / Calendly) | Input (url) | Empty = "Book a call" hidden |

Footer of card: accent **Save settings** button; toast `Settings saved`. Public site reads settings through `useSettings` (cache 5 min in memory).

## Account block (second card)
Shows the logged-in email and a ghost button **Sign out**.
