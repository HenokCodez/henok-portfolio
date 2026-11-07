import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, isDemoAuth, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg font-mono text-xs uppercase tracking-mono text-muted">
        Loading…
      </div>
    );
  }

  const isAuthenticated = isConfigured ? !!session : isDemoAuth;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
