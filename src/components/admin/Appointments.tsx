import { useEffect, useMemo, useState } from 'react';
import { Filter, Loader2, Mail, Phone, Search, X } from 'lucide-react';
import PageHeader from './PageHeader';
import { StatusBadge, prettyDate, prettyTime } from './Overview';
import { supabase } from '../../lib/supabase';
import type { Appointment, AppointmentStatus, Service } from '../../lib/types';
import { formatDuration, formatPrice, initialsFromName } from '../../lib/format';

const STATUSES: { value: AppointmentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function Appointments() {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [a, s] = await Promise.all([
      supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false })
        .order('start_time', { ascending: false }),
      supabase.from('services').select('*'),
    ]);
    setAppts((a.data as Appointment[]) ?? []);
    setServices((s.data as Service[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const serviceById = useMemo(
    () => new Map(services.map((s) => [s.id, s])),
    [services],
  );

  const filtered = useMemo(() => {
    return appts.filter((a) => {
      if (filter !== 'all' && a.status !== filter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const svc = serviceById.get(a.service_id)?.name ?? '';
        return (
          a.full_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.phone.toLowerCase().includes(q) ||
          svc.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [appts, filter, query, serviceById]);

  async function updateStatus(id: string, status: AppointmentStatus) {
    setUpdatingId(id);
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);
    setUpdatingId(null);
    if (!error) {
      setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
  }

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: appts.length };
    for (const a of appts) map[a.status] = (map[a.status] || 0) + 1;
    return map;
  }, [appts]);

  const openAppt = openId ? appts.find((a) => a.id === openId) : null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Appointments"
        title="Manage your bookings"
        subtitle="Filter, search and update the status of every client request."
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUSES.map((s) => {
            const active = filter === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setFilter(s.value)}
                className={[
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider-2 transition-all',
                  active
                    ? 'border-espresso bg-espresso text-ivory'
                    : 'border-pearl bg-white/70 text-mocha-600 hover:border-mocha-400',
                ].join(' ')}
              >
                <Filter className="h-3 w-3" />
                {s.label}
                {counts[s.value] !== undefined && (
                  <span
                    className={[
                      'rounded-full px-1.5 py-px text-[10px]',
                      active ? 'bg-ivory/15 text-ivory' : 'bg-pearl text-mocha-600',
                    ].join(' ')}
                  >
                    {counts[s.value]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mocha-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, service…"
            className="field-input mt-0 pl-10"
          />
        </div>
      </div>

      <div className="card-soft overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-mocha-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading appointments…
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <p className="font-display text-2xl text-espresso">
              Nothing here yet.
            </p>
            <p className="mt-2 text-sm text-mocha-500">
              When a client books, their request will appear in this list.
            </p>
          </div>
        ) : (
          <div className="admin-scroll overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-pearl/70 bg-cream/40 text-[11px] uppercase tracking-wider-2 text-mocha-500">
                  <th className="px-6 py-4 text-left">Client</th>
                  <th className="px-6 py-4 text-left">Service</th>
                  <th className="px-6 py-4 text-left">When</th>
                  <th className="px-6 py-4 text-left">Contact</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pearl/70">
                {filtered.map((a) => {
                  const svc = serviceById.get(a.service_id);
                  return (
                    <tr
                      key={a.id}
                      className="cursor-pointer transition hover:bg-cream/40"
                      onClick={() => setOpenId(a.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rosegold-100 to-rosegold-300 text-[11px] font-semibold text-espresso">
                            {initialsFromName(a.full_name)}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-espresso">
                              {a.full_name}
                            </div>
                            {a.notes && (
                              <div className="mt-0.5 line-clamp-1 text-xs text-mocha-500">
                                “{a.notes}”
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-espresso">
                          {svc?.name ?? '—'}
                        </div>
                        <div className="text-xs text-mocha-500">
                          {svc ? formatDuration(svc.duration_minutes) : '—'} ·{' '}
                          {svc ? formatPrice(svc.price) : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-espresso">
                          {prettyDate(a.appointment_date)}
                        </div>
                        <div className="text-xs text-mocha-500">
                          {prettyTime(a.start_time)} – {prettyTime(a.end_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-mocha-600">
                          <Mail className="h-3 w-3" />
                          {a.email}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-mocha-600">
                          <Phone className="h-3 w-3" />
                          {a.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className="inline-flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <StatusDropdown
                            value={a.status}
                            onChange={(s) => updateStatus(a.id, s)}
                            loading={updatingId === a.id}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {openAppt && (
        <DetailsDrawer
          appt={openAppt}
          service={serviceById.get(openAppt.service_id) ?? null}
          onClose={() => setOpenId(null)}
          onUpdate={(s) => updateStatus(openAppt.id, s)}
          updating={updatingId === openAppt.id}
        />
      )}
    </div>
  );
}

function StatusDropdown({
  value,
  onChange,
  loading,
}: {
  value: AppointmentStatus;
  onChange: (s: AppointmentStatus) => void;
  loading: boolean;
}) {
  return (
    <select
      value={value}
      disabled={loading}
      onChange={(e) => onChange(e.target.value as AppointmentStatus)}
      className="rounded-full border border-mocha-400/25 bg-white/80 px-3 py-1.5 text-xs font-medium text-espresso outline-none transition focus:border-rosegold-300 focus:ring-2 focus:ring-rosegold-200/50"
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}

function DetailsDrawer({
  appt,
  service,
  onClose,
  onUpdate,
  updating,
}: {
  appt: Appointment;
  service: Service | null;
  onClose: () => void;
  onUpdate: (s: AppointmentStatus) => void;
  updating: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        onClick={onClose}
        className="flex-1 bg-espresso/30 backdrop-blur-sm"
        aria-label="Close drawer"
      />
      <aside className="relative flex w-full max-w-md flex-col bg-ivory shadow-glow">
        <div className="flex items-center justify-between border-b border-pearl/70 px-6 py-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider-2 text-mocha-500">
              Appointment
            </div>
            <div className="font-display text-2xl text-espresso">
              {appt.full_name}
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-mocha-400/30 hover:border-mocha-500"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="admin-scroll flex-1 overflow-y-auto px-6 py-6">
          <DetailRow label="Service" value={service?.name ?? '—'} />
          <DetailRow
            label="Duration"
            value={service ? formatDuration(service.duration_minutes) : '—'}
          />
          <DetailRow
            label="Investment"
            value={service ? formatPrice(service.price) : '—'}
          />
          <div className="my-5 divider-thin" />
          <DetailRow label="Date" value={prettyDate(appt.appointment_date)} />
          <DetailRow
            label="Time"
            value={`${prettyTime(appt.start_time)} – ${prettyTime(appt.end_time)}`}
          />
          <div className="my-5 divider-thin" />
          <DetailRow label="Email" value={appt.email} />
          <DetailRow label="Phone" value={appt.phone} />
          {appt.notes && (
            <div className="mt-4 rounded-2xl border border-pearl/70 bg-cream/40 p-4">
              <div className="text-[10px] uppercase tracking-wider-2 text-mocha-500">
                Notes
              </div>
              <p className="mt-1 text-sm text-espresso">{appt.notes}</p>
            </div>
          )}
        </div>

        <div className="border-t border-pearl/70 px-6 py-5">
          <div className="text-[11px] uppercase tracking-wider-2 text-mocha-500">
            Update status
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['pending', 'confirmed', 'completed', 'cancelled'] as AppointmentStatus[]).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => onUpdate(s)}
                  disabled={updating || appt.status === s}
                  className={[
                    'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider-2 transition',
                    appt.status === s
                      ? 'border-espresso bg-espresso text-ivory'
                      : 'border-pearl bg-white/70 text-mocha-700 hover:border-mocha-400',
                  ].join(' ')}
                >
                  {s}
                </button>
              ),
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-[11px] uppercase tracking-wider-2 text-mocha-500">
        {label}
      </span>
      <span className="text-right text-sm font-medium text-espresso">
        {value}
      </span>
    </div>
  );
}
