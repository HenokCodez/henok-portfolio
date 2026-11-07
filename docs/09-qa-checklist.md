# 09 · QA checklist (tick before calling it done)

## Visual fidelity
- [x] Each page compared side-by-side with its mockup at **1440px** and **390px**
- [x] Only the 4 specified fonts; display headlines uppercase 800 with ONE serif accent word
- [x] Only the accent colour `#FF4D1F` (+ green dot); no stray hex values (`grep -rn "#[0-9a-fA-F]\{3,6\}" src` should find nothing outside config)
- [x] Spacing: section padding 160/96, side padding 40/20, container 1360
- [x] Cards radius 16, 1px borders, no heavy shadows

## Responsive
- [x] No horizontal scroll at 320 / 390 / 768 / 1024 / 1440 / 1920
- [x] Tap targets ≥ 44px on mobile
- [x] Hero readable on a 320×568 screen; giant word never clipped
- [x] Filter bar scrolls horizontally on mobile instead of wrapping awkwardly

## Interaction
- [x] Portrait follows cursor on desktop; gentle sway on touch
- [x] Card tilt only on hover-capable pointers
- [x] Modal: ESC, scrim click, ✕, ←/→, focus trap, focus returns to the card, scroll lock, playback stops on close
- [x] Deep link `/work?v=<slug>` opens the modal on load; invalid slug just shows the grid
- [x] Filters + view toggle work and persist across reloads (try/catch around `localStorage`)
- [x] `prefers-reduced-motion` disables parallax/tilt/marquee

## Data & security
- [x] Logged-out user cannot see unpublished videos or messages (test in browser console)
- [x] Admin routes redirect to `/admin/login` when logged out
- [x] Contact form: required validation, email format, honeypot, max lengths, success + error states, double-submit prevented
- [x] No service-role key anywhere (`grep -rni "service_role" .`)
- [x] `.env.local` in `.gitignore`

## Accessibility
- [x] One `<h1>` per page; landmarks (`header`, `nav`, `main`, `footer`)
- [x] All images have `alt`; icon buttons have `aria-label`
- [x] Text contrast ≥ 4.5:1 (muted `#8C8A85` on bg passes; `faint` is for decoration/labels only, never for required reading text)
- [x] Visible focus ring everywhere; modal has `role="dialog" aria-modal="true" aria-labelledby`

## Performance & SEO
- [x] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, SEO ≥ 95 on Home and Work
- [x] No YouTube iframe in the DOM before click
- [x] Unique `<title>` + meta description per page; OG tags; favicon; robots; sitemap
- [x] Admin chunk lazy-loaded (not in main bundle)

## Build
- [x] `npm run build` passes, zero TS errors, no `any`, no `console.log` left
- [x] Deep links work on the deployed URL
