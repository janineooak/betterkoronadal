import React from 'react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import {
  MapPin,
  User,
  Users,
  Sparkles,
  UsersRound,
  ExternalLink,
} from 'lucide-react';
import {
  barangays,
  BARANGAYS_SOURCE,
  BARANGAYS_POPULATION_CENSUS,
  BARANGAYS_POPULATION_SOURCE,
  type Barangay,
} from '../data/barangays';

const numberFormat = new Intl.NumberFormat('en-US');

function BarangayCard({ barangay }: { barangay: Barangay }) {
  return (
    <Card className="h-full">
      <CardContent>
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 shrink-0 text-primary-600" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-gray-900">
              Barangay {barangay.name}
            </p>

            <div className="mt-3 flex items-start gap-2">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Punong Barangay:</span>{' '}
                {barangay.punongBarangay}
              </p>
            </div>

            <div className="mt-2 flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">SK Chairperson:</span>{' '}
                {barangay.skChairperson}
              </p>
            </div>

            <div className="mt-2 flex items-start gap-2">
              <UsersRound className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Population:</span>{' '}
                {numberFormat.format(barangay.population)}{' '}
                <span className="text-gray-500">
                  ({BARANGAYS_POPULATION_CENSUS})
                </span>
              </p>
            </div>

            <div className="mt-2 flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold">Barangay Kagawads:</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-gray-600">
                  {barangay.kagawads.map(kagawad => (
                    <li key={kagawad}>{kagawad}</li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={barangay.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary-700 hover:underline"
            >
              View on koronadal.gov.ph
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Barangays: React.FC = () => {
  const totalPopulation = barangays.reduce((sum, b) => sum + b.population, 0);

  return (
    <>
      <SEO
        title="Barangays of Koronadal"
        description="Directory of the 27 barangays of the City of Koronadal (Marbel), South Cotabato — with each barangay's Punong Barangay (Captain), Sangguniang Barangay Kagawads, and SK Chairperson."
        keywords="Koronadal barangays, 27 barangays, Punong Barangay, barangay captain, barangay kagawad, SK chairperson, Marbel, South Cotabato"
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Barangays', href: '/barangays' },
            ]}
          />

          <Heading>Barangays of Koronadal</Heading>
          <p className="mb-4 max-w-3xl text-gray-600">
            The City of Koronadal (Marbel) is made up of{' '}
            <strong>27 barangays</strong> with a combined population of{' '}
            <strong>{numberFormat.format(totalPopulation)}</strong> (
            {BARANGAYS_POPULATION_CENSUS}). Below is each barangay&rsquo;s
            elected leadership &mdash; the Punong Barangay (Barangay Captain),
            the seven Sangguniang Barangay Kagawads, and the Sangguniang
            Kabataan (SK) Chairperson &mdash; along with its population.
          </p>
          <p className="mb-10 max-w-3xl text-sm text-gray-500">
            Officials are sourced from the individual barangay pages on the{' '}
            <a
              href={BARANGAYS_SOURCE}
              target="_blank"
              rel="noreferrer"
              className="text-primary-700 hover:underline"
            >
              official city website
            </a>{' '}
            and may change after each barangay election. Population figures are
            from the{' '}
            <a
              href={BARANGAYS_POPULATION_SOURCE}
              target="_blank"
              rel="noreferrer"
              className="text-primary-700 hover:underline"
            >
              2020 PSA census
            </a>
            . This is an independent community portal, not the official city
            website.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {barangays.map(barangay => (
              <BarangayCard key={barangay.slug} barangay={barangay} />
            ))}
          </div>
        </Section>
      </main>
    </>
  );
};

export default Barangays;
