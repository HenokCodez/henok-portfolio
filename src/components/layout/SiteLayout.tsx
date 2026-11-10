import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

const KNOWN_ROUTES = ['/', '/work', '/about', '/contact'];

export function SiteLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isKnownRoute = KNOWN_ROUTES.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text selection:bg-accent selection:text-accent-ink">
      <Header />
      <main className="flex-1 pt-[var(--header-h)]">
        <Outlet />
      </main>
      {isKnownRoute && <Footer />}
    </div>
  );
}
