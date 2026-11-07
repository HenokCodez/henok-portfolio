// workers/keepalive/src/index.ts — Cloudflare Worker (free) that pings Supabase every 3 days so the free project doesn't pause.
export interface Env { SUPABASE_URL: string; SUPABASE_ANON_KEY: string }

export default {
  async scheduled(_event: ScheduledController, env: Env): Promise<void> {
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/site_settings?select=id&limit=1`, {
      headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_ANON_KEY}` },
    });
    console.log('keepalive status', res.status);
  },
};
