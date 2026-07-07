import { Heading } from '../ui/Heading';
import LiveDataNote from './LiveDataNote';
import { StatCard, TableWrap } from './ui';
import { peso, pesoCompact, shortDate } from '../../lib/format';
import data from '../../data/generated/procurements.json';

const SHOWN = 15;

/**
 * Awarded PhilGEPS contracts mentioning Koronadal, pulled from BetterGov's
 * PHILGEPS Awards Data Explorer (philgeps.bettergov.ph).
 */
export default function ProcurementSection() {
  const awards = data.awards;
  const totalValue = awards.reduce((sum, a) => sum + (a.amount ?? 0), 0);
  const top = [...awards]
    .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))
    .slice(0, SHOWN);

  return (
    <section className="mb-12">
      <Heading level={2}>Government Contract Awards</Heading>
      <p className="mb-6 max-w-3xl text-gray-600">
        Recent PhilGEPS contract awards naming Koronadal, from the BetterGov
        <strong> PHILGEPS Awards Data Explorer</strong>. Showing the{' '}
        {top.length} largest of {awards.length.toLocaleString()} recent awards.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Recent awards"
          value={awards.length.toLocaleString()}
        />
        <StatCard label="Combined value" value={pesoCompact(totalValue)} />
      </div>

      <TableWrap>
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="py-2 pr-4 font-semibold">Contract</th>
            <th className="py-2 pr-4 font-semibold">Awardee</th>
            <th className="py-2 pr-4 font-semibold">Awarded</th>
            <th className="py-2 pr-4 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {top.map((a, i) => (
            <tr
              key={`${a.refId}-${i}`}
              className="border-b border-gray-100 align-top"
            >
              <td className="py-2.5 pr-4 text-gray-900">
                {a.title}
                {a.organization && (
                  <span className="block text-xs text-gray-500">
                    {a.organization}
                  </span>
                )}
              </td>
              <td className="py-2.5 pr-4 text-gray-600">{a.awardee ?? '—'}</td>
              <td className="whitespace-nowrap py-2.5 pr-4 text-gray-600">
                {shortDate(a.awardDate)}
              </td>
              <td className="whitespace-nowrap py-2.5 pr-4 text-right text-gray-900">
                {peso(a.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <LiveDataNote
        source="PhilGEPS Awards Explorer (BetterGov)"
        href={data.sourceUrl}
        fetchedAt={data.fetchedAt}
      />
    </section>
  );
}
