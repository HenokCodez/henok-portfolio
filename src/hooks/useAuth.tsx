import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AuthState {
  session: Session | null;
  isDemoAuth: boolean;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  session: null,
  isDemoAuth: false,
  loading: true,
  isConfigured: false,
  signIn: async () => ({}),
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isDemoAuth, setIsDemoAuth] = useState<boolean>(() => {
    try {
      return localStorage.getItem('henok_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn(email: string, pass: string): Promise<{ error?: string }> {
    if (!supabase) {
      // In fallback mode, accept any non-empty credentials
      if (email.trim() && pass.trim()) {
        setIsDemoAuth(true);
        try {
          localStorage.setItem('henok_admin_auth', 'true');
        } catch {
          // ignore
        }
        return {};
      }
      return { error: 'Invalid email or password.' };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    if (error) {
      return { error: 'Invalid email or password.' };
    }
    return {};
  }

  async function signOut(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsDemoAuth(false);
    try {
      localStorage.removeItem('henok_admin_auth');
    } catch {
      // ignore
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isDemoAuth,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

