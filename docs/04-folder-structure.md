# 04 · Folder structure to create

Create the Vite project **in the root of this workspace** (next to `docs/`, `pages/`, etc. — do NOT nest it in a subfolder, and do NOT delete the kit folders).

```
/
├── AGENTS.md  GEMINI.md  README.md  .agent/  docs/  pages/  design/  snippets/  content/   ← kit (keep)
├── index.html
├── package.json  vite.config.ts  tsconfig.json  tailwind.config.js  postcss.config.js
├── .env.example  .gitignore
├── public/
│   ├── _redirects                 ← "/* /index.html 200"
│   ├── favicon.svg  robots.txt  sitemap.xml  og-image.jpg
│   └── images/portrait.png        ← provided by Henok
└── src/
    ├── main.tsx  App.tsx  index.css            ← index.css = tokens.css + Tailwind layers
    ├── config/site.ts                           ← imports content/site.config.json
    ├── lib/
    │   ├── supabase.ts   api.ts   youtube.ts   cn.ts   format.ts
    ├── types/index.ts                           ← Video, Message, SiteSettings, Category
    ├── hooks/
    │   ├── useVideos.ts  useSettings.ts  useAuth.ts
    │   ├── useTilt.ts  usePortraitLook.ts  useInView.ts  useCountUp.ts  usePageMeta.ts  useLocalTime.ts
    ├── components/
    │   ├── layout/   SiteLayout.tsx  Header.tsx  MobileMenu.tsx  Footer.tsx  AdminLayout.tsx
    │   ├── ui/       Button.tsx  Chip.tsx  SectionLabel.tsx  SectionHeading.tsx  Grain.tsx  Reveal.tsx  Marquee.tsx  Switch.tsx  Input.tsx
    │   ├── video/    VideoCard.tsx  VideoGrid.tsx  VideoList.tsx  VideoModal.tsx  YouTubePlayer.tsx  Thumbnail.tsx  FilterBar.tsx  ViewToggle.tsx
    │   ├── home/     Hero.tsx  HeroPortrait.tsx  SelectedWork.tsx  Showreel.tsx  Timeline.tsx  Services.tsx  Testimonials.tsx  AboutTeaser.tsx  CTASection.tsx
    │   ├── about/    Experience.tsx  Toolkit.tsx  Stats.tsx
    │   ├── contact/  ContactForm.tsx  ContactAside.tsx
    │   └── admin/    VideoTable.tsx  SortableRow.tsx  VideoDrawer.tsx  MessageList.tsx  StatCards.tsx  ProtectedRoute.tsx
    └── pages/
        ├── Home.tsx  Work.tsx  About.tsx  Contact.tsx  NotFound.tsx
        └── admin/ Login.tsx  Videos.tsx  Messages.tsx  Settings.tsx
```

## Install commands (Phase 1)
```bash
npm create vite@latest . -- --template react-ts     # choose "Ignore files and continue" if asked
npm i react-router-dom framer-motion lucide-react @supabase/supabase-js @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities clsx
npm i -D tailwindcss@3.4 postcss autoprefixer
npx tailwindcss init -p
```
**Pin Tailwind to v3.4.** Do not use Tailwind v4 (different config format).

## Naming
- Components: `PascalCase.tsx`; hooks: `useThing.ts`; utils: `camelCase.ts`.
- Tailwind class order: layout → spacing → typography → colour → effects.
- Use the `cn()` helper (clsx wrapper) for conditional classes.
