import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { heroImages } from '../../lib/images';
import type { BusinessSettings } from '../../lib/types';

interface HeroProps {
  settings: BusinessSettings | null;
  onBook: () => void;
}

export default function Hero({ settings, onBook }: HeroProps) {
  const city = settings?.business_address?.split(',').slice(-2, -1)[0]?.trim();

  return (
    <section id="top" className="relative overflow-hidden pt-24">
      {/* Soft gradient wash + grain */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-blush-50 via-ivory to-ivory" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-12 -z-10 h-[420px] w-[420px] rounded-full bg-rosegold-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-56 -z-10 h-[360px] w-[360px] rounded-full bg-champagne-100/50 blur-3xl"
      />

      <div className="container-page grid grid-cols-1 items-center gap-14 pb-24 pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-32 lg:pt-20">
        {/* Copy */}
        <div className="lg:col-span-6 animate-fade-up">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            Beauty Atelier {city ? `· ${city}` : '· By Appointment'}
          </span>

          <h1 className="heading-display mt-5 text-[44px] leading-[1.04] sm:text-6xl lg:text-[68px]">
            Quiet luxury,
            <br />
            <span className="italic text-rosegold-400">tailored beauty.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-mocha-600">
            A refined beauty studio for facials, signature makeup, brow and lash
            artistry, hair styling and bridal beauty — designed around your
            ritual, your skin, and the way you want to feel.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button onClick={onBook} className="btn-primary group">
              Reserve your session
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <a href="#services" className="btn-secondary">
              Explore services
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 max-w-md gap-6 border-t border-mocha-400/15 pt-8">
            <Stat label="Years of artistry" value="12+" />
            <Stat label="Average rating" value="4.96" icon />
            <Stat label="Signature treatments" value="20+" />
          </div>
        </div>

        {/* Imagery */}
        <div className="relative lg:col-span-6 animate-fade-up">
          <div className="relative isolate ml-auto h-[520px] w-full max-w-[560px] overflow-hidden rounded-[40px] shadow-glow ring-1 ring-pearl/70 sm:h-[600px]">
            <img
              src={heroImages.primary}
              alt="Elegant beauty studio interior with soft natural light"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/10 to-transparent" />

            {/* Floating tag */}
            <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[11px] uppercase tracking-wider-2 text-white backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              Signature Atelier
            </div>

            {/* Quote card */}
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/30 bg-white/85 p-5 backdrop-blur-md">
              <div className="flex items-center gap-1 text-rosegold-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-2 font-display text-lg italic leading-snug text-espresso">
                “A calm, almost cinematic ritual — I left looking like
                myself, only softer.”
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider-2 text-mocha-500">
                Camille R. · Signature Facial
              </p>
            </div>
          </div>

          {/* Floating secondary image */}
          <div className="absolute -left-6 bottom-12 hidden h-44 w-36 overflow-hidden rounded-3xl ring-1 ring-pearl/70 shadow-soft md:block">
            <img
              src={heroImages.secondary}
              alt="Makeup artist preparing a soft glam look"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 font-display text-2xl text-espresso">
        {value}
        {icon && <Star className="h-4 w-4 fill-rosegold-300 text-rosegold-300" />}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wider-2 text-mocha-500">
        {label}
      </div>
    </div>
  );
}
