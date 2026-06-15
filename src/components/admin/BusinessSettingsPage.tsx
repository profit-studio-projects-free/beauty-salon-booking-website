import { useEffect, useState } from 'react';
import { Building2, CheckCircle2, Clock4, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import PageHeader from './PageHeader';
import { supabase } from '../../lib/supabase';
import type { BusinessSettings } from '../../lib/types';

interface Draft {
  id?: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  slot_interval_minutes: number;
  booking_notice_hours: number;
}

const EMPTY: Draft = {
  business_name: '',
  business_email: '',
  business_phone: '',
  business_address: '',
  slot_interval_minutes: 30,
  booking_notice_hours: 2,
};

export default function BusinessSettingsPage({
  onSaved,
}: {
  onSaved?: (s: BusinessSettings) => void;
}) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('business_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (data) {
      const s = data as BusinessSettings;
      setDraft({
        id: s.id,
        business_name: s.business_name ?? '',
        business_email: s.business_email ?? '',
        business_phone: s.business_phone ?? '',
        business_address: s.business_address ?? '',
        slot_interval_minutes: s.slot_interval_minutes ?? 30,
        booking_notice_hours: s.booking_notice_hours ?? 2,
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setError(null);
    setSaving(true);
    const payload = {
      business_name: draft.business_name.trim() || null,
      business_email: draft.business_email.trim() || null,
      business_phone: draft.business_phone.trim() || null,
      business_address: draft.business_address.trim() || null,
      slot_interval_minutes: Math.max(5, Math.round(draft.slot_interval_minutes)),
      booking_notice_hours: Math.max(0, Math.round(draft.booking_notice_hours)),
    };

    let result;
    if (draft.id) {
      result = await supabase
        .from('business_settings')
        .update(payload)
        .eq('id', draft.id)
        .select()
        .maybeSingle();
    } else {
      result = await supabase
        .from('business_settings')
        .insert(payload)
        .select()
        .maybeSingle();
    }

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (result.data) {
      const s = result.data as BusinessSettings;
      setDraft((d) => ({ ...d, id: s.id }));
      onSaved?.(s);
    }
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 1800);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Business Settings"
        title="Studio identity & booking rules"
        subtitle="Update your salon's public details and the rules that govern the booking system."
      />

      {loading ? (
        <div className="card-soft flex items-center justify-center gap-2 py-20 text-sm text-mocha-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading business settings…
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="card-soft p-6 lg:col-span-2">
            <h2 className="font-display text-2xl text-espresso">Studio identity</h2>
            <p className="mt-1 text-sm text-mocha-500">
              These details appear on your public website, footer and confirmation emails.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                icon={<Building2 className="h-4 w-4" />}
                label="Salon Name"
                value={draft.business_name}
                onChange={(v) => setDraft({ ...draft, business_name: v })}
                placeholder="Maison Lumière"
              />
              <Field
                icon={<Mail className="h-4 w-4" />}
                label="Salon Email"
                value={draft.business_email}
                onChange={(v) => setDraft({ ...draft, business_email: v })}
                placeholder="hello@maisonlumiere.beauty"
                type="email"
              />
              <Field
                icon={<Phone className="h-4 w-4" />}
                label="Salon Phone"
                value={draft.business_phone}
                onChange={(v) => setDraft({ ...draft, business_phone: v })}
                placeholder="(555) 010-1100"
              />
              <Field
                icon={<MapPin className="h-4 w-4" />}
                label="Salon Address"
                value={draft.business_address}
                onChange={(v) => setDraft({ ...draft, business_address: v })}
                placeholder="24 Rue de la Lumière, Suite 3, City"
              />
            </div>
          </section>

          <section className="card-soft p-6">
            <h2 className="font-display text-2xl text-espresso">Booking rules</h2>
            <p className="mt-1 text-sm text-mocha-500">
              Used to generate the available time slots on the booking page.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="field-label inline-flex items-center gap-1.5">
                  <Clock4 className="h-3.5 w-3.5" />
                  Slot Interval (minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={draft.slot_interval_minutes}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      slot_interval_minutes: Number(e.target.value),
                    })
                  }
                  className="field-input"
                />
                <p className="mt-1 text-xs text-mocha-500">
                  Gap between time slot starts (e.g. 30 minutes).
                </p>
              </div>

              <div>
                <label className="field-label inline-flex items-center gap-1.5">
                  <Clock4 className="h-3.5 w-3.5" />
                  Booking Notice (hours)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={draft.booking_notice_hours}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      booking_notice_hours: Number(e.target.value),
                    })
                  }
                  className="field-input"
                />
                <p className="mt-1 text-xs text-mocha-500">
                  Minimum hours before a client can book. Use 2 to avoid last-minute bookings.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {!loading && (
        <div className="flex items-center justify-end gap-3">
          {savedAt && (
            <span className="inline-flex items-center gap-1.5 text-sm text-rosegold-500">
              <CheckCircle2 className="h-4 w-4" />
              Settings saved
            </span>
          )}
          {error && (
            <span className="rounded-full border border-blush-300/60 bg-blush-50 px-3 py-1.5 text-xs text-blush-600">
              {error}
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className={['btn-primary', saving && 'cursor-wait opacity-70'].join(' ')}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              'Save settings'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={['field-input mt-0', icon && 'pl-10'].filter(Boolean).join(' ')}
        />
      </div>
    </div>
  );
}
