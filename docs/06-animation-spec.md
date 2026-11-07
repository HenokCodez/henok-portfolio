# 06 · Animation & interaction spec

Library: `framer-motion`. Default easing everywhere: `[0.16, 1, 0.3, 1]` (called **ease-out-expo-ish**; CSS var `--ease-out`). **Never** use bouncy springs except where stated. If `useReducedMotion()` is true: no parallax/tilt/marquee/reveal-translate; use opacity-only fades ≤ 200ms.

| # | Interaction | Exact behaviour |
|---|---|---|
| A1 | **Scroll reveal** (`<Reveal>`) | `initial {opacity:0, y:40}` → `{opacity:1, y:0}`; `duration .8`; `once:true`; `viewport margin: "-80px"`. Optional `delay` prop. Stagger children by `0.08s`. |
| A2 | **Hero load sequence** | On mount: header fades in (0s) → intro line (0.1s, y 20) → giant word "stories." rises from `y:60%` clip-masked, `duration 1.1` (0.2s delay) → portrait fades+scales from `0.96` (0.4s) → side blocks (0.7s) → footer row (0.9s). |
| A3 | **Portrait follows cursor** (desktop pointer only) | See `snippets/usePortraitLook.ts`. Mouse position normalised to −1…1 across the hero. Layers: head `rotateY = x*8°`, `rotateX = −y*5°`, `translate = x*10px, y*6px`; body `translate = x*4px`; glow `translate = x*−24px, y*−16px`. Eyes/pupils (if present): `translate = x*5px, y*3px`. Smooth with `useSpring({stiffness:120, damping:18, mass:.4})`. On touch devices: gentle auto-sway loop (rotateY ±4°, 6s, ease-in-out, infinite). When pointer leaves hero → spring back to 0. |
| A4 | **Giant word parallax** | The "stories." word moves `y = scrollY * −0.12` while hero is in view. |
| A5 | **Card tilt** (`useTilt`) | On pointer move over a card: `rotateY = x*6°`, `rotateX = −y*6°`, `scale 1.015`, `perspective 1000px`. Spring `{stiffness:150, damping:15}`. On leave → 0. Play button: `opacity 0→1`, `scale .7→1`, `0.3s`. Accent ring fades in `0.3s`. Title block `translateY(0)`; others unchanged. Disabled on touch & reduced-motion. |
| A6 | **Marquee** | CSS `animation: marquee 40s linear infinite` on a track containing the items **twice**; pauses on hover; reduced-motion → static. |
| A7 | **Timeline playhead** (showreel) | Orange playhead moves left→right across the 3 tracks over `8s`, loops, only while section is in view. Mono timecode `00:00:12:04` in hero footer increments (frames at 24fps) — use `requestAnimationFrame`, pause when tab hidden. |
| A8 | **Counters** | Numbers count `0 → n` over `1.6s` with ease-out when scrolled into view, once. Suffix `+` appears at end. |
| A9 | **Services row hover** | Row bg gradient `linear-gradient(90deg, accent-soft, transparent)` fades in `0.3s`; title turns accent; arrow circle fills accent and rotates 45°; row content shifts right `12px`. |
| A10 | **Filter change** | Pill highlight slides (`layoutId="filter-pill"`, spring `{stiffness:400, damping:34}`); cards exit `opacity 0, scale .96, 0.2s`, enter staggered `0.05s`; grid uses `layout` so remaining cards glide. |
| A11 | **List row hover** | Row bg gradient as A9; title accent; floating preview thumbnail (340px wide, rotate 3°) follows cursor with spring `{stiffness:200, damping:25}`, offset `(+40px, −50%)`, fades in 0.2s; hidden on touch. |
| A12 | **Modal** | Scrim `opacity 0→1 .3s`. Panel `opacity 0, y 24, scale .98` → `1` in `.4s`. Close reverses in `.25s`. Next/Prev: content cross-fades `.25s`. |
| A13 | **Page transition** | `AnimatePresence mode="wait"` on routes: `opacity 0→1`, `y 12→0`, `0.4s`; exit `opacity 0`, `0.2s`. Scroll to top on route change. |
| A14 | **Buttons** | Hover: `translateY(-2px)` `0.25s`. Arrow glyph shifts `4px` right. Active: `scale .98`. |
| A15 | **Header** | Hides on scroll down (translateY −100%), shows on scroll up, after 200px scrolled. Gets blur + `bg-bg/70` after 40px. |
| A16 | **Mobile menu** | Overlay slides from top (`clip-path` inset(0 0 100% 0) → inset(0)), `0.5s`; links stagger up `0.06s` apart. |
| A17 | **CTA glow** | Radial accent glow slowly breathes: opacity .6↔1, 6s, infinite. |
| A18 | **"Available" dot** | CSS `pulse-dot` 2s infinite. |
| A19 | **Admin** | No fancy motion: drawer slides from right `0.3s`; row drag uses dnd-kit default with `opacity .6` + accent outline while dragging. |

## Do-nots
- No auto-playing videos on the landing page.
- No scroll-jacking / smooth-scroll libraries.
- No animation longer than 1.2s (except marquee, glow, playhead).
- No animating `width/height/top/left` — only `transform` and `opacity` (and `clip-path`).
