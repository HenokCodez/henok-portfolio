import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../../config/site';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { name: 'Home', path: '/', index: '01' },
  { name: 'Work', path: '/work', index: '02' },
  { name: 'About', path: '/about', index: '03' },
  { name: 'Contact', path: '/contact', index: '04' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on ESC key & Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = origOverflow;
      };
    }
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-bg px-5 py-4 sm:px-10 overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex h-16 items-center justify-between border-b border-line">
            <Link to="/" onClick={onClose} className="group flex flex-col">
              <span className="font-display text-xl font-extrabold tracking-[-0.03em] text-text">
                {siteConfig.name.toUpperCase()}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                {siteConfig.role.toUpperCase()}
              </span>
            </Link>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-text hover:border-line-strong hover:text-accent transition-colors"
            >
              <span className="text-xl leading-none">✕</span>
            </button>
          </div>

          {/* Nav Links */}
          <div className="my-auto py-10">
            <nav className="flex flex-col space-y-6">
              {NAV_LINKS.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 + idx * 0.06,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    to={link.path}
                    onClick={onClose}
                    className="group inline-flex items-baseline gap-4"
                  >
                    <span className="font-mono text-xs uppercase tracking-mono text-muted group-hover:text-accent transition-colors">
                      {link.index}
                    </span>
                    <span className="display text-4xl sm:text-5xl md:text-6xl text-text group-hover:text-accent transition-colors">
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Bottom Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="border-t border-line pt-6 pb-4 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-mono text-sm text-text hover:text-accent transition-colors"
              >
                {siteConfig.email}
              </a>

              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-ok shadow-[0_0_8px_currentColor] text-ok" />
                <span className="font-mono text-xs text-muted">
                  {siteConfig.available ? 'Available for projects' : 'Booked'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {siteConfig.socials.youtube && (
                <a
                  href={siteConfig.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs uppercase text-muted hover:text-text"
                >
                  YouTube ↗
                </a>
              )}
              {siteConfig.socials.instagram && (
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs uppercase text-muted hover:text-text"
                >
                  Instagram ↗
                </a>
              )}
              {siteConfig.socials.linkedin && (
                <a
                  href={siteConfig.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs uppercase text-muted hover:text-text"
                >
                  LinkedIn ↗
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
