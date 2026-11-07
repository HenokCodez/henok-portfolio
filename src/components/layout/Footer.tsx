import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site';

export function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="w-full border-t border-line pt-14 pb-9 bg-bg">
      <div className="container-x">
        {/* Footer Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          {/* Column 1: Brand & Tagline (spans 2 columns on mobile) */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex flex-col group leading-none">
              <span className="font-display text-[26px] font-extrabold tracking-[-0.03em] text-text group-hover:text-accent transition-colors">
                {siteConfig.name.toUpperCase()}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted mt-[5px]">
                {siteConfig.roleLong.toUpperCase()}
              </span>
            </Link>
            <p className="text-[15px] text-muted leading-relaxed max-w-[320px]">
              Cutting stories with rhythm, restraint and a little bit of obsession.
            </p>
          </div>

          {/* Column 2: Pages */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-mono text-muted mb-4">
              Pages
            </p>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <Link to="/work" className="text-text hover:text-accent transition-colors">
                  Work
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-mono text-muted mb-4">
              Social
            </p>
            <ul className="space-y-2.5 text-[15px]">
              {siteConfig.socials.youtube && (
                <li>
                  <a
                    href={siteConfig.socials.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text hover:text-accent transition-colors inline-flex items-center gap-1"
                  >
                    YouTube <span>↗</span>
                  </a>
                </li>
              )}
              {siteConfig.socials.instagram && (
                <li>
                  <a
                    href={siteConfig.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text hover:text-accent transition-colors inline-flex items-center gap-1"
                  >
                    Instagram <span>↗</span>
                  </a>
                </li>
              )}
              {siteConfig.socials.linkedin && (
                <li>
                  <a
                    href={siteConfig.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text hover:text-accent transition-colors inline-flex items-center gap-1"
                  >
                    LinkedIn <span>↗</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Status */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-mono text-muted mb-4">
              Status
            </p>
            <ul className="space-y-2.5 text-[15px]">
              <li className="flex items-center gap-2 text-text">
                <span className="inline-block h-2 w-2 rounded-full bg-ok shadow-[0_0_8px_currentColor] text-ok" />
                <span>Available for projects</span>
              </li>
              <li className="text-muted text-sm">Reply within 24h</li>
            </ul>
          </div>
        </div>

        {/* Giant Faded Wordmark */}
        <div
          aria-hidden="true"
          className="mt-10 overflow-hidden select-none pointer-events-none"
        >
          <p
            className="font-display font-extrabold uppercase leading-[0.8] tracking-[-0.06em] text-surface-2 whitespace-nowrap"
            style={{ fontSize: 'clamp(80px, 19vw, 290px)' }}
          >
            {siteConfig.name.toUpperCase()}
          </p>
        </div>

        {/* Base Row */}
        <div className="mt-7 pt-5 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <span>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="hover:text-text transition-colors select-none"
          >
            Back to top &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
}
