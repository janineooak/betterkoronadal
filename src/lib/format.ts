/**
 * Small display helpers for the live-data sections (BetterGov API feeds).
 */

/** Format a peso amount, e.g. 70866458.53 → "₱70,866,459". Null → "—". */
export const peso = (n: number | null | undefined): string =>
  n == null
    ? '—'
    : new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 0,
      }).format(n);

/** Compact peso for large sums, e.g. 70866459 → "₱70.9M". Null → "—". */
export const pesoCompact = (n: number | null | undefined): string =>
  n == null
    ? '—'
    : new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(n);

/** Format an ISO date/timestamp as "7 Jul 2026". Null/invalid → "—". */
export const shortDate = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-PH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
};
