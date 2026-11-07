# 02 · Design system (the law)

Files: `design/tokens/tokens.css` (CSS variables) and `design/tokens/tailwind.config.js`. Copy both into the project in Phase 1. **Never hard-code values that exist as tokens.**

## 1. Colour

| Token | Value | Use |
|---|---|---|
| `bg` | `#0A0A0B` | Page background |
| `surface` | `#111113` | Cards, panels |
| `surface-2` | `#18181B` | Hover/raised surface, table headers |
| `surface-3` | `#212125` | Inactive switch, timeline clips |
| `line` | `rgba(255,255,255,.10)` | Default 1px borders & dividers |
| `line-strong` | `rgba(255,255,255,.22)` | Outlined buttons, inputs, chips |
| `text` | `#F2F0EB` | Primary text (warm off-white — never pure white) |
| `muted` | `#8C8A85` | Secondary text |
| `faint` | `#55534F` | Labels, placeholders, disabled |
| `accent` | `#FF4D1F` | THE accent: serif words, primary CTA, active states, playhead |
| `accent-soft` | `rgba(255,77,31,.14)` | Tinted backgrounds, focus glow |
| `ok` | `#3DDC97` | "Available" dot ONLY |
| `danger` | `#FF5A5F` | Errors, delete |

Text on accent buttons is `#120400` (near-black). Text on `text`-coloured (white) pill buttons is `#0A0A0B`.

**Glow:** big soft radial gradients of `accent` at ~14–22% opacity behind the hero portrait and the bottom of the CTA section. Never any other hue.

**Thumbnail overlays:** every video card has a bottom gradient `linear-gradient(transparent, rgba(0,0,0,.7))` and a vignette + subtle film grain over the image.

## 2. Typography

Load from Google Fonts in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=Inter:wght@400;500;600&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display | Inter Tight | 800 | UPPERCASE, `letter-spacing:-0.045em`, `line-height:0.9` |
| Card titles / sub-heads | Inter Tight | 700 | Sentence case, `-0.02em` |
| Body | Inter | 400/500 | `16px/1.6`, `muted` colour for secondary copy |
| Accent word | Instrument Serif | italic 400 | lowercase, accent colour, `font-size: 1.02–1.04em` of its headline, `letter-spacing:-0.01em` |
| Labels / timecodes | JetBrains Mono | 500 | 11px, UPPERCASE, `letter-spacing:.14em`, `muted` |

### Type scale
| Name | Size (desktop → mobile) | Line height | Used for |
|---|---|---|---|
| `display-hero` | `clamp(120px, 24vw, 360px)` desktop / `29vw` mobile | 0.8 | Hero giant word only |
| `display-page` | `clamp(64px, 13vw, 200px)` | 0.85 | Page titles ("ALL work", "Let's talk.") |
| `h2` | `clamp(36px, 5.2vw, 76px)` | 0.95 | Section titles |
| `h3-list` | `clamp(24px, 3vw, 44px)` | 1 | List rows, services |
| `h3-card` | 22px (18px mobile) | 1.1 | Card titles |
| `lead` | `clamp(22px, 2.2vw, 32px)` | 1.3 | About lead paragraph |
| `body-l` | 18–20px | 1.55 | Intro paragraphs |
| `body` | 16px | 1.6 | Default |
| `small` | 14px | 1.5 | Meta |
| `label` | 11px mono | 1.2 | Labels |

## 3. Layout & spacing
- **Container:** `max-width: 1360px` + `40px` side padding (`20px` mobile) → class `container-x`.
- **Section padding:** `160px` top/bottom desktop, `96px` mobile (`py-section`).
- **Grid:** Home featured: 1 full-width card then 2-column grid, gap `24px`. Work page: 3 columns, gap `12px`. Mobile: always 1 column.
- **Spacing scale (px):** 4, 8, 12, 14, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 80, 96, 120, 160.
- **Radius:** cards `16px`; showreel `20px`; modal player `18px`; small thumbs `6–10px`; buttons/pills/chips `999px`; inputs `12px` (admin) or underline-only (contact).
- **Borders:** always 1px `line`.
- **Shadows:** almost none. Hover card = `0 0 0 1.5px accent` ring + `0 30px 60px -20px rgba(255,77,31,.35)`. Floating preview = `0 30px 70px rgba(0,0,0,.7)`.

## 4. Components (visual rules)

### Buttons (height / padding / font)
| Variant | Style |
|---|---|
| `solid` | bg `text`, color `#0A0A0B`, 1px border `text` |
| `accent` | bg `accent`, color `#120400`, border `accent` — **primary CTA, max one per view** |
| `ghost` | transparent, 1px `line-strong`, color `text` |
| Sizes | `sm` 36px / 16px pad / 13px · `md` 44px / 22px / 14px · `lg` 60px / 32px / 16px. Always `border-radius:999px`, weight 600, with `→` or `↗` arrows as text characters |
Hover: translateY(-2px) + for `ghost` fill becomes `surface-2`. Focus-visible: 2px accent outline, 3px offset.

### Chip (category tag)
Height 26px (38px in forms), px 12px, mono 10px uppercase, 1px `line-strong`, `background: rgba(10,10,11,.5)` + backdrop-blur 8px. `on` = bg `text`, color dark. `acc` = `accent-soft` bg, accent text, accent/50% border.

### Filter pill bar
Inline-flex, padding 5px, 1px `line-strong` border, bg `rgba(17,17,19,.85)` + blur 14px, radius 999px. Items: px 20 py 10, 13px 500. Active item = bg `text`, color dark. Sliding highlight uses `framer-motion` `layoutId="filter-pill"`.

### Video card
16:9, radius 16px, overflow hidden. Top-left mono `01 / 09`, top-right mono year (white 75%). Bottom overlay: chip above title (`h3-card`). Default: no play button. Hover: card scales 1.015 + accent ring + 3D tilt + play button (76px circle, bg `text`, dark ▶) fades/scales in at center.

### Section label
`[ 01 — Selected work ]` mono label, margin-bottom 18px, above every `h2`.

### Inputs
- Contact form: **underline only** (1px `line-strong`), 56px tall, 18px text, label above in mono. Focus: bottom border `accent`.
- Admin: boxed, 48px, radius 12px, bg `surface`, 1px `line-strong`. Focus: accent border + `0 0 0 3px accent-soft`.

### Switch (admin)
38×22 pill, off = `surface-3` with `muted` knob, on = `accent` with white knob.

## 5. Imagery
- Thumbnails: `https://i.ytimg.com/vi/<id>/maxresdefault.jpg`, fallback `hqdefault.jpg` on error. Admin may override with `thumbnail_url`.
- Always `loading="lazy"` (except the first featured card), fixed `aspect-ratio`, `object-fit: cover`.
- Film grain overlay: SVG feTurbulence noise at 9% opacity (see `.th::after` in `mock.css`) — implement once as a reusable `<Grain />` / CSS class.

## 6. Iconography
`lucide-react`, 18px, stroke 1.5. Arrow glyphs `→ ↗ ↓ ✕` may be plain text in buttons. Social icons: circular 32px outlined buttons.

## 7. Do / Don't
| Do | Don't |
|---|---|
| Huge type, lots of empty space | Cram sections |
| One accent colour | Gradients in other colours, purple/blue |
| Thin 1px lines | Heavy borders, drop shadows |
| Mono labels in brackets | Emoji, clip-art icons |
| Rounded 16px cards | Sharp or very round (>24px) cards |
