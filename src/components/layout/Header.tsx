import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { siteConfig } from '../../config/site';
import { useLocalTime } from '../../hooks/useLocalTime';
import { MobileMenu } from './MobileMenu';
import { cn } from '../../lib/cn';

const NAV_ITEMS = [
  { label: 'Work', path: '/work' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export function Header() {
  const location = useLocation();
  const timeStr = useLocalTime(siteConfig.location.timeZone, siteConfig.location.clockCity);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > 60) {
        if (currentScrollY > lastScrollY + 4 && isVisible) {
          setIsVisible(false); // scrolling down
        } else if (currentScrollY < lastScrollY - 4 && !isVisible) {
          setIsVisible(true); // scrolling up
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-30 transition-all duration-300 ease-out border-b-0 border-none',
          isVisible ? 'translate-y-0' : '-translate-y-full',
          isScrolled ? 'bg-bg/70 backdrop-blur-md' : 'bg-transparent',
        )}
        style={{ height: 'var(--header-h)' }}
      >
        <div className="container-x h-full flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
          {/* Left: Logo */}
          <Link to="/" className="flex flex-col group leading-none">
            <span className="font-display text-[20px] font-extrabold tracking-[-0.03em] text-text group-hover:text-accent transition-colors">
              {siteConfig.name.toUpperCase()}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted mt-[5px]">
              {siteConfig.role.toUpperCase()}
            </span>
          </Link>

          {/* Center: Desktop Nav Pill */}
          <nav className="hidden md:inline-flex items-center gap-1.5 p-1 rounded-full border border-line bg-surface/60 backdrop-blur-md">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'relative px-[18px] py-2 text-[13px] font-medium rounded-full transition-colors duration-200 select-none',
                    isActive ? 'text-bg' : 'text-muted hover:text-text',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-text -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Clock & "Let's talk" (Desktop) / Hamburger (Mobile) */}
          <div className="flex items-center justify-end gap-[18px]">
            {/* Clock */}
            <span className="hidden md:inline-block font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              {timeStr}
            </span>

            {/* Let's talk Button */}
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center gap-2 h-9 px-4 rounded-full bg-text text-bg text-[13px] font-semibold hover:bg-text/90 hover:-translate-y-0.5 transition-all duration-200 select-none"
            >
              <span>Let&apos;s talk</span>
              <span className="inline-block w-2 h-2 rounded-full bg-ok shadow-[0_0_8px_#3DDC97]" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-line hover:border-line-strong transition-colors"
            >
              <span className="h-[1.5px] w-4 bg-text" />
              <span className="h-[1.5px] w-4 bg-text" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
