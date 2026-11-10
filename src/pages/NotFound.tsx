import { useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('404 — Henok', 'Page not found');

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex';
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-var(--header-h))] flex flex-col items-center justify-center text-center p-6 select-none overflow-hidden">
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[800px] h-[800px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,77,31,0.14),transparent_70%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto space-y-4">
        <span className="font-mono text-xs uppercase tracking-mono text-muted">
          [ Error ]
        </span>

        {/* 404 with middle 0 in Instrument Serif Italic Accent */}
        <h1
          className="font-display font-extrabold uppercase leading-[0.8] tracking-tight text-text"
          style={{ fontSize: 'clamp(120px, 26vw, 360px)' }}
        >
          4<span className="serif-accent">0</span>4
        </h1>

        <p className="font-mono text-sm uppercase tracking-mono text-text">
          TIMECODE 99:99:99:99 — NOT FOUND
        </p>

        <p className="text-muted text-base max-w-[420px] leading-relaxed">
          This scene didn&apos;t make the final cut. Let&apos;s get you back to the work that did.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
          <Button to="/" variant="solid" size="lg">
            Back home
          </Button>
          <Button to="/work" variant="ghost" size="lg">
            See my work
          </Button>
        </div>
      </div>
    </div>
  );
}
