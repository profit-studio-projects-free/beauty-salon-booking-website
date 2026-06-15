import { ArrowUpRight, Clock } from 'lucide-react';
import type { Service } from '../../lib/types';
import { imageForService } from '../../lib/images';
import { formatDuration, formatPrice } from '../../lib/format';

interface ServicesProps {
  services: Service[];
  loading: boolean;
  onSelect: (service: Service) => void;
}

export default function Services({ services, loading, onSelect }: ServicesProps) {
  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blush-50/60 to-transparent"
      />

      <div className="container-page">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              The Services
            </span>
            <h2 className="heading-display mt-4 text-4xl sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
              A quiet, considered menu of{' '}
              <span className="italic text-rosegold-400">beauty rituals</span>.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-mocha-600">
            Each service is designed around your skin, your features, and the
            occasion. Treatments are private, unhurried, and finished with the
            kind of detail you'd expect from a great atelier.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

          {!loading && services.length === 0 && (
            <div className="col-span-full rounded-3xl border border-dashed border-mocha-400/30 bg-ivory/60 px-8 py-16 text-center">
              <p className="font-display text-2xl text-espresso">
                The service menu is being curated.
              </p>
              <p className="mt-2 text-sm text-mocha-500">
                New treatments arrive shortly. Please check back soon.
              </p>
            </div>
          )}

          {!loading &&
            services.map((service, idx) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={onSelect}
                index={idx}
              />
            ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  onSelect,
  index,
}: {
  service: Service;
  onSelect: (s: Service) => void;
  index: number;
}) {
  const image = imageForService(service.name);
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-pearl/70 bg-ivory/85 shadow-softer transition-all duration-500 hover:-translate-y-1 hover:shadow-soft"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image.url}
          alt={image.alt}
          loading="lazy"
          className="h-full w-full scale-105 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = '0';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium uppercase tracking-wider-2 text-espresso backdrop-blur">
          <Clock className="h-3.5 w-3.5" />
          {formatDuration(service.duration_minutes)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl leading-tight text-espresso">
            {service.name}
          </h3>
          <span className="font-display text-xl text-rosegold-400">
            {formatPrice(service.price)}
          </span>
        </div>
        {service.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mocha-600">
            {service.description}
          </p>
        )}

        <button
          onClick={() => onSelect(service)}
          className="mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-espresso transition-colors hover:text-rosegold-400"
        >
          Reserve this ritual
          <span className="grid h-7 w-7 place-items-center rounded-full border border-mocha-400/30 transition-all group-hover:border-rosegold-300 group-hover:bg-rosegold-100/40">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-pearl/70 bg-ivory/60">
      <div className="aspect-[4/3] animate-pulse bg-gradient-to-r from-pearl via-cream to-pearl bg-[length:200%_100%]" />
      <div className="space-y-3 p-6">
        <div className="h-5 w-2/3 animate-pulse rounded bg-pearl" />
        <div className="h-3 w-full animate-pulse rounded bg-pearl/80" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-pearl/80" />
        <div className="h-9 w-32 animate-pulse rounded-full bg-pearl/60" />
      </div>
    </div>
  );
}
