import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Phone, Siren, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FilterableGrid from '../components/ui/FilterableGrid';
import {
  cityHotlines,
  barangayHotlines,
  nationalHotlines,
  type Hotline,
} from '../data/hotlines';

function HotlineCard({ hotline }: { hotline: Hotline }) {
  return (
    <Card className="h-full">
      <CardContent>
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 shrink-0 text-primary-600" />
          <div>
            <p className="font-semibold text-gray-900">{hotline.name}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {hotline.numbers.map(number => (
                <a
                  key={number}
                  href={`tel:${number.replace(/[^0-9+]/g, '')}`}
                  className="text-lg font-bold text-primary-700 underline"
                >
                  {number}
                </a>
              ))}
            </div>
            {hotline.note && (
              <p className="mt-1 text-sm text-gray-600">{hotline.note}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Hotlines: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('pages.hotlines.seoTitle')}
        description={t('pages.hotlines.seoDescription')}
        keywords={t('pages.hotlines.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.hotlines.breadcrumbHome'), href: '/' },
              {
                label: t('pages.hotlines.breadcrumbHotlines'),
                href: '/hotlines',
              },
            ]}
          />

          <Heading>{t('pages.hotlines.title')}</Heading>
          <p className="text-gray-600 mb-6 max-w-3xl">
            {t('pages.hotlines.introBefore')} <strong>Korona-911</strong>{' '}
            {t('pages.hotlines.introMiddle')} <strong>911</strong>.
          </p>

          {/* Prominent emergency banner */}
          <div className="mb-10 rounded-lg bg-red-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <Siren className="h-8 w-8 shrink-0" />
              <div>
                <p className="text-sm uppercase tracking-wide opacity-90">
                  {t('pages.hotlines.cityEmergencyHotline')}
                </p>
                <a href="tel:911" className="text-3xl font-extrabold underline">
                  Korona-911
                </a>
              </div>
            </div>
          </div>

          {/* City hotlines */}
          <Heading level={2}>{t('pages.hotlines.cityOfKoronadal')}</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-12">
            {cityHotlines.map(h => (
              <HotlineCard key={h.name} hotline={h} />
            ))}
          </div>

          {/* Barangay BHERT hotlines */}
          <Heading level={2}>{t('pages.hotlines.bhertTitle')}</Heading>
          <p className="text-gray-600 mb-6 max-w-3xl">
            {t('pages.hotlines.bhertIntro')}
          </p>
          <div className="mb-12">
            <FilterableGrid
              items={barangayHotlines}
              getKey={h => h.name}
              searchText={h => `${h.name} ${h.numbers.join(' ')}`}
              renderItem={h => <HotlineCard hotline={h} />}
              noun={t('pages.hotlines.barangaysNoun', 'barangays')}
              placeholder={t(
                'pages.hotlines.searchBarangay',
                'Search barangay or number…'
              )}
            />
          </div>

          {/* National hotlines */}
          <Heading level={2}>{t('pages.hotlines.nationalHotlines')}</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {nationalHotlines.map(h => (
              <HotlineCard key={h.name} hotline={h} />
            ))}
          </div>

          {/* Note about per-agency local numbers */}
          <Card className="border-l-4 border-amber-500">
            <CardContent>
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 shrink-0 text-amber-600" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-gray-900">
                    {t('pages.hotlines.verifyTitle')}
                  </p>
                  <p className="mt-1">
                    {t('pages.hotlines.verifyBefore')}{' '}
                    <strong>Korona-911</strong>{' '}
                    {t('pages.hotlines.verifyTrunkline')}{' '}
                    <a
                      href="tel:+63832286095"
                      className="text-primary-600 underline"
                    >
                      (083) 228-6095
                    </a>{' '}
                    {t('pages.hotlines.verifyMiddle')}{' '}
                    <a
                      href="https://facebook.com/CityGovernmentofKoronadal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 underline"
                    >
                      {t('pages.hotlines.facebookPage')}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>
      </main>
    </>
  );
};

export default Hotlines;
