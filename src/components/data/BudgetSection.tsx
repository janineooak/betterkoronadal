import { Heading } from '../ui/Heading';
import LiveDataNote from './LiveDataNote';
import { StatCard, TableWrap } from './ui';
import { peso, pesoCompact } from '../../lib/format';
import data from '../../data/generated/budget.json';

const SHOWN = 15;

// GAA figures are stored in thousands of pesos; convert to actual pesos.
const toPesos = (thousands: number | null) =>
  thousands == null ? null : thousands * 1000;

/**
 * National budget (General Appropriations Act) line items naming Koronadal,
 * pulled from BetterGov's Transparency dashboard (transparency.bettergov.ph).
 */
export default function BudgetSection() {
  const items = data.items;
  const withAmount = items.filter(i => i.amountThousands);
  const total = withAmount.reduce(
    (sum, i) => sum + (toPesos(i.amountThousands) ?? 0),
    0
  );
  const top = [...withAmount]
    .sort((a, b) => (b.amountThousands ?? 0) - (a.amountThousands ?? 0))
    .slice(0, SHOWN);

  return (
    <section className="mb-12">
      <Heading level={2}>National Budget for Koronadal</Heading>
      <p className="mb-6 max-w-3xl text-gray-600">
        General Appropriations Act (GAA) line items that name Koronadal — the
        national government projects and allocations flowing into the city.
        Sourced from the BetterGov <strong>Transparency</strong> dashboard.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Budget line items"
          value={items.length.toLocaleString()}
          sub="mentioning Koronadal"
        />
        <StatCard label="Allocated (shown items)" value={pesoCompact(total)} />
      </div>

      <TableWrap>
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="py-2 pr-4 font-semibold">Project / Item</th>
            <th className="py-2 pr-4 font-semibold">Department</th>
            <th className="py-2 pr-4 font-semibold">Year</th>
            <th className="py-2 pr-4 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {top.map((i, idx) => (
            <tr
              key={`${i.id}-${idx}`}
              className="border-b border-gray-100 align-top"
            >
              <td className="py-2.5 pr-4 text-gray-900">{i.description}</td>
              <td className="py-2.5 pr-4 text-gray-600">
                {i.department ?? '—'}
              </td>
              <td className="py-2.5 pr-4 text-gray-600">{i.year ?? '—'}</td>
              <td className="whitespace-nowrap py-2.5 pr-4 text-right text-gray-900">
                {peso(toPesos(i.amountThousands))}
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <LiveDataNote
        source="Transparency dashboard (BetterGov)"
        href={data.sourceUrl}
        fetchedAt={data.fetchedAt}
      />
    </section>
  );
}
