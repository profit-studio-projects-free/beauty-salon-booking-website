import { ReactNode, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Calendar,
  CalendarOff,
  Clock,
  Gauge,
  LogOut,
  Menu,
  Scissors,
  Settings2,
  Sparkles,
  X,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface AdminLayoutProps {
  children: ReactNode;
  user: User | null;
  onSignOut: () => void;
  brand?: string | null;
}

const links = [
  { label: 'Overview', to: '/admin', end: true, Icon: Gauge },
  { label: 'Appointments', to: '/admin/appointments', Icon: Calendar },
  { label: 'Services', to: '/admin/services', Icon: Scissors },
  { label: 'Business Hours', to: '/admin/hours', Icon: Clock },
  { label: 'Blocked Dates', to: '/admin/blocked', Icon: CalendarOff },
  { label: 'Business Settings', to: '/admin/settings', Icon: Settings2 },
];

export default function AdminLayout({
  children,
  user,
  onSignOut,
  brand,
}: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const display = brand?.trim() || 'Maison Lumière';

  return (
    <div className="flex min-h-screen bg-cream/40">
      {/* Sidebar */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 w-72 transform border-r border-pearl/70 bg-ivory/90 backdrop-blur-sm transition-transform duration-300 ease-out lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rosegold-200 to-rosegold-400 text-ivory">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg text-espresso">{display}</div>
              <div className="text-[10px] uppercase tracking-wider-3 text-mocha-500">
                Studio Suite
              </div>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-full border border-mocha-400/30 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-2 space-y-1 px-4">
          {links.map(({ label, to, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end as any}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-espresso text-ivory shadow-soft'
                    : 'text-mocha-600 hover:bg-pearl/60 hover:text-espresso',
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute inset-x-4 bottom-6">
          <div className="rounded-2xl border border-pearl/70 bg-white/80 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rosegold-200 to-rosegold-400 text-ivory">
                {(user?.email?.[0] || 'A').toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-sm font-medium text-espresso">
                  {user?.email || 'Admin'}
                </div>
                <div className="text-[10px] uppercase tracking-wider-2 text-mocha-500">
                  Signed in
                </div>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-mocha-400/20 px-3 py-2 text-xs font-medium text-mocha-600 transition hover:border-mocha-500 hover:text-espresso"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-espresso/30 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-pearl/70 bg-ivory/85 px-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-mocha-400/30 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="text-[11px] uppercase tracking-wider-2 text-mocha-500">
              Studio Suite
              <span className="mx-2 text-mocha-400/50">/</span>
              <span className="text-espresso">{titleFromPath(location.pathname)}</span>
            </div>
          </div>
          <Link
            to="/"
            className="hidden text-xs font-medium uppercase tracking-wider-2 text-mocha-500 transition hover:text-espresso md:inline-flex"
          >
            View public site →
          </Link>
        </header>

        <main className="admin-scroll flex-1 overflow-x-hidden px-4 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function titleFromPath(path: string): string {
  if (path === '/admin') return 'Overview';
  if (path.startsWith('/admin/appointments')) return 'Appointments';
  if (path.startsWith('/admin/services')) return 'Services';
  if (path.startsWith('/admin/hours')) return 'Business Hours';
  if (path.startsWith('/admin/blocked')) return 'Blocked Dates';
  if (path.startsWith('/admin/settings')) return 'Business Settings';
  return 'Studio';
}
