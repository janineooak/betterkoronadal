import { Card, CardContent } from '@bettergov/kapwa/card';
import { ExternalLink, Scale } from 'lucide-react';
import { Heading } from '../ui/Heading';
import LiveDataNote from './LiveDataNote';
import { shortDate } from '../../lib/format';
import data from '../../data/generated/congress.json';

const SHOWN = 12;

/**
 * Bills and resolutions in Congress that mention Koronadal, pulled from
 * BetterGov's Open Congress API (open-congress-api.bettergov.ph).
 */
export default function CongressSection() {
  const bills = [...data.bills]
    .sort((a, b) => String(b.dateFiled ?? '').localeCompare(a.dateFiled ?? ''))
    .slice(0, SHOWN);

  return (
    <section className="mb-12">
      <Heading level={2}>Legislation Mentioning Koronadal</Heading>
      <p className="mb-6 max-w-3xl text-gray-600">
        Bills and resolutions filed in Congress that name Koronadal — from
        courthouse creation to local appropriations. Showing {bills.length} of{' '}
        {data.bills.length}, via the BetterGov <strong>Open Congress</strong>{' '}
        API.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {bills.map(b => (
          <a
            key={b.id}
            href={b.url ?? data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card hoverable className="h-full">
              <CardContent>
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700">
                    <Scale className="h-3.5 w-3.5" />
                    {b.id}
                    {b.congress ? ` · ${b.congress}th Congress` : ''}
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
                </div>
                <p className="mt-1.5 font-medium text-gray-900">{b.title}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {b.scope ? `${b.scope} · ` : ''}Filed {shortDate(b.dateFiled)}
                  {b.authors.length ? ` · ${b.authors[0]}` : ''}
                  {b.authors.length > 1 ? ` +${b.authors.length - 1}` : ''}
                </p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <LiveDataNote
        source="Open Congress API (BetterGov)"
        href={data.sourceUrl}
        fetchedAt={data.fetchedAt}
      />
    </section>
  );
}
