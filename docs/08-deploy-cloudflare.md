# 08 · Deploy to Cloudflare Pages (free)

## One-time
1. Push the project to a **GitHub repo** (AI can do `git init`, commit; Henok creates the empty repo on github.com and adds the remote).
2. cloudflare.com → sign up → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings:
   | Field | Value |
   |---|---|
   | Framework preset | Vite (or None) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | set env var `NODE_VERSION` = `20` |
4. **Environment variables (Production + Preview):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
5. Deploy. Every `git push` to `main` redeploys automatically.

## SPA routing
`public/_redirects` containing exactly `/* /index.html 200` makes deep links (`/work`, `/admin`) work. Verify by opening `/work` directly in a new tab on the live URL.

## Custom domain (optional)
Pages project → Custom domains → add. Cloudflare-managed DNS makes it automatic.

## Security headers (optional, recommended)
`public/_headers`:
```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
/admin/*
  X-Robots-Tag: noindex
```
(Do not add a strict CSP without testing: YouTube iframes and Google Fonts must stay allowed — `frame-src https://www.youtube.com https://www.youtube-nocookie.com; font-src https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`.)

## Keep-alive worker (optional)
See `docs/07-supabase-setup.md`.

## After deploy checklist
- [ ] Home, `/work`, `/about`, `/contact` load directly
- [ ] A video opens in the modal and plays
- [ ] Contact form submission appears in admin Messages
- [ ] `/admin` redirects to login when logged out
- [ ] Share link on WhatsApp/Telegram shows the OG image & title
- [ ] Re-check free-tier limits on Cloudflare and Supabase pricing pages (limits change)
