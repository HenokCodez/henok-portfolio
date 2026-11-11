-- ============================================================================
-- Henok portfolio — Supabase schema. Paste into Supabase → SQL Editor → Run.
-- Admin email is configured for: henokbinayew21@gmail.com
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------- helper: is the current user the admin? ----------
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'henokbinayew21@gmail.com';
$$;

-- ---------- videos ----------
create table if not exists public.videos (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null check (char_length(title) between 1 and 120),
  description    text check (char_length(description) <= 1000),
  youtube_id     text not null check (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  category       text not null check (category in ('Documentary','YouTube','Shorts','Commercials')),
  client         text,
  role           text,
  tools          text[] not null default '{}',
  year           int check (year between 2000 and 2100),
  thumbnail_url  text,
  featured       boolean not null default false,
  published      boolean not null default true,
  display_order  int not null default 0,
  created_at     timestamptz not null default now()
);
create index if not exists videos_order_idx on public.videos (display_order);

-- ---------- messages (contact form) ----------
create table if not exists public.messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 1 and 80),
  email         text not null check (char_length(email) <= 120 and email like '%_@_%._%'),
  project_type  text not null check (char_length(project_type) <= 40),
  budget        text check (char_length(budget) <= 40),
  message       text not null check (char_length(message) between 10 and 3000),
  read          boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ---------- site settings (single row, id = 1) ----------
create table if not exists public.site_settings (
  id                  int primary key default 1 check (id = 1),
  available           boolean not null default true,
  availability_text   text,
  email               text,
  showreel_youtube_id text check (showreel_youtube_id is null or showreel_youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  showreel_duration   text,
  showreel_poster_url text,
  booking_url         text,
  socials             jsonb not null default '{}'::jsonb
);
insert into public.site_settings (id, available, availability_text, email, showreel_youtube_id, showreel_duration)
values (1, true, 'Available for projects', 'henokbinayew21@gmail.com', 'aqz-KE-bpKQ', '01:48')
on conflict (id) do nothing;

-- ---------- Row Level Security ----------
alter table public.videos        enable row level security;
alter table public.messages      enable row level security;
alter table public.site_settings enable row level security;

-- videos: public sees published only; admin does everything
drop policy if exists "videos public read"  on public.videos;
drop policy if exists "videos admin write"  on public.videos;
create policy "videos public read" on public.videos
  for select using (published = true or public.is_admin());
create policy "videos admin write" on public.videos
  for all using (public.is_admin()) with check (public.is_admin());

-- messages: anyone may insert (validated by CHECKs); only admin reads/changes
drop policy if exists "messages public insert" on public.messages;
drop policy if exists "messages admin read"    on public.messages;
drop policy if exists "messages admin update"  on public.messages;
drop policy if exists "messages admin delete"  on public.messages;
create policy "messages public insert" on public.messages
  for insert to anon, authenticated with check ("read" = false);
create policy "messages admin read"   on public.messages for select using (public.is_admin());
create policy "messages admin update" on public.messages for update using (public.is_admin()) with check (public.is_admin());
create policy "messages admin delete" on public.messages for delete using (public.is_admin());

-- settings: public read; admin write
drop policy if exists "settings public read" on public.site_settings;
drop policy if exists "settings admin write" on public.site_settings;
create policy "settings public read" on public.site_settings for select using (true);
create policy "settings admin write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- OPTIONAL: sample rows (open-source films as placeholders) ----------
-- insert into public.videos (slug,title,description,youtube_id,category,client,role,tools,year,featured,published,display_order) values
-- ('the-last-harvest','The Last Harvest','Sample description.','aqz-KE-bpKQ','Documentary','Independent','Editor, Colour','{Premiere Pro,DaVinci Resolve}',2025,true,true,1);
