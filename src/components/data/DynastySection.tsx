import { Users } from 'lucide-react';
import { Heading } from '../ui/Heading';
import LiveDataNote from './LiveDataNote';
import { StatCard, TableWrap } from './ui';
import data from '../../data/generated/dynasty.json';

const SHOWN = 24;

/**
 * Elected Koronadal officials across recent election years, each flagged for
 * membership in a political-family cluster ("dynasty"), from BetterGov's
 * Political Dynasties Explorer (visualizations.bettergov.ph/dynasty).
 */
export default function DynastySection() {
  const officials = [...data.officials].sort(
    (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.name.localeCompare(b.name)
  );
  const dynastyCount = officials.filter(o => o.isDynasty).length;
  const shown = officials.slice(0, SHOWN);

  return (
    <section className="mb-12">
      <Heading level={2}>Political Family Analysis</Heading>
      <p className="mb-6 max-w-3xl text-gray-600">
        An independent look at Koronadal&rsquo;s elected officials across recent
        election years, flagging those the BetterGov{' '}
        <strong>Political Dynasties</strong> project links to a political-family
        cluster. This is analytical context, not an accusation of wrongdoing.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Elected records analyzed"
          value={officials.length}
          sub="across recent election years"
        />
        <StatCard label="Flagged to a political family" value={dynastyCount} />
      </div>

      <TableWrap>
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="py-2 pr-4 font-semibold">Name</th>
            <th className="py-2 pr-4 font-semibold">Position</th>
            <th className="py-2 pr-4 font-semibold">Year</th>
            <th className="py-2 pr-4 font-semibold">Political family</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((o, i) => (
            <tr
              key={`${o.name}-${o.year}-${i}`}
              className="border-b border-gray-100 align-top"
            >
              <td className="py-2.5 pr-4 capitalize text-gray-900">
                {o.name.toLowerCase()}
              </td>
              <td className="py-2.5 pr-4 capitalize text-gray-600">
                {(o.position ?? '—').toLowerCase()}
              </td>
              <td className="py-2.5 pr-4 text-gray-600">{o.year ?? '—'}</td>
              <td className="py-2.5 pr-4">
                {o.isDynasty ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    <Users className="h-3 w-3" />
                    Flagged
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      {officials.length > SHOWN && (
        <p className="mt-2 text-xs text-gray-500">
          Showing {SHOWN} of {officials.length} records — see the full explorer
          for every year and position.
        </p>
      )}

      <LiveDataNote
        source="Political Dynasties Explorer (BetterGov)"
        href={data.sourceUrl}
        fetchedAt={data.fetchedAt}
      />
    </section>
  );
}
