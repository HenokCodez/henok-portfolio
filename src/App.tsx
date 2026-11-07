import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Lazy-loaded admin pages (per docs/03-architecture.md)
const Login = lazy(() => import('./pages/admin/Login'));
const Videos = lazy(() => import('./pages/admin/Videos'));
const Messages = lazy(() => import('./pages/admin/Messages'));
const Settings = lazy(() => import('./pages/admin/Settings'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Login (no layout) */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<div className="min-h-screen bg-bg" />}>
                <Login />
              </Suspense>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            element={
              <Suspense fallback={<div className="min-h-screen bg-bg" />}>
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              </Suspense>
            }
          >
            <Route path="/admin" element={<Videos />} />
            <Route path="/admin/messages" element={<Messages />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
