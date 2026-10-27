import { useEffect, useState } from 'react';

export const field =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-50';

export const SENSITIVE_KINDS = new Set(['court_case', 'concern']);

export const errMsg = (ex: unknown, fallback = 'Something went wrong.') =>
  ex instanceof Error ? ex.message : fallback;

/** Counts down from `seconds` after `start()` is called (for resend links). */
export function useCooldown(seconds: number) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return { left, start: () => setLeft(seconds) };
}

/** Relative time like "3h ago", falling back to a date. */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso).getTime();
  const s = Math.round((Date.now() - d) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
