import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@bettergov/kapwa/card';

interface StatCardProps {
  /** Short label, e.g. "Total Population". */
  label: string;
  /** Headline value, e.g. "201,844". */
  value: string;
  /** Optional supporting line under the value. */
  subtext?: string;
  /** Optional Lucide icon component. */
  icon?: LucideIcon;
}

/**
 * A compact metric card for statistics pages: a labelled headline figure with
 * an optional icon and supporting note. Mirrors the Card pattern used across
 * the portal.
 */
export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="h-full">
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {label}
          </p>
          {Icon && (
            <Icon className="h-5 w-5 shrink-0 text-primary-600" aria-hidden />
          )}
        </div>
        <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        {subtext && <p className="mt-1 text-sm text-gray-600">{subtext}</p>}
      </CardContent>
    </Card>
  );
}
