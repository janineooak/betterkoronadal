import type { ReactNode } from 'react';

type DataBadgeTone = 'neutral' | 'info' | 'warning';

const toneClasses: Record<DataBadgeTone, string> = {
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
};

interface DataBadgeProps {
  /** Short label, e.g. "Population data: 2020 PSA Census". */
  children: ReactNode;
  /** Optional leading icon (a lucide-react icon element). */
  icon?: ReactNode;
  tone?: DataBadgeTone;
  className?: string;
}

/**
 * A small inline pill for surfacing data provenance/freshness next to a
 * heading — e.g. which census year a figure comes from, or that a live
 * dataset has not been connected yet. Keeps "how current is this?" visible
 * instead of buried in body copy.
 */
function DataBadge({
  children,
  icon,
  tone = 'neutral',
  className = '',
}: DataBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${toneClasses[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

export default DataBadge;
