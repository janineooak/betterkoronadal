import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router-dom';
import { MapPin, Users, Landmark, CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const quickFacts = [
  { label: 'Also known as', value: 'Marbel' },
  { label: 'Province', value: 'South Cotabato (capital)' },
  { label: 'Region', value: 'Region XII (SOCCSKSARGEN)' },
  { label: 'City classification', value: 'Component city' },
  { label: 'Population (2024)', value: '201,844' },
  { label: 'Land area', value: '277.00 km²' },
  { label: 'Barangays', value: '27' },
  { label: 'ZIP code', value: '9506' },
];

const barangays = [
  'Assumption',
  'Avanceña',
  'Cacub',
  'Caloocan',
  'Carpenter Hill',
  'Concepcion',
  'Esperanza',
  'General Paulino Santos',
  'Mabini',
  'Magsaysay',
  'Mambucal',
  'Morales',
  'Namnama',
  'New Pangasinan',
  'Paraiso',
  'Rotonda',
  'San Isidro',
  'San Jose',
  'San Roque',
  'Santa Cruz',
  'Santo Niño',
  'Sarabia',
  'Zone I',
  'Zone II',
  'Zone III',
  'Zone IV',
  'Zulueta',
];

const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('pages.about.seoTitle')}
        description={t('pages.about.seoDescription')}
        keywords={t('pages.about.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.about.breadcrumbHome'), href: '/' },
              { label: t('pages.about.breadcrumbAbout'), href: '/about' },
            ]}
          />

          <Heading>{t('pages.about.heroTitle')}</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            {t('pages.about.introLead')} <strong>City of Koronadal</strong>{' '}
            {t('pages.about.introAlso')} <strong>Marbel</strong>{' '}
            {t('pages.about.introCapital')} <strong>South Cotabato</strong>{' '}
            {t('pages.about.introRegional')}{' '}
            <strong>SOCCSKSARGEN (Region XII)</strong>.{' '}
            {t('pages.about.introHub')}{' '}
            <em>&ldquo;{t('pages.about.hubOfTheSouth')}&rdquo;</em>{' '}
            {t('pages.about.introResidents')}
          </p>
          <p className="text-gray-600 mb-8 max-w-3xl">
            {t('pages.about.visionLead')}{' '}
            <strong>
              &ldquo;One People, One Big Dream, One Koronadal!&rdquo;
            </strong>
          </p>

          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-12">
            {quickFacts.map(fact => (
              <Card key={fact.label} className="h-full">
                <CardContent>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {fact.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-900">
                    {fact.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* History */}
          <Heading level={2}>{t('pages.about.historyHeading')}</Heading>
          <div className="max-w-3xl space-y-4 text-gray-700 mb-12">
            <p>{t('pages.about.historyP1')}</p>
            <p>{t('pages.about.historyP2')}</p>
            <p>{t('pages.about.historyP3')}</p>
            <p>
              <Link
                to="/history"
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                {t('pages.about.historyLink')} &rarr;
              </Link>
            </p>
          </div>

          {/* At a glance icons */}
          <Heading level={2}>{t('pages.about.glanceHeading')}</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <Card className="h-full">
              <CardContent>
                <Landmark className="h-6 w-6 text-primary-600 mb-2" />
                <p className="font-semibold text-gray-900">
                  {t('pages.about.glanceCapitalTitle')}
                </p>
                <p className="text-sm text-gray-600">
                  {t('pages.about.glanceCapitalDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent>
                <MapPin className="h-6 w-6 text-primary-600 mb-2" />
                <p className="font-semibold text-gray-900">
                  {t('pages.about.glanceRegionalTitle')}
                </p>
                <p className="text-sm text-gray-600">
                  {t('pages.about.glanceRegionalDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent>
                <Users className="h-6 w-6 text-primary-600 mb-2" />
                <p className="font-semibold text-gray-900">
                  {t('pages.about.glanceResidentsTitle', { value: '201,844' })}
                </p>
                <p className="text-sm text-gray-600">
                  {t('pages.about.glanceResidentsDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent>
                <CalendarDays className="h-6 w-6 text-primary-600 mb-2" />
                <p className="font-semibold text-gray-900">
                  {t('pages.about.glanceCityhoodTitle', { year: '2000' })}
                </p>
                <p className="text-sm text-gray-600">
                  {t('pages.about.glanceCityhoodDesc')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Barangays */}
          <Heading level={2}>
            {t('pages.about.barangaysHeading', { value: '27' })}
          </Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            {t('pages.about.barangaysIntro')}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 mb-12">
            {barangays.map(name => (
              <div
                key={name}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Links */}
          <Heading level={2}>{t('pages.about.learnMoreHeading')}</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl">
            <Link to="/government/departments">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    {t('pages.about.linkGovernmentTitle')}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {t('pages.about.linkGovernmentDesc')}
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/services">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    {t('pages.about.linkServicesTitle')}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {t('pages.about.linkServicesDesc')}
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/contact">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    {t('pages.about.linkContactTitle')}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {t('pages.about.linkContactDesc')}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <SourceNote
            verified="June 2026"
            sources={[
              {
                label: t('pages.about.source1Label'),
                href: 'https://koronadal.gov.ph',
                note: t('pages.about.source1Note'),
              },
              {
                label: t('pages.about.source2Label'),
                href: 'https://psa.gov.ph',
                note: t('pages.about.source2Note'),
              },
              {
                label: t('pages.about.source3Label'),
                href: 'https://en.wikipedia.org/wiki/Koronadal',
                note: t('pages.about.source3Note'),
              },
            ]}
          />
        </Section>
      </main>
    </>
  );
};

export default About;
