import React, { useMemo, useState } from 'react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Building2, UserRound, Phone, Search, X } from 'lucide-react';
import { lguProvinces, LGU_REGION, type LguEntry } from '../data/lguDirectory';

const entryText = (entry: LguEntry) =>
  `${entry.name} ${entry.mayor?.name ?? ''} ${entry.viceMayor?.name ?? ''}`.toLowerCase();

function LguCard({ entry }: { entry: LguEntry }) {
  return (
    <Card className="h-full">
      <CardContent>
        <div className="flex items-start gap-3">
          <Building2 className="h-5 w-5 shrink-0 text-primary-600" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-gray-900">
              {entry.name}
              {entry.zipCode && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  {entry.zipCode}
                </span>
              )}
            </p>

            {entry.mayor && (
              <div className="mt-3 flex items-start gap-2">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Mayor:</span>{' '}
                  {entry.mayor.name}
                  {entry.mayor.contact && (
                    <span className="block text-xs text-gray-500">
                      <Phone className="mr-1 inline h-3 w-3" />
                      {entry.mayor.contact}
                    </span>
                  )}
                </p>
              </div>
            )}

            {entry.viceMayor && (
              <div className="mt-2 flex items-start gap-2">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Vice Mayor:</span>{' '}
                  {entry.viceMayor.name}
                  {entry.viceMayor.contact && (
                    <span className="block text-xs text-gray-500">
                      <Phone className="mr-1 inline h-3 w-3" />
                      {entry.viceMayor.contact}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const RegionalDirectory: React.FC = () => {
  const [query, setQuery] = useState('');

  const totalCount = useMemo(
    () => lguProvinces.reduce((sum, p) => sum + p.entries.length, 0),
    []
  );

  const filteredProvinces = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lguProvinces;
    return lguProvinces
      .map(province => ({
        ...province,
        entries: province.entries.filter(entry => entryText(entry).includes(q)),
      }))
      .filter(province => province.entries.length > 0);
  }, [query]);

  const shownCount = filteredProvinces.reduce(
    (sum, p) => sum + p.entries.length,
    0
  );

  return (
    <>
      <SEO
        title="Regional LGU Directory (SOCCSKSARGEN)"
        description="Directory of the cities and municipalities of Region XII (SOCCSKSARGEN) — South Cotabato, Cotabato, and Sultan Kudarat — with each LGU's mayor and vice mayor."
        keywords="SOCCSKSARGEN LGU directory, Region XII mayors, South Cotabato municipalities, Sultan Kudarat, Cotabato, vice mayor"
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Regional LGU Directory', href: '/regional-directory' },
            ]}
          />

          <Heading>Regional LGU Directory</Heading>
          <p className="mb-4 max-w-3xl text-gray-600">
            The cities and municipalities of <strong>{LGU_REGION}</strong> —
            Koronadal&rsquo;s neighbours across South Cotabato, Cotabato, and
            Sultan Kudarat — with each local government&rsquo;s mayor and vice
            mayor.
          </p>
          <p className="mb-10 max-w-3xl text-sm text-gray-500">
            Sourced from the BetterGov.ph government directory. Officials change
            after each election — verify against the individual LGU before
            relying on these details. This is an independent community portal.
          </p>

          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search city, municipality, or mayor…"
                aria-label="Search city, municipality, or mayor"
                className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-9 text-sm text-gray-800 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500" aria-live="polite">
              Showing {shownCount} of {totalCount} LGUs
            </p>
          </div>

          {filteredProvinces.length > 0 ? (
            <div className="space-y-10">
              {filteredProvinces.map(province => (
                <div key={province.province}>
                  <Heading level={2}>{province.province}</Heading>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {province.entries.map(entry => (
                      <LguCard key={entry.name} entry={entry} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              No LGUs match “{query}”.
            </div>
          )}
        </Section>
      </main>
    </>
  );
};

export default RegionalDirectory;
