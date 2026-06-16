import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Info } from 'lucide-react';

interface Reference {
  label: string;
  href: string;
  note?: string;
}

interface SourceGroup {
  topic: string;
  intro?: string;
  references: Reference[];
}

const sourceGroups: SourceGroup[] = [
  {
    topic: 'City profile, history & officials',
    references: [
      {
        label: 'City Government of Koronadal — official website',
        href: 'https://koronadal.gov.ph',
        note: 'Officials, departments, history, contact details',
      },
      {
        label: 'City Government of Koronadal — Facebook page',
        href: 'https://facebook.com/CityGovernmentofKoronadal',
        note: 'Advisories and official announcements',
      },
      {
        label: 'Koronadal, South Cotabato — Wikipedia',
        href: 'https://en.wikipedia.org/wiki/Koronadal',
        note: 'History (EO 82, RA 4849, RA 8803), geography, etymology',
      },
      {
        label: 'Province of South Cotabato',
        href: 'https://southcotabato.gov.ph',
      },
    ],
  },
  {
    topic: 'Population, demographics & statistics',
    references: [
      {
        label: 'Philippine Statistics Authority (PSA)',
        href: 'https://psa.gov.ph',
        note: '2024 (201,844) and 2020 (195,398) census figures, land area',
      },
      {
        label: 'PSA SOCCSKSARGEN (Region XII)',
        href: 'https://rsso12.psa.gov.ph',
      },
      {
        label: 'Open Data Philippines',
        href: 'https://data.gov.ph',
      },
    ],
  },
  {
    topic: 'Tourism & culture',
    references: [
      {
        label: 'City Government of Koronadal — Culture',
        href: 'https://koronadal.gov.ph/culture/',
        note: 'Hinugyaw Festival, heritage sites, cultural values',
      },
      {
        label: 'Vigattin Tourism — Araw ng Koronadal "Hinugyaw Festival"',
        href: 'https://www.vigattintourism.com/tourism/articles/Araw-ng-Koronadal-Hinugayaw-Festival',
      },
      {
        label: 'Camella — Top Things to Do in Koronadal City',
        href: 'https://www.camella.com.ph/top-things-to-do-in-koronadal-city-south-cotabato-philippines/',
      },
    ],
  },
  {
    topic: 'Transparency, budget & procurement',
    references: [
      {
        label: 'DILG — Full Disclosure Policy Portal',
        href: 'https://fdpp.dilg.gov.ph',
        note: 'DILG Memorandum Circular 2011-134',
      },
      {
        label: 'DILG Region XII — Full Disclosure Policy',
        href: 'https://region12.dilg.gov.ph/programs-projects/full-disclosure-policy-fdp',
      },
      {
        label: 'PhilGEPS — Government procurement (RA 9184)',
        href: 'https://www.philgeps.gov.ph',
      },
      {
        label: 'Commission on Audit (COA)',
        href: 'https://www.coa.gov.ph',
      },
      {
        label: 'eFOI — Freedom of Information',
        href: 'https://www.foi.gov.ph',
      },
    ],
  },
  {
    topic: 'Weather & hazards',
    references: [
      {
        label: 'Open-Meteo — weather data API',
        href: 'https://open-meteo.com',
        note: 'Powers the homepage weather widget',
      },
      {
        label: 'PAGASA — official forecasts & warnings',
        href: 'https://www.pagasa.dost.gov.ph',
      },
    ],
  },
  {
    topic: 'News & reporting (for verifying officials and events)',
    references: [
      {
        label: 'Philippine News Agency (PNA)',
        href: 'https://www.pna.gov.ph',
      },
      { label: 'Rappler', href: 'https://www.rappler.com' },
      { label: 'Politiko Mindanao', href: 'https://mindanao.politics.com.ph' },
    ],
  },
];

const Sources: React.FC = () => {
  return (
    <>
      <SEO
        title="Sources & References"
        description="The sources behind BetterKoronadal.org — official City Government of Koronadal pages, the Philippine Statistics Authority, DILG, PhilGEPS, PAGASA, and other references used to compile the information on this site."
        keywords="Koronadal sources, references, citations, PSA, DILG, koronadal.gov.ph, data sources"
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Sources', href: '/sources' },
            ]}
          />

          <Heading>Sources &amp; References</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            BetterKoronadal.org is an independent, community-built portal. The
            information here is compiled from official government sources and
            reputable references, and re-verified periodically. The facts on
            this site were last reviewed in <strong>June 2026</strong>.
          </p>

          <Card className="mb-10 border-l-4 border-amber-500">
            <CardContent>
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 shrink-0 text-amber-600" />
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">
                    Always confirm time-sensitive details with the official
                    source.
                  </strong>{' '}
                  Officials, contact numbers, schedules, and fees can change.
                  For anything official, refer to{' '}
                  <a
                    href="https://koronadal.gov.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 underline"
                  >
                    koronadal.gov.ph
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {sourceGroups.map(group => (
              <Card key={group.topic} className="h-full">
                <CardContent>
                  <p className="font-semibold text-gray-900 mb-3">
                    {group.topic}
                  </p>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                    {group.references.map(ref => (
                      <li key={ref.href + ref.label}>
                        <a
                          href={ref.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-700 underline hover:text-primary-800"
                        >
                          {ref.label}
                        </a>
                        {ref.note && (
                          <span className="text-gray-500"> — {ref.note}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </main>
    </>
  );
};

export default Sources;
