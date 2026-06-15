import { Mail, MapPin, Phone, Sparkles, Instagram, Facebook, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BusinessSettings } from '../../lib/types';

interface FooterProps {
  settings: BusinessSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const brand = settings?.business_name?.trim() || 'Maison Lumière';
  const email = settings?.business_email?.trim();
  const phone = settings?.business_phone?.trim();
  const address = settings?.business_address?.trim();

  return (
    <footer id="footer" className="relative mt-16 overflow-hidden bg-espresso text-ivory">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-24 h-[420px] w-[420px] rounded-full bg-rosegold-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -bottom-32 h-[420px] w-[420px] rounded-full bg-rosegold-200/15 blur-3xl"
      />

      <div className="container-page relative grid grid-cols-1 gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rosegold-200 to-rosegold-400 text-espresso">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display text-2xl">{brand}</span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/70">
            A premium beauty atelier offering signature facials, makeup
            artistry, brow and lash design, hair styling, and bridal beauty —
            tailored entirely to you.
          </p>

          <div className="mt-8 flex items-center gap-3">
            {[Instagram, Facebook, Music].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-ivory/20 text-ivory/80 transition hover:border-rosegold-300 hover:text-rosegold-200"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="text-[11px] uppercase tracking-wider-3 text-ivory/60">
            Visit
          </div>
          <ul className="mt-4 space-y-3 text-sm text-ivory/85">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 text-rosegold-200" />
              <span>{address || '24 Rue de la Lumière · Suite 3, City'}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 text-rosegold-200" />
              <span>{phone || '(555) 010-1100'}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 text-rosegold-200" />
              <span>{email || 'hello@maisonlumiere.beauty'}</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <div className="text-[11px] uppercase tracking-wider-3 text-ivory/60">
            Explore
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/85">
            <li><a href="#services" className="hover:text-rosegold-200">Services</a></li>
            <li><a href="#about" className="hover:text-rosegold-200">Atelier</a></li>
            <li><a href="#booking" className="hover:text-rosegold-200">Booking</a></li>
            <li><Link to="/admin" className="hover:text-rosegold-200">Studio Login</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <div className="text-[11px] uppercase tracking-wider-3 text-ivory/60">
            Studio Hours
          </div>
          <ul className="mt-4 space-y-2 text-sm text-ivory/85">
            <li>Mon — Fri · 10am — 8pm</li>
            <li>Saturday · 9am — 6pm</li>
            <li>Sunday · By appointment</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-ivory/50 sm:flex-row">
          <span>© {new Date().getFullYear()} {brand}. Crafted with care.</span>
          <span>Beauty Atelier · By appointment only</span>
        </div>
      </div>
    </footer>
  );
}
