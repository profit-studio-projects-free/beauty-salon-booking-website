import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Mail,
  Phone,
  Sparkles,
  User,
} from 'lucide-react';
import type {
  BlockedDate,
  BusinessHour,
  BusinessSettings,
  Service,
  TimeSlot,
} from '../../lib/types';
import {
  getAvailableSlots,
  getCalendarDays,
  WEEKDAY_SHORT,
} from '../../lib/availability';
import {
  addDays,
  startOfDay,
  toDateString,
  toLongDateLabel,
  toTimeString,
} from '../../lib/time';
import { formatDuration, formatPrice } from '../../lib/format';
import { supabase } from '../../lib/supabase';

interface BookingProps {
  services: Service[];
  businessHours: BusinessHour[];
  blockedDates: BlockedDate[];
  settings: BusinessSettings | null;
  initialService: Service | null;
  onReset: () => void;
}

type Step = 1 | 2 | 3 | 4;

const STEP_LABELS: Record<Step, string> = {
  1: 'Service',
  2: 'Date & Time',
  3: 'Your Details',
  4: 'Confirmed',
};

export default function Booking({
  services,
  businessHours,
  blockedDates,
  settings,
  initialService,
  onReset,
}: BookingProps) {
  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState<Service | null>(null);
  const [calendarStart, setCalendarStart] = useState<Date>(startOfDay(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

  // Apply incoming service selection (from Hero / Services CTAs).
  useEffect(() => {
    if (initialService) {
      setService(initialService);
      setStep(2);
    }
  }, [initialService]);

  const calendarDays = useMemo(
    () =>
      getCalendarDays({
        from: calendarStart,
        count: 14,
        businessHours,
        blockedDates,
      }),
    [calendarStart, businessHours, blockedDates],
  );

  // Load slots when service + date are chosen.
  useEffect(() => {
    if (!service || !selectedDate) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    setSelectedSlot(null);
    getAvailableSlots({
      date: selectedDate,
      service,
      businessHours,
      blockedDates,
      settings,
    })
      .then((s) => setSlots(s))
      .finally(() => setLoadingSlots(false));
  }, [service, selectedDate, businessHours, blockedDates, settings]);

  const canSubmit = service && selectedDate && selectedSlot && fullName && email && phone;

  async function handleSubmit() {
    if (!canSubmit || !service || !selectedDate || !selectedSlot) return;
    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      service_id: service.id,
      appointment_date: toDateString(selectedDate),
      start_time: toTimeString(selectedSlot.start),
      end_time: toTimeString(selectedSlot.end),
      status: 'pending' as const,
      notes: notes.trim() || null,
    };

    // Per spec: insert only — do NOT chain .select(). Public RLS allows insert,
    // not read. Show the success screen from local form data.
    const { error } = await supabase.from('appointments').insert(payload);
    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setConfirmedRef(generateLocalRef(payload));
    setStep(4);
  }

  function startOver() {
    setStep(1);
    setService(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSlots([]);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setConfirmedRef(null);
    setSubmitError(null);
    onReset();
  }

  return (
    <section id="booking" className="relative py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ivory via-cream/40 to-ivory"
      />
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow justify-center">
            <span className="eyebrow-dot" />
            Reserve Your Session
          </span>
          <h2 className="heading-display mt-4 text-4xl sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            Schedule your appointment in{' '}
            <span className="italic text-rosegold-400">a few quiet steps.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-mocha-600">
            Choose your treatment, pick a time that suits you, and we'll
            confirm your appointment by email.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-4 gap-2 sm:gap-4">
          {([1, 2, 3, 4] as Step[]).map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition-all',
                  step >= s
                    ? 'border-rosegold-300 bg-rosegold-300 text-ivory shadow-soft'
                    : 'border-mocha-400/30 bg-ivory text-mocha-500',
                ].join(' ')}
              >
                {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
              </div>
              <span
                className={[
                  'text-[10px] uppercase tracking-wider-2 sm:text-[11px]',
                  step >= s ? 'text-espresso' : 'text-mocha-500',
                ].join(' ')}
              >
                {STEP_LABELS[s]}
              </span>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="card-soft p-6 sm:p-10">
            {step === 1 && (
              <StepService
                services={services}
                value={service}
                onSelect={(s) => {
                  setService(s);
                  setStep(2);
                }}
              />
            )}

            {step === 2 && service && (
              <StepDateTime
                service={service}
                calendarStart={calendarStart}
                onShiftCalendar={(dir) =>
                  setCalendarStart((d) => addDays(d, dir * 7))
                }
                calendarDays={calendarDays}
                selectedDate={selectedDate}
                onSelectDate={(d) => setSelectedDate(d)}
                slots={slots}
                loadingSlots={loadingSlots}
                selectedSlot={selectedSlot}
                onSelectSlot={(s) => setSelectedSlot(s)}
                onBack={() => setStep(1)}
                onNext={() => selectedSlot && setStep(3)}
              />
            )}

            {step === 3 && service && selectedDate && selectedSlot && (
              <StepDetails
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                notes={notes}
                setNotes={setNotes}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={submitError}
                canSubmit={!!canSubmit}
              />
            )}

            {step === 4 && service && selectedDate && selectedSlot && (
              <StepSuccess
                service={service}
                date={selectedDate}
                slot={selectedSlot}
                fullName={fullName}
                email={email}
                phone={phone}
                notes={notes}
                referenceCode={confirmedRef ?? '—'}
                onAnother={startOver}
              />
            )}
          </div>

          {/* Summary panel */}
          <aside className="card-soft h-fit p-6 sm:p-7">
            <div className="flex items-center gap-2 text-mocha-500">
              <Sparkles className="h-4 w-4 text-rosegold-400" />
              <span className="text-[11px] uppercase tracking-wider-2">
                Appointment Summary
              </span>
            </div>

            <div className="mt-6 space-y-5">
              <SummaryRow
                label="Service"
                value={service?.name ?? '—'}
                muted={!service}
              />
              <SummaryRow
                label="Duration"
                value={
                  service ? formatDuration(service.duration_minutes) : '—'
                }
                muted={!service}
              />
              <SummaryRow
                label="Date"
                value={selectedDate ? toLongDateLabel(selectedDate) : '—'}
                muted={!selectedDate}
              />
              <SummaryRow
                label="Time"
                value={selectedSlot ? selectedSlot.label : '—'}
                muted={!selectedSlot}
              />
              <div className="divider-thin" />
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-wider-2 text-mocha-500">
                  Investment
                </span>
                <span className="font-display text-2xl text-rosegold-400">
                  {service ? formatPrice(service.price) : '—'}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-pearl/70 bg-cream/40 p-4 text-[12px] leading-relaxed text-mocha-600">
              You'll receive a confirmation message once we've reviewed and
              approved your request. To reschedule, simply reply to the email.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[11px] uppercase tracking-wider-2 text-mocha-500">
        {label}
      </span>
      <span
        className={[
          'text-right text-sm font-medium',
          muted ? 'text-mocha-400/80' : 'text-espresso',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  );
}

/* ───────────────────── STEP 1: SERVICE ───────────────────── */

function StepService({
  services,
  value,
  onSelect,
}: {
  services: Service[];
  value: Service | null;
  onSelect: (s: Service) => void;
}) {
  return (
    <div>
      <SectionTitle eyebrow="Step 1" title="Choose your service" />

      {services.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-mocha-400/30 px-6 py-12 text-center text-sm text-mocha-500">
          Our service menu is being curated. Please check back shortly.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {services.map((s) => {
            const selected = value?.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s)}
                className={[
                  'group flex w-full flex-col rounded-2xl border bg-white/70 p-5 text-left transition-all',
                  selected
                    ? 'border-rosegold-300 ring-2 ring-rosegold-200/60'
                    : 'border-pearl hover:border-rosegold-200 hover:bg-white',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-xl leading-tight text-espresso">
                    {s.name}
                  </span>
                  <span className="font-display text-lg text-rosegold-400">
                    {formatPrice(s.price)}
                  </span>
                </div>
                {s.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mocha-600">
                    {s.description}
                  </p>
                )}
                <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider-2 text-mocha-500">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(s.duration_minutes)}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ───────────────────── STEP 2: DATE & TIME ───────────────────── */

function StepDateTime({
  service,
  calendarStart,
  onShiftCalendar,
  calendarDays,
  selectedDate,
  onSelectDate,
  slots,
  loadingSlots,
  selectedSlot,
  onSelectSlot,
  onBack,
  onNext,
}: {
  service: Service;
  calendarStart: Date;
  onShiftCalendar: (dir: 1 | -1) => void;
  calendarDays: { date: Date; available: boolean; reason?: string }[];
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
  slots: TimeSlot[];
  loadingSlots: boolean;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (s: TimeSlot) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const today = startOfDay(new Date());
  const canGoBack = calendarStart > today;

  return (
    <div>
      <SectionTitle
        eyebrow="Step 2"
        title="Choose date & time"
        subtitle={`Selected service: ${service.name} · ${formatDuration(service.duration_minutes)}`}
      />

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-mocha-600">
          <CalendarRange className="h-4 w-4" />
          <span className="font-medium">Available dates</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => canGoBack && onShiftCalendar(-1)}
            disabled={!canGoBack}
            className={[
              'grid h-9 w-9 place-items-center rounded-full border transition',
              canGoBack
                ? 'border-mocha-400/30 hover:border-rosegold-300 hover:bg-rosegold-100/40'
                : 'border-mocha-400/15 text-mocha-400/50',
            ].join(' ')}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onShiftCalendar(1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-mocha-400/30 transition hover:border-rosegold-300 hover:bg-rosegold-100/40"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {calendarDays.map(({ date, available, reason }) => {
          const isSelected =
            selectedDate &&
            selectedDate.toDateString() === date.toDateString();
          return (
            <button
              key={date.toISOString()}
              disabled={!available}
              onClick={() => onSelectDate(date)}
              className={[
                'flex flex-col items-center rounded-2xl border px-2 py-3 text-center transition-all',
                isSelected
                  ? 'border-rosegold-300 bg-rosegold-100/40 ring-2 ring-rosegold-200/60'
                  : available
                  ? 'border-pearl bg-white/70 hover:border-rosegold-200 hover:bg-white'
                  : 'border-pearl/60 bg-cream/40 text-mocha-400 line-through opacity-60',
              ].join(' ')}
              title={!available ? reason ?? 'Closed' : undefined}
            >
              <span className="text-[10px] uppercase tracking-wider-2 text-mocha-500">
                {WEEKDAY_SHORT[date.getDay()]}
              </span>
              <span className="mt-1 font-display text-2xl text-espresso">
                {date.getDate()}
              </span>
              <span className="text-[10px] text-mocha-500">
                {date.toLocaleString('en-US', { month: 'short' })}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-2 text-sm text-mocha-600">
          <Clock className="h-4 w-4" />
          <span className="font-medium">Available times</span>
        </div>

        {!selectedDate && (
          <p className="mt-4 rounded-2xl border border-dashed border-mocha-400/30 px-5 py-8 text-center text-sm text-mocha-500">
            Choose a date to see available time slots.
          </p>
        )}

        {selectedDate && loadingSlots && (
          <div className="mt-4 flex items-center gap-2 text-sm text-mocha-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading availability…
          </div>
        )}

        {selectedDate && !loadingSlots && slots.length === 0 && (
          <p className="mt-4 rounded-2xl border border-dashed border-mocha-400/30 px-5 py-8 text-center text-sm text-mocha-500">
            No more openings on this day. Please try another date.
          </p>
        )}

        {selectedDate && !loadingSlots && slots.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {slots.map((s) => {
              const selected =
                selectedSlot && selectedSlot.start.getTime() === s.start.getTime();
              return (
                <button
                  key={s.start.toISOString()}
                  onClick={() => onSelectSlot(s)}
                  className={[
                    'rounded-full border px-3 py-2.5 text-sm font-medium transition-all',
                    selected
                      ? 'border-rosegold-300 bg-rosegold-300 text-ivory shadow-soft'
                      : 'border-pearl bg-white/70 text-espresso hover:border-rosegold-200 hover:bg-white',
                  ].join(' ')}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedSlot}
          className={[
            'btn-primary',
            !selectedSlot && 'cursor-not-allowed opacity-50 hover:shadow-none',
          ].join(' ')}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ───────────────────── STEP 3: DETAILS ───────────────────── */

function StepDetails(props: {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
  canSubmit: boolean;
}) {
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    notes,
    setNotes,
    onBack,
    onSubmit,
    submitting,
    error,
    canSubmit,
  } = props;

  return (
    <div>
      <SectionTitle
        eyebrow="Step 3"
        title="Your details"
        subtitle="So we can confirm your appointment."
      />

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Full name"
          icon={<User className="h-4 w-4" />}
          value={fullName}
          onChange={setFullName}
          placeholder="Camille Rousseau"
          autoComplete="name"
        />
        <Field
          label="Email"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={setEmail}
          placeholder="camille@email.com"
          type="email"
          autoComplete="email"
        />
        <Field
          label="Phone"
          icon={<Phone className="h-4 w-4" />}
          value={phone}
          onChange={setPhone}
          placeholder="(555) 123-4567"
          type="tel"
          autoComplete="tel"
        />
        <div className="sm:col-span-2">
          <label className="field-label">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Anything we should know before your visit — skin sensitivities, occasion, preferred style, etc."
            className="field-textarea"
          />
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-blush-300/60 bg-blush-50 px-4 py-3 text-sm text-blush-600">
          {error}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button onClick={onBack} className="btn-ghost" disabled={submitting}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          className={[
            'btn-primary',
            (!canSubmit || submitting) &&
              'cursor-not-allowed opacity-60 hover:shadow-none',
          ].join(' ')}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Confirming…
            </>
          ) : (
            <>
              Confirm appointment
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="relative mt-2">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mocha-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={['field-input mt-0', icon && 'pl-10'].filter(Boolean).join(' ')}
        />
      </div>
    </div>
  );
}

/* ───────────────────── STEP 4: SUCCESS ───────────────────── */

function StepSuccess({
  service,
  date,
  slot,
  fullName,
  email,
  phone,
  notes,
  referenceCode,
  onAnother,
}: {
  service: Service;
  date: Date;
  slot: TimeSlot;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
  referenceCode: string;
  onAnother: () => void;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rosegold-200 to-rosegold-400 text-ivory shadow-soft">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h3 className="heading-display mt-6 text-3xl sm:text-4xl">
        Your appointment is reserved.
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mocha-600">
        Thank you, {fullName.split(' ')[0] || 'beautiful'}. We've received
        your request — you'll receive a confirmation by email shortly.
      </p>

      <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-pearl/70 bg-white/70 p-6 text-left">
        <div className="text-[10px] uppercase tracking-wider-3 text-mocha-500">
          Reference
        </div>
        <div className="mt-1 font-display text-xl text-espresso">{referenceCode}</div>

        <div className="mt-5 divider-thin" />

        <dl className="mt-5 grid grid-cols-1 gap-y-3 text-sm sm:grid-cols-2">
          <Detail label="Service" value={service.name} />
          <Detail label="Duration" value={formatDuration(service.duration_minutes)} />
          <Detail label="Date" value={toLongDateLabel(date)} />
          <Detail label="Time" value={slot.label} />
          <Detail label="Name" value={fullName} />
          <Detail label="Email" value={email} />
          <Detail label="Phone" value={phone} />
          <Detail label="Investment" value={formatPrice(service.price)} />
        </dl>

        {notes && (
          <>
            <div className="mt-5 divider-thin" />
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-wider-3 text-mocha-500">
                Notes
              </div>
              <p className="mt-1 text-sm text-espresso">{notes}</p>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button onClick={onAnother} className="btn-secondary">
          Book another session
        </button>
        <a href="#top" className="btn-primary">
          Return to home
        </a>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider-3 text-mocha-500">
        {label}
      </div>
      <div className="mt-0.5 font-medium text-espresso">{value}</div>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <span className="text-[11px] uppercase tracking-wider-3 text-rosegold-400">
        {eyebrow}
      </span>
      <h3 className="heading-display mt-1 text-3xl">{title}</h3>
      {subtitle && (
        <p className="mt-2 text-sm text-mocha-500">{subtitle}</p>
      )}
    </div>
  );
}

function generateLocalRef(payload: {
  appointment_date: string;
  start_time: string;
  full_name: string;
}): string {
  const date = payload.appointment_date.replace(/-/g, '');
  const time = payload.start_time.slice(0, 5).replace(':', '');
  const initials = payload.full_name
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
  return `ML-${date}-${time}-${initials || 'XX'}`;
}
