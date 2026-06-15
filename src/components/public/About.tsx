import { Leaf, ShieldCheck, Heart, Gem } from 'lucide-react';
import { aboutImages } from '../../lib/images';

const values = [
  {
    icon: Leaf,
    title: 'Clean & considered',
    body: 'Skincare-grade products, gentle technique, and a quiet, unhurried pace.',
  },
  {
    icon: ShieldCheck,
    title: 'Trained artistry',
    body: 'Every team member is fully qualified and continuously trained in modern beauty.',
  },
  {
    icon: Heart,
    title: 'Personal attention',
    body: 'No rushed appointments. Each session begins with a private consultation.',
  },
  {
    icon: Gem,
    title: 'Refined finish',
    body: 'A polished, photo-ready result — calibrated to feel like you, only softer.',
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="container-page grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Image collage */}
        <div className="relative lg:col-span-6">
          <div className="relative h-[520px] overflow-hidden rounded-[36px] shadow-glow ring-1 ring-pearl/70 sm:h-[600px]">
            <img
              src={aboutImages.studio}
              alt="Modern beauty studio interior with soft natural lighting"
              loading="lazy"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-espresso/30 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-10 right-2 hidden h-56 w-44 overflow-hidden rounded-3xl ring-1 ring-pearl/70 shadow-soft md:block">
            <img
              src={aboutImages.consultation}
              alt="Beauty professional in consultation with a client"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Floating credentials */}
          <div className="absolute -left-6 top-10 hidden rounded-2xl border border-pearl/70 bg-ivory/90 p-5 shadow-soft backdrop-blur md:block">
            <div className="font-display text-3xl text-espresso">12<span className="text-rosegold-400">+</span></div>
            <div className="text-[11px] uppercase tracking-wider-2 text-mocha-500">
              Years of beauty artistry
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-6">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            The Atelier
          </span>
          <h2 className="heading-display mt-4 text-4xl leading-[1.1] sm:text-5xl">
            A small, deliberate house of{' '}
            <span className="italic text-rosegold-400">beauty.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mocha-600">
            We built Maison Lumière for clients who want their beauty
            appointments to feel like a quiet ritual — calm music, warm light,
            unhurried hands. Every facial, makeup session, brow shape and
            styling appointment is led by a senior artist who is in the studio
            with you from start to finish.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-mocha-600">
            No upsell, no rush, no formula. Just thoughtful beauty, tailored
            entirely to you.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border border-pearl/70 bg-ivory/70 p-5 transition-all hover:border-rosegold-200/80 hover:bg-ivory"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rosegold-100 to-rosegold-200 text-rosegold-500">
                  <v.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 font-display text-lg text-espresso">{v.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-mocha-600">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
