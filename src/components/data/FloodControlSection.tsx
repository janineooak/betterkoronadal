import { Heading } from '../ui/Heading';
import LiveDataNote from './LiveDataNote';
import { StatCard, StatusBadge, TableWrap } from './ui';
import { peso, pesoCompact } from '../../lib/format';
import data from '../../data/generated/flood-control.json';

/**
 * DPWH flood-control & drainage projects in Koronadal, pulled from BetterGov's
 * bisto.ph API (api.dpwh.bettergov.ph) by scripts/refresh-data.mjs.
 */
export default function FloodControlSection() {
  const projects = [...data.projects].sort((a, b) =>
    String(b.year ?? '').localeCompare(String(a.year ?? ''))
  );
  const totalCost = projects.reduce((sum, p) => sum + (p.cost ?? 0), 0);
  const completed = projects.filter(p =>
    /complete/i.test(p.status ?? '')
  ).length;

  return (
    <section className="mb-12">
      <Heading level={2}>Flood Control Projects</Heading>
      <p className="mb-6 max-w-3xl text-gray-600">
        DPWH flood-control and drainage projects located in Koronadal City,
        including riverbank protection along the Marbel River. Data is sourced
        from the BetterGov <strong>bisto.ph</strong> infrastructure tracker.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Total contract value" value={pesoCompact(totalCost)} />
        <StatCard
          label="Completed"
          value={completed}
          sub={`of ${projects.length} projects`}
        />
      </div>

      <TableWrap>
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="py-2 pr-4 font-semibold">Project</th>
            <th className="py-2 pr-4 font-semibold">Year</th>
            <th className="py-2 pr-4 font-semibold">Contractor</th>
            <th className="py-2 pr-4 text-right font-semibold">Cost</th>
            <th className="py-2 pr-4 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr
              key={p.contractId ?? p.name}
              className="border-b border-gray-100 align-top"
            >
              <td className="py-2.5 pr-4 text-gray-900">{p.name}</td>
              <td className="py-2.5 pr-4 text-gray-600">{p.year ?? '—'}</td>
              <td className="py-2.5 pr-4 text-gray-600">
                {p.contractor ?? '—'}
              </td>
              <td className="whitespace-nowrap py-2.5 pr-4 text-right text-gray-900">
                {peso(p.cost)}
              </td>
              <td className="py-2.5 pr-4">
                <StatusBadge status={p.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <LiveDataNote
        source="DPWH via bisto.ph (BetterGov)"
        href={data.sourceUrl}
        fetchedAt={data.fetchedAt}
      />
    </section>
  );
}
