# 07 · Supabase setup (Henok does these clicks; the AI writes the code)

## Steps
1. Go to supabase.com → sign in with GitHub → **New project** (name `henok-portfolio`, pick the region closest to your visitors, save the DB password).
2. **SQL Editor → New query** → paste the whole of `snippets/schema.sql` → **Replace `YOUR_ADMIN_EMAIL`** with your real email (appears in the policies) → Run.
3. **Authentication → Providers → Email:** keep Email enabled, turn **"Allow new users to sign up" OFF**.
4. **Authentication → Users → Add user → Create new user:** your email + a strong password → tick "Auto confirm user".
5. **Project Settings → API:** copy **Project URL** and the **anon public** key into `.env.local`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
   ⚠️ Never copy the `service_role` key anywhere in this project.
6. Optional: load sample rows — `content/sample-videos.json` can be inserted from the Table Editor (or via the admin once built).

## Verify RLS (the AI must run these checks in Phase 10)
- Logged out: `select * from videos` returns **only** `published = true` rows.
- Logged out: inserting/updating/deleting a video **fails**.
- Logged out: inserting into `messages` works; selecting from `messages` returns **nothing**.
- Logged in as admin: all of the above allowed.

## Free-tier pausing — keep-alive (free)
Supabase free projects can be paused after about a week of inactivity. A visitor-less portfolio can hit that. Fix: a Cloudflare Worker with a cron trigger that pings the API every 3 days.
Code: `snippets/keepalive-worker.ts` + `snippets/wrangler.toml`. Deploy later (Phase 13) with `npx wrangler deploy`, and set secrets `SUPABASE_URL` and `SUPABASE_ANON_KEY` with `npx wrangler secret put …`.
(Alternative: a scheduled GitHub Action doing a `curl` to `$URL/rest/v1/videos?select=id&limit=1` with the apikey header.)

## Troubleshooting
| Symptom | Cause |
|---|---|
| Public pages show no videos | No rows with `published = true`, or RLS policy missing |
| Admin can't save | Email in policy ≠ login email, or not logged in |
| `JWT expired` | Sign out and in; ensure `autoRefreshToken` (default) is on |
| CORS error | Wrong project URL in `.env.local` |
