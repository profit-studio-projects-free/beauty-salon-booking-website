import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import type { BusinessSettings } from '../../lib/types';

interface NavbarProps {
  settings: BusinessSettings | null;
  onBook: () => void;
}

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Atelier', href: '#about' },
  { label: 'Booking', href: '#booking' },
  { label: 'Contact', href: '#footer' },
];

export default function Navbar({ settings, onBook }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const brand = settings?.business_name?.trim() || 'Maison Lumière';

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-40 transition-all duration-500',
        scrolled
          ? 'border-b border-pearl/70 bg-ivory/85 backdrop-blur-md'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rosegold-200 to-rosegold-400 text-ivory shadow-soft">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-xl tracking-wide text-espresso">
              {brand}
            </span>
            <span className="text-[10px] uppercase tracking-wider-3 text-mocha-500">
              Beauty Atelier
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative text-sm font-medium text-mocha-700 transition-colors hover:text-espresso"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-rosegold-300 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/admin"
            className="text-xs font-medium uppercase tracking-wider-2 text-mocha-500 transition hover:text-espresso"
          >
            Studio Login
          </Link>
          <button onClick={onBook} className="btn-primary">
            Book a Session
          </button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-mocha-400/30 bg-ivory/70 text-espresso md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-pearl/70 bg-ivory md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-mocha-700 hover:bg-pearl/60"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-sm font-medium text-mocha-500 hover:bg-pearl/60"
            >
              Studio Login
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                onBook();
              }}
              className="btn-primary mt-2 w-full"
            >
              Book a Session
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
