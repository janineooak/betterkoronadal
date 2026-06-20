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
import { useTranslation } from 'react-i18next';

const numberFormat = new Intl.NumberFormat('en-US');

function BarangayCard({ barangay }: { barangay: Barangay }) {
  const { t } = useTranslation();
  return (
    <Card className="h-full">
      <CardContent>
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 shrink-0 text-primary-600" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-gray-900">
              {t('pages.barangays.barangayPrefix')} {barangay.name}
            </p>

            <div className="mt-3 flex items-start gap-2">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">
                  {t('pages.barangays.punongBarangayLabel')}
                </span>{' '}
                {barangay.punongBarangay}
              </p>
            </div>

            <div className="mt-2 flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">
                  {t('pages.barangays.skChairpersonLabel')}
                </span>{' '}
                {barangay.skChairperson}
              </p>
            </div>

            <div className="mt-2 flex items-start gap-2">
              <UsersRound className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">
                  {t('pages.barangays.populationLabel')}
                </span>{' '}
                {numberFormat.format(barangay.population)}{' '}
                <span className="text-gray-500">
                  ({BARANGAYS_POPULATION_CENSUS})
                </span>
              </p>
            </div>

            <div className="mt-2 flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold">
                  {t('pages.barangays.kagawadsLabel')}
                </p>
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
              {t('pages.barangays.viewOnKoronadal')}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Barangays: React.FC = () => {
  const { t } = useTranslation();
  const totalPopulation = barangays.reduce((sum, b) => sum + b.population, 0);

  return (
    <>
      <SEO
        title={t('pages.barangays.seoTitle')}
        description={t('pages.barangays.seoDescription')}
        keywords={t('pages.barangays.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.barangays.breadcrumbHome'), href: '/' },
              {
                label: t('pages.barangays.breadcrumbBarangays'),
                href: '/barangays',
              },
            ]}
          />

          <Heading>{t('pages.barangays.title')}</Heading>
          <p className="mb-4 max-w-3xl text-gray-600">
            {t('pages.barangays.introBefore')}{' '}
            <strong>{t('pages.barangays.intro27Barangays')}</strong>{' '}
            {t('pages.barangays.introCombined')}{' '}
            <strong>{numberFormat.format(totalPopulation)}</strong> (
            {BARANGAYS_POPULATION_CENSUS}). {t('pages.barangays.introAfter')}
          </p>
          <p className="mb-10 max-w-3xl text-sm text-gray-500">
            {t('pages.barangays.sourceBefore')}{' '}
            <a
              href={BARANGAYS_SOURCE}
              target="_blank"
              rel="noreferrer"
              className="text-primary-700 hover:underline"
            >
              {t('pages.barangays.officialCityWebsite')}
            </a>{' '}
            {t('pages.barangays.sourceMiddle')}{' '}
            <a
              href={BARANGAYS_POPULATION_SOURCE}
              target="_blank"
              rel="noreferrer"
              className="text-primary-700 hover:underline"
            >
              {t('pages.barangays.psaCensus2020')}
            </a>
            . {t('pages.barangays.disclaimer')}
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
