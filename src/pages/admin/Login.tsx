import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, session, isDemoAuth, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Admin Login — Henok';
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex';
  }, []);

  useEffect(() => {
    if (isConfigured ? !!session : isDemoAuth) {
      const from = (location.state as { from?: string })?.from || '/admin';
      navigate(from, { replace: true });
    }
  }, [session, isDemoAuth, isConfigured, navigate, location.state]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await signIn(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        const from = (location.state as { from?: string })?.from || '/admin';
        navigate(from, { replace: true });
      }
    } catch {
      setErrorMsg("Can't reach the server. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-[100svh] bg-bg flex items-center justify-center p-5 select-none overflow-hidden">
      {/* Background Accent Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[600px] h-[600px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,77,31,0.12),transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] p-7 sm:p-9 rounded-card bg-surface border border-line space-y-6">
        {/* Header Branding */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="font-display text-2xl font-extrabold tracking-[-0.03em] text-text">
              HENOK
            </span>
            <span className="font-mono text-[10px] uppercase tracking-mono text-muted px-2 py-0.5 rounded border border-line">
              ADMIN
            </span>
          </div>
          <h1 className="font-display font-extrabold uppercase text-[32px] tracking-tight leading-tight text-text">
            SIGN IN
          </h1>
          <p className="text-muted text-sm mt-1">
            Private area. Authorised access only.
          </p>
        </div>

        {/* Fallback Banner if Supabase is not configured */}
        {!isConfigured && (
          <div className="p-3 rounded-lg bg-surface-2 border border-line text-xs font-mono text-muted space-y-1">
            <p className="text-accent font-semibold">Supabase isn&apos;t configured</p>
            <p>Running in offline demo mode. Enter any email and password to log in.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="admin-email"
              className="block font-mono text-[11px] uppercase tracking-mono text-muted"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoFocus
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="henok@studio.com"
              className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-line-strong text-sm text-text placeholder:text-faint transition-all focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="block font-mono text-[11px] uppercase tracking-mono text-muted"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-12 pl-4 pr-11 rounded-xl bg-surface-2 border border-line-strong text-sm text-text placeholder:text-faint transition-all focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="flex items-center gap-1.5 text-xs text-danger font-mono pt-1">
              <span>●</span>
              <span>{errorMsg}</span>
            </p>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full justify-center"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </div>
        </form>

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-mono text-muted hover:text-text transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
