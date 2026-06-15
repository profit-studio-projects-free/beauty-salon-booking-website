import { useEffect, useState } from 'react';
import { Edit3, Loader2, Plus, Power, PowerOff, X } from 'lucide-react';
import PageHeader from './PageHeader';
import { supabase } from '../../lib/supabase';
import type { Service } from '../../lib/types';
import { formatDuration, formatPrice } from '../../lib/format';
import { imageForService } from '../../lib/images';

interface DraftService {
  id?: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}

const EMPTY_DRAFT: DraftService = {
  name: '',
  description: '',
  duration_minutes: 60,
  price: 0,
  is_active: true,
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DraftService>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('is_active', { ascending: false })
      .order('price', { ascending: true });
    setServices((data as Service[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setDraft(EMPTY_DRAFT);
    setError(null);
    setOpen(true);
  }

  function startEdit(s: Service) {
    setDraft({
      id: s.id,
      name: s.name,
      description: s.description ?? '',
      duration_minutes: s.duration_minutes,
      price: s.price,
      is_active: s.is_active,
    });
    setError(null);
    setOpen(true);
  }

  async function save() {
    setError(null);
    if (!draft.name.trim() || draft.duration_minutes < 5 || draft.price < 0) {
      setError('Please enter a name, duration (5+ min), and a non-negative price.');
      return;
    }
    setSaving(true);

    const payload = {
      name: draft.name.trim(),
      description: draft.description.trim() || null,
      duration_minutes: Math.round(draft.duration_minutes),
      price: Number(draft.price),
      is_active: draft.is_active,
    };

    const { error: err } =
      draft.id
        ? await supabase.from('services').update(payload).eq('id', draft.id)
        : await supabase.from('services').insert(payload);

    setSaving(false);

    if (err) {
      setError(err.message);
      return;
    }

    setOpen(false);
    await load();
  }

  async function toggleActive(s: Service) {
    setBusyId(s.id);
    const { error: err } = await supabase
      .from('services')
      .update({ is_active: !s.is_active })
      .eq('id', s.id);
    setBusyId(null);
    if (!err) {
      setServices((prev) =>
        prev.map((row) =>
          row.id === s.id ? { ...row, is_active: !s.is_active } : row,
        ),
      );
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Services"
        title="The studio menu"
        subtitle="Add, edit, or pause services. Inactive services stay here but are hidden from the booking page."
        actions={
          <button onClick={startCreate} className="btn-primary">
            <Plus className="h-4 w-4" />
            New service
          </button>
        }
      />

      {loading ? (
        <div className="card-soft flex items-center justify-center gap-2 py-20 text-sm text-mocha-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading services…
        </div>
      ) : services.length === 0 ? (
        <div className="card-soft px-6 py-16 text-center">
          <p className="font-display text-2xl text-espresso">
            No services yet.
          </p>
          <p className="mt-2 text-sm text-mocha-500">
            Create your first service to start taking appointments.
          </p>
          <button onClick={startCreate} className="btn-primary mt-6">
            <Plus className="h-4 w-4" /> Create a service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s) => {
            const img = imageForService(s.name);
            return (
              <article
                key={s.id}
                className={[
                  'group flex flex-col overflow-hidden rounded-3xl border bg-ivory/80 shadow-softer transition-all hover:-translate-y-0.5 hover:shadow-soft',
                  s.is_active ? 'border-pearl/70' : 'border-pearl/70 opacity-80',
                ].join(' ')}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 to-transparent" />
                  <div className="absolute right-3 top-3">
                    <span
                      className={[
                        'badge',
                        s.is_active
                          ? 'bg-rosegold-100 text-rosegold-500'
                          : 'bg-blush-100 text-blush-600',
                      ].join(' ')}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {s.is_active ? 'Live' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl leading-tight text-espresso">
                      {s.name}
                    </h3>
                    <span className="font-display text-lg text-rosegold-400">
                      {formatPrice(s.price)}
                    </span>
                  </div>
                  {s.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mocha-600">
                      {s.description}
                    </p>
                  )}
                  <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider-2 text-mocha-500">
                    {formatDuration(s.duration_minutes)}
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <button
                      onClick={() => startEdit(s)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-mocha-400/25 px-3 py-2 text-xs font-medium text-mocha-700 transition hover:border-rosegold-300 hover:bg-rosegold-100/40 hover:text-espresso"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(s)}
                      disabled={busyId === s.id}
                      className={[
                        'inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition',
                        s.is_active
                          ? 'border-mocha-400/25 text-mocha-700 hover:border-blush-300 hover:bg-blush-50'
                          : 'border-mocha-400/25 text-mocha-700 hover:border-rosegold-300 hover:bg-rosegold-100/40',
                      ].join(' ')}
                    >
                      {s.is_active ? (
                        <>
                          <PowerOff className="h-3.5 w-3.5" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="h-3.5 w-3.5" />
                          Activate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {open && (
        <ServiceModal
          draft={draft}
          setDraft={setDraft}
          onClose={() => setOpen(false)}
          onSave={save}
          saving={saving}
          error={error}
        />
      )}
    </div>
  );
}

function ServiceModal({
  draft,
  setDraft,
  onClose,
  onSave,
  saving,
  error,
}: {
  draft: DraftService;
  setDraft: (d: DraftService) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/40 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="w-full max-w-xl rounded-t-3xl bg-ivory shadow-glow sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-pearl/70 px-6 py-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider-2 text-mocha-500">
              {draft.id ? 'Edit service' : 'New service'}
            </div>
            <h2 className="font-display text-2xl text-espresso">
              {draft.id ? draft.name || 'Edit service' : 'Add a new beauty service'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-mocha-400/30 hover:border-mocha-500"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div>
            <label className="field-label">Name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Signature Facial"
              className="field-input"
            />
          </div>

          <div>
            <label className="field-label">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={3}
              placeholder="What's included, who it's for, the result your client will feel…"
              className="field-textarea"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Duration (minutes)</label>
              <input
                type="number"
                min={5}
                step={5}
                value={draft.duration_minutes}
                onChange={(e) =>
                  setDraft({ ...draft, duration_minutes: Number(e.target.value) })
                }
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Price</label>
              <input
                type="number"
                min={0}
                step={1}
                value={draft.price}
                onChange={(e) =>
                  setDraft({ ...draft, price: Number(e.target.value) })
                }
                className="field-input"
              />
            </div>
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-pearl/70 bg-white/70 px-4 py-3">
            <div>
              <div className="text-sm font-medium text-espresso">Active</div>
              <div className="text-xs text-mocha-500">
                When off, the service stays hidden from the public booking page.
              </div>
            </div>
            <Switch
              checked={draft.is_active}
              onChange={(v) => setDraft({ ...draft, is_active: v })}
            />
          </label>

          {error && (
            <div className="rounded-2xl border border-blush-300/60 bg-blush-50 px-4 py-3 text-sm text-blush-600">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-pearl/70 px-6 py-5">
          <button onClick={onClose} className="btn-ghost" disabled={saving}>
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className={['btn-primary', saving && 'cursor-wait opacity-70'].join(' ')}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : draft.id ? (
              'Save changes'
            ) : (
              'Create service'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
        checked ? 'bg-rosegold-400' : 'bg-mocha-400/30',
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  );
}
