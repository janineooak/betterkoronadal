import type { ReactNode } from 'react';

/** A compact headline metric used above the live-data tables. */
export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-gray-700">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

/** A small colored pill for a project/award status. */
export function StatusBadge({ status }: { status: string | null }) {
  const s = (status || '').toLowerCase();
  const cls =
    s.includes('complete') || s.includes('active') || s.includes('award')
      ? 'bg-green-100 text-green-800'
      : s.includes('ongoing') || s.includes('progress')
        ? 'bg-blue-100 text-blue-800'
        : s.includes('terminat') || s.includes('cancel')
          ? 'bg-red-100 text-red-800'
          : 'bg-gray-100 text-gray-700';
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}
    >
      {status || '—'}
    </span>
  );
}

/** Shared wrapper giving tables a horizontal scroll on small screens. */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-3 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        {children}
      </table>
    </div>
  );
}
