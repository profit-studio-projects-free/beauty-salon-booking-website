import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Loader2, Mail, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onSubmit: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loading: boolean;
  error: string | null;
}

export default function AdminLogin({ onSubmit, loading, error }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  async function handle(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password) {
      setLocalError('Please enter your email and password.');
      return;
    }
    const result = await onSubmit(email, password);
    if (!result.ok) setLocalError(result.error ?? 'Unable to sign in.');
  }

  const message = localError || error;

  return (
    <div className="relative grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden overflow-hidden bg-espresso lg:flex">
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=80"
          alt="Beauty studio atmosphere"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-espresso via-espresso/80 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-ivory">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-ivory/80 hover:text-ivory">
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider-3 text-ivory/70">
              <Sparkles className="h-3.5 w-3.5" />
              Studio Portal
            </div>
            <h1 className="font-display mt-4 text-5xl leading-[1.05]">
              The atelier,
              <br />
              <span className="italic text-rosegold-200">behind the scenes.</span>
            </h1>
            <p className="mt-5 max-w-md text-ivory/70">
              Sign in to manage your beauty studio — appointments, services,
              business hours and more.
            </p>
          </div>
          <div className="text-[11px] uppercase tracking-wider-2 text-ivory/50">
            Maison Lumière · Studio Suite
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-ivory p-8">
        <form onSubmit={handle} className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-mocha-500 lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </Link>

          <span className="eyebrow">
            <span className="eyebrow-dot" />
            Studio Access
          </span>
          <h2 className="heading-display mt-3 text-4xl">Welcome back.</h2>
          <p className="mt-2 text-sm text-mocha-500">
            Sign in with your studio admin credentials.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="field-label">Email</label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mocha-400" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="studio@maisonlumiere.beauty"
                  className="field-input mt-0 pl-10"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative mt-2">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mocha-400" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="field-input mt-0 pl-10"
                />
              </div>
            </div>

            {message && (
              <div className="rounded-2xl border border-blush-300/60 bg-blush-50 px-4 py-3 text-sm text-blush-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={[
                'btn-primary w-full justify-center',
                loading && 'cursor-wait opacity-75',
              ].join(' ')}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-mocha-500">
            This area is for studio staff only. Access is granted by adding
            your Supabase Auth user id to the <code className="rounded bg-pearl px-1.5 py-0.5">admin_users</code>{' '}
            table.
          </p>
        </form>
      </div>
    </div>
  );
}
