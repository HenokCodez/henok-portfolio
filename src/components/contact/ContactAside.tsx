import { useState, useEffect } from 'react';
import { siteConfig } from '../../config/site';

export function ContactAside() {
  const [clockTime, setClockTime] = useState<string>('--:--');

  useEffect(() => {
    function updateClock() {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-GB', {
          timeZone: siteConfig.location.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now);
        setClockTime(formatted);
      } catch {
        setClockTime('--:--');
      }
    }
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="flex flex-col gap-5 select-none">
      {/* 1. Availability */}
      <div className="p-7 rounded-card bg-surface border border-line space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-ok shadow-[0_0_8px_#3DDC97]" />
          <span className="font-mono text-[11px] uppercase tracking-mono text-muted">
            Availability
          </span>
        </div>
        <p className="font-display font-semibold text-xl sm:text-2xl leading-tight text-text">
          {siteConfig.available
            ? 'Booking projects for Nov 2026'
            : 'Fully booked — join waitlist'}
        </p>
      </div>

      {/* 2. Email Directly */}
      <div className="p-7 rounded-card bg-surface border border-line space-y-2">
        <span className="font-mono text-[11px] uppercase tracking-mono text-muted">
          Or email directly
        </span>
        <div>
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-display font-extrabold text-xl sm:text-2xl text-text hover:text-accent border-b-2 border-accent transition-colors inline-block"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>

      {/* 3. Elsewhere */}
      <div className="p-7 rounded-card bg-surface border border-line space-y-3">
        <span className="font-mono text-[11px] uppercase tracking-mono text-muted">
          Elsewhere
        </span>
        <div className="flex flex-col gap-2 font-display text-[17px] font-medium">
          {siteConfig.socials.youtube && (
            <a
              href={siteConfig.socials.youtube}
              target="_blank"
              rel="noreferrer"
              className="text-text hover:text-accent transition-colors flex items-center justify-between"
            >
              <span>YouTube</span>
              <span className="text-muted">↗</span>
            </a>
          )}
          {siteConfig.socials.instagram && (
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-text hover:text-accent transition-colors flex items-center justify-between"
            >
              <span>Instagram</span>
              <span className="text-muted">↗</span>
            </a>
          )}
          {siteConfig.socials.linkedin && (
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-text hover:text-accent transition-colors flex items-center justify-between"
            >
              <span>LinkedIn</span>
              <span className="text-muted">↗</span>
            </a>
          )}
          {siteConfig.socials.telegram && (
            <a
              href={siteConfig.socials.telegram}
              target="_blank"
              rel="noreferrer"
              className="text-text hover:text-accent transition-colors flex items-center justify-between"
            >
              <span>Telegram</span>
              <span className="text-muted">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* 4. Local Time */}
      <div className="p-7 rounded-card bg-surface border border-line space-y-1">
        <span className="font-mono text-[11px] uppercase tracking-mono text-muted">
          Local Time
        </span>
        <div className="font-mono text-3xl font-bold text-text">
          {clockTime}
        </div>
        <p className="font-mono text-xs text-muted">
          {siteConfig.location.clockCity} · {siteConfig.location.gmt}
        </p>
      </div>
    </aside>
  );
}
