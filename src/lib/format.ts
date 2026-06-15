export function formatPrice(value: number): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDuration(minutes: number): string {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

export function initialsFromName(name: string): string {
  if (!name) return '·';
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}
