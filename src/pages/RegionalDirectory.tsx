import React from 'react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Building2, UserRound, Phone } from 'lucide-react';
import { lguProvinces, LGU_REGION, type LguEntry } from '../data/lguDirectory';

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

          <div className="space-y-10">
            {lguProvinces.map(province => (
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
        </Section>
      </main>
    </>
  );
};

export default RegionalDirectory;
