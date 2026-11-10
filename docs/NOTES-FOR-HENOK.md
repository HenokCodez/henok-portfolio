# Notes for Henok
The AI appends questions, conflicts and improvement ideas here instead of changing the design.

- **Phase 1 done:** Scaffold, tokens, Tailwind v3.4, Google Fonts, base directory structure, test page.
- **Phase 2 done:** Layout shell (Header with live Addis clock & scroll effects, MobileMenu with fullscreen clip-path reveal, Footer with giant faded wordmark, SiteLayout, AdminLayout, and core UI components).
- **Phase 3 done:** Data layer with offline fallback, null-safe client, useVideos/useSettings/useTilt hooks, Thumbnail with fallback/shimmer/grain, and interactive 3D-tilting VideoCard.
- **Phase 4 done:** Home page fully implemented ([1]–[15]) with cursor-following portrait, 24fps timecode, marquee, featured videos grid, interactive showreel with timeline playhead, services hover states, testimonials, about teaser with animated stats, and glowing CTA.
- **Phase 5 done:** Work page with animated sliding FilterBar, persisted GRID/LIST ViewToggle, 3-column VideoGrid, interactive VideoList with cursor-following floating preview, and ?cat= URL sync.
- **Phase 6 done:** Project player modal with on-demand YouTube player (no iframe until click), scroll lock, focus trap, Prev/Next navigation with arrow keys, metadata strip, description, and "More work" row.
- **Phase 7, 8, 9 done:** About page with sticky desktop portrait, Toolkit cards, and Experience rows; Contact page with validated underline form, accessible radio chips, honeypot anti-spam, aside cards with live clock, and success card; 404 page with 4[0]4 display and noindex tag.
- **Phase 10 done (Fallback active):** Full Supabase API integration with RLS checks coded in `src/lib/api.ts` and `src/lib/supabase.ts`. Because `.env.local` is not yet configured, the site currently runs seamlessly in offline fallback mode using `content/sample-videos.json` and local storage.
  - **Action required by Henok:**
    1. Create a Supabase project at [supabase.com](https://supabase.com).
    2. Open SQL Editor, paste `snippets/schema.sql`, replace `YOUR_ADMIN_EMAIL` with your admin email, and run it.
    3. Under Auth -> Users, create your admin user with that email. Under Auth -> Providers -> Email, turn "Allow new users to sign up" OFF.
    4. Copy your Project URL and anon public key into a new `.env.local` file:
       ```env
       VITE_SUPABASE_URL=https://your-project.supabase.co
       VITE_SUPABASE_ANON_KEY=your-anon-key
       ```
    5. Restart the dev server (`npm run dev`) and live Supabase queries will instantly take over.
- **Phase 11 done:** Admin console fully implemented (`/admin/login`, `/admin` videos table with dnd-kit drag-reorder, `VideoDrawer` with auto YouTube ID detection & in-place preview, `/admin/messages` split inbox, and `/admin/settings`). In fallback mode, displays an offline banner and permits local demo login.
- **Phase 12 done & QA Checklist verified:** Full polish pass completed. Verified all 06 animation specs, `prefers-reduced-motion` compliance, keyboard focus trapping & navigation, metadata hooks, OpenGraph & SEO tags, sitemap.xml, noindex on admin/404, responsive layouts from 320px to 1920px with zero horizontal scroll, and zero build/type errors.

- **Showreel section fix:** Reworked `Showreel.tsx` and `Timeline.tsx` per Henok's feedback (was too big/confusing on scroll). Frame now 21/9 with max-height `min(520px, 68vh)`, dark gradient overlay + grain, 76px play button + "Play showreel" pill, whole frame is one button opening the modal (no iframe in page). Timeline made small & decorative (10px tracks, hidden on mobile). Also capped first featured card in SelectedWork to same max-height to prevent 80%+ viewport blocks.
