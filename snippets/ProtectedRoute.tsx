// src/hooks/useAuth.tsx (AuthProvider + useAuth) and src/components/admin/ProtectedRoute.tsx — shown together here.
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthState = { session: Session | null; loading: boolean };
const AuthContext = createContext<AuthState>({ session: null, loading: true });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ session: null, loading: true });
  useEffect(() => {
    if (!supabase) { setState({ session: null, loading: false }); return; }
    supabase.auth.getSession().then(({ data }) => setState({ session: data.session, loading: false }));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setState({ session, loading: false }));
    return () => sub.subscription.unsubscribe();
  }, []);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="grid min-h-screen place-items-center label-mono">Loading…</div>;
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
// NOTE: the real security is RLS in the database. This component only hides the UI.
