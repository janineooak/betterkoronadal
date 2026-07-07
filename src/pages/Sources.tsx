import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Reference {
  label: string;
  href: string;
  noteKey?: string;
}

interface SourceGroup {
  groupKey: string;
  references: Reference[];
}

const sourceGroups: SourceGroup[] = [
  {
    groupKey: 'profile',
    references: [
      {
        label: 'City Government of Koronadal — official website',
        href: 'https://koronadal.gov.ph',
        noteKey: 'koronadalWebsite',
      },
      {
        label: 'City Government of Koronadal — Facebook page',
        href: 'https://facebook.com/CityGovernmentofKoronadal',
        noteKey: 'koronadalFacebook',
      },
      {
        label: 'Koronadal, South Cotabato — Wikipedia',
        href: 'https://en.wikipedia.org/wiki/Koronadal',
        noteKey: 'wikipedia',
      },
      {
        label: 'Province of South Cotabato',
        href: 'https://southcotabato.gov.ph',
      },
    ],
  },
  {
    groupKey: 'demographics',
    references: [
      {
        label: 'Philippine Statistics Authority (PSA)',
        href: 'https://psa.gov.ph',
        noteKey: 'psa',
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
    groupKey: 'tourism',
    references: [
      {
        label: 'City Government of Koronadal — Culture',
        href: 'https://koronadal.gov.ph/culture/',
        noteKey: 'koronadalCulture',
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
    groupKey: 'transparency',
    references: [
      {
        label: 'DILG — Full Disclosure Policy Portal',
        href: 'https://fdpp.dilg.gov.ph',
        noteKey: 'fdpp',
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
    groupKey: 'weather',
    references: [
      {
        label: 'Open-Meteo — weather data API',
        href: 'https://open-meteo.com',
        noteKey: 'openMeteo',
      },
      {
        label: 'PAGASA — official forecasts & warnings',
        href: 'https://www.pagasa.dost.gov.ph',
      },
    ],
  },
  {
    groupKey: 'news',
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
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('pages.sources.seoTitle')}
        description={t('pages.sources.seoDescription')}
        keywords={t('pages.sources.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.sources.breadcrumbHome'), href: '/' },
              { label: t('pages.sources.breadcrumbSources'), href: '/sources' },
            ]}
          />

          <Heading>{t('pages.sources.title')}</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            {t('pages.sources.intro', { date: 'June 2026' })}
          </p>

          <Card className="mb-10 border-l-4 border-amber-500">
            <CardContent>
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 shrink-0 text-amber-600" />
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">
                    {t('pages.sources.confirmStrong')}
                  </strong>{' '}
                  {t('pages.sources.confirmBody')}{' '}
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
              <Card key={group.groupKey} className="h-full">
                <CardContent>
                  <p className="font-semibold text-gray-900 mb-3">
                    {t(`pages.sources.groups.${group.groupKey}`)}
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
                        {ref.noteKey && (
                          <span className="text-gray-500">
                            {' '}
                            — {t(`pages.sources.items.${ref.noteKey}`)}
                          </span>
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
