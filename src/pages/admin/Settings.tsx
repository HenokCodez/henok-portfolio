import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { parseYouTubeId, thumbnailUrl } from '../../lib/youtube';
import { Switch } from '../../components/ui/Switch';
import { Button } from '../../components/ui/Button';
import type { SiteSettings } from '../../types';

export default function Settings() {
  const { session, signOut } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Settings — Henok Admin';
    async function load() {
      try {
        setLoading(true);
        const data = await getSettings();
        setSettings(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    try {
      setSaving(true);
      const updated = await updateSettings(settings);
      setSettings(updated);
      showToast('Settings saved successfully.');
    } catch {
      showToast('Error saving settings.');
    } finally {
      setSaving(false);
    }
  }

  const detectedShowreelId = settings?.showreel_youtube_id
    ? parseYouTubeId(settings.showreel_youtube_id)
    : null;

  return (
    <div className="space-y-8 max-w-[720px]">
      <div>
        <h1 className="font-display font-extrabold uppercase text-3xl sm:text-[34px] tracking-tight leading-none text-text">
          SETTINGS
        </h1>
        <p className="font-mono text-xs text-muted uppercase tracking-mono mt-1.5">
          Global site metadata, contact details, and showreel configuration
        </p>
      </div>

      {loading ? (
        <div className="p-12 rounded-card bg-surface border border-line text-center font-mono text-sm text-muted">
          Loading settings…
        </div>
      ) : settings ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Settings Card */}
          <div className="p-6 sm:p-8 rounded-card bg-surface border border-line space-y-6">
            {/* Availability Switch */}
            <div className="flex items-center justify-between pb-5 border-b border-line">
              <div className="space-y-0.5">
                <span className="font-display font-semibold text-base text-text block">
                  Available for projects
                </span>
                <span className="font-mono text-xs text-muted block">
                  Toggles the green status indicator across the entire website
                </span>
              </div>
              <Switch
                checked={settings.available}
                onChange={(checked) =>
                  setSettings({ ...settings, available: checked })
                }
              />
            </div>

            {/* Availability Text */}
            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-mono text-muted">
                Availability status text
              </label>
              <input
                type="text"
                value={settings.availability_text || ''}
                onChange={(e) =>
                  setSettings({ ...settings, availability_text: e.target.value })
                }
                placeholder="Booking projects for November 2026"
                className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-line-strong text-sm text-text placeholder:text-faint focus:outline-none focus:border-accent"
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-mono text-muted">
                Contact email
              </label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                placeholder="hello@henok.studio"
                className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-line-strong text-sm text-text placeholder:text-faint focus:outline-none focus:border-accent"
              />
            </div>

            {/* Showreel YouTube ID & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3.5">
              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] uppercase tracking-mono text-muted">
                  Showreel YouTube URL or ID
                </label>
                <input
                  type="text"
                  value={settings.showreel_youtube_id || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      showreel_youtube_id: e.target.value,
                    })
                  }
                  placeholder="aqz-KE-bpKQ"
                  className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-line-strong text-sm text-text placeholder:text-faint focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] uppercase tracking-mono text-muted">
                  Duration
                </label>
                <input
                  type="text"
                  value={settings.showreel_duration || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      showreel_duration: e.target.value,
                    })
                  }
                  placeholder="01:48"
                  className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-line-strong text-sm text-text focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {detectedShowreelId && (
              <div className="p-3 rounded-xl bg-surface-2 border border-line flex items-center gap-3">
                <img
                  src={thumbnailUrl(detectedShowreelId, 'hqdefault')}
                  alt="Showreel preview"
                  className="w-24 aspect-video rounded-md object-cover"
                />
                <span className="font-mono text-xs text-ok">
                  Detected ID: {detectedShowreelId}
                </span>
              </div>
            )}

            {/* Social Links */}
            <div className="pt-4 border-t border-line space-y-3.5">
              <span className="block font-mono text-[11px] uppercase tracking-mono text-muted">
                Social links (leave empty to hide on public site)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="url"
                  value={settings.socials?.youtube || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socials: { ...settings.socials, youtube: e.target.value },
                    })
                  }
                  placeholder="YouTube URL"
                  className="h-11 px-3.5 rounded-xl bg-surface-2 border border-line-strong text-sm text-text focus:outline-none focus:border-accent"
                />

                <input
                  type="url"
                  value={settings.socials?.instagram || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socials: { ...settings.socials, instagram: e.target.value },
                    })
                  }
                  placeholder="Instagram URL"
                  className="h-11 px-3.5 rounded-xl bg-surface-2 border border-line-strong text-sm text-text focus:outline-none focus:border-accent"
                />

                <input
                  type="url"
                  value={settings.socials?.linkedin || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socials: { ...settings.socials, linkedin: e.target.value },
                    })
                  }
                  placeholder="LinkedIn URL"
                  className="h-11 px-3.5 rounded-xl bg-surface-2 border border-line-strong text-sm text-text focus:outline-none focus:border-accent"
                />

                <input
                  type="url"
                  value={settings.socials?.telegram || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socials: { ...settings.socials, telegram: e.target.value },
                    })
                  }
                  placeholder="Telegram URL"
                  className="h-11 px-3.5 rounded-xl bg-surface-2 border border-line-strong text-sm text-text focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Booking URL */}
            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-mono text-muted">
                Booking link (Cal.com / Calendly)
              </label>
              <input
                type="url"
                value={settings.booking_url || ''}
                onChange={(e) =>
                  setSettings({ ...settings, booking_url: e.target.value })
                }
                placeholder="https://cal.com/henok/intro"
                className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-line-strong text-sm text-text placeholder:text-faint focus:outline-none focus:border-accent"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="accent"
                size="md"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save settings'}
              </Button>
            </div>
          </div>

          {/* Account & Sign Out Card */}
          <div className="p-6 rounded-card bg-surface border border-line flex items-center justify-between">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-mono text-muted block">
                Logged in as
              </span>
              <span className="font-display font-semibold text-text text-sm block mt-0.5">
                {session?.user?.email || 'admin@henok.studio (Demo)'}
              </span>
            </div>
            <Button
              type="button"
              onClick={() => signOut()}
              variant="ghost"
              size="sm"
            >
              Sign out
            </Button>
          </div>
        </form>
      ) : null}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-surface-2 border border-line-strong shadow-2xl text-text font-mono text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
