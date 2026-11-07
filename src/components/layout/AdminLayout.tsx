import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Film, Mail, Settings as SettingsIcon, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getMessages } from '../../lib/api';
import { isSupabaseConfigured } from '../../lib/supabase';
import { siteConfig } from '../../config/site';
import { cn } from '../../lib/cn';

export function AdminLayout() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex';

    async function checkUnread() {
      try {
        const msgs = await getMessages();
        setUnreadCount(msgs.filter((m) => !m.read).length);
      } catch {
        // ignore
      }
    }
    checkUnread();
    const interval = setInterval(checkUnread, 15000);
    return () => {
      clearInterval(interval);
      const m = document.querySelector('meta[name="robots"]');
      if (m) m.remove();
    };
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login');
  }

  const navItems = [
    { label: 'Videos', path: '/admin', icon: Film, end: true },
    { label: 'Messages', path: '/admin/messages', icon: Mail, badge: unreadCount },
    { label: 'Settings', path: '/admin/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col md:grid md:grid-cols-[240px_1fr]">
      {/* Sidebar (Desktop) / Top Bar (Mobile) */}
      <aside className="bg-bg border-b md:border-b-0 md:border-r border-line p-4 md:py-6 md:px-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Brand */}
          <div className="px-3 py-2 flex items-center justify-between">
            <Link to="/" className="flex flex-col group leading-none">
              <span className="font-display text-xl font-extrabold tracking-[-0.03em] text-text">
                {siteConfig.name.toUpperCase()}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent mt-1">
                ADMIN CONSOLE
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between h-[42px] px-3.5 rounded-[10px] text-sm font-medium transition-colors select-none whitespace-nowrap',
                      isActive
                        ? 'bg-surface-2 text-text font-semibold'
                        : 'text-muted hover:text-text hover:bg-surface-2/60',
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-accent text-accent-ink font-mono text-[11px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Links */}
        <div className="hidden md:flex flex-col gap-1 pt-6 border-t border-line font-mono text-xs text-muted">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between h-9 px-3.5 rounded-lg hover:text-text hover:bg-surface-2 transition-colors"
          >
            <span>View site</span>
            <ExternalLink size={14} />
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center justify-between h-9 px-3.5 rounded-lg hover:text-danger hover:bg-surface-2 transition-colors text-left"
          >
            <span>Sign out</span>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Offline Fallback Banner */}
        {!isSupabaseConfigured && (
          <div className="bg-surface-2 border-b border-line px-6 py-2.5 flex items-center justify-between text-xs font-mono text-muted">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>
                <strong>Fallback Mode:</strong> Supabase is not connected. All edits, messages, and settings are currently stored in local browser storage.
              </span>
            </span>
            <Link to="/" className="underline text-text hover:text-accent">
              Live Preview ↗
            </Link>
          </div>
        )}

        <main className="flex-1 p-5 sm:p-8 md:p-10 max-w-7xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
