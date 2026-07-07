import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PartyPopper,
  Trees,
  Mountain,
  Landmark,
  Utensils,
  Waves,
  Droplets,
  Sprout,
  ShoppingBag,
  Church,
  Tent,
} from 'lucide-react';

interface Attraction {
  key: string;
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
}

// Places in or right around Koronadal City.
const cityAttractions: Attraction[] = [
  { key: 'cityPlaza', name: 'Koronadal City Plaza (Rizal Park)', Icon: Trees },
  {
    key: 'provincialCapitol',
    name: 'South Cotabato Provincial Capitol',
    Icon: Landmark,
  },
  {
    key: 'communityMuseum',
    name: 'South Cotabato Community Museum',
    Icon: Landmark,
  },
  {
    key: 'kalonBarak',
    name: 'Kalon Barak Skyline Ridge',
    Icon: Mountain,
  },
  {
    key: 'paraisoVerde',
    name: 'Paraiso Verde Resort & Water Park',
    Icon: Waves,
  },
  {
    key: 'carpenterHill',
    name: 'The Farm at Carpenter Hill',
    Icon: Sprout,
  },
  { key: 'kccMall', name: 'KCC Mall of Marbel', Icon: ShoppingBag },
  {
    key: 'dioceseMarbel',
    name: 'Diocese of Marbel & city churches',
    Icon: Church,
  },
  { key: 'localMarkets', name: 'Local markets & cuisine', Icon: Utensils },
];

// Famous provincial spots that are outside the city but commonly visited from it.
const dayTrips: Attraction[] = [
  {
    key: 'sevenFalls',
    name: 'Seven Falls & Zipline, Lake Sebu',
    Icon: Droplets,
  },
  { key: 'lakeSebu', name: 'Lake Sebu', Icon: Waves },
  {
    key: 'lakeHolon',
    name: 'Lake Holon (Lake Maughan), T’boli',
    Icon: Tent,
  },
];

const Tourism: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('pages.tourism.seoTitle')}
        description={t('pages.tourism.seoDescription')}
        keywords={t('pages.tourism.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.tourism.breadcrumbHome'), href: '/' },
              { label: t('pages.tourism.breadcrumbTourism'), href: '/tourism' },
            ]}
          />

          <Heading>{t('pages.tourism.title')}</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            {t('pages.tourism.intro')}
          </p>

          {/* Signature festival */}
          <Heading level={2}>{t('pages.tourism.festivalHeading')}</Heading>
          <div className="mb-12 max-w-3xl">
            <Card className="border-l-4 border-primary-500">
              <CardContent>
                <div className="flex items-start gap-3">
                  <PartyPopper className="h-7 w-7 shrink-0 text-primary-600" />
                  <div className="text-gray-700">
                    <p>{t('pages.tourism.festivalBody')}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      {t('pages.tourism.festivalNote')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Places & highlights */}
          <Heading level={2}>{t('pages.tourism.placesHeading')}</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {cityAttractions.map(({ key, name, Icon }) => (
              <Card key={key} className="h-full">
                <CardContent>
                  <Icon className="h-6 w-6 text-primary-600 mb-2" />
                  <p className="font-semibold text-gray-900">
                    {t(`pages.tourism.places.${key}.name`, name)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {t(`pages.tourism.places.${key}.description`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Day trips beyond the city */}
          <Heading level={2}>{t('pages.tourism.dayTripsHeading')}</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            {t('pages.tourism.dayTripsIntro')}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {dayTrips.map(({ key, name, Icon }) => (
              <Card key={key} className="h-full">
                <CardContent>
                  <Icon className="h-6 w-6 text-primary-600 mb-2" />
                  <p className="font-semibold text-gray-900">
                    {t(`pages.tourism.dayTrips.${key}.name`, name)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {t(`pages.tourism.dayTrips.${key}.description`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Practical links */}
          <Heading level={2}>{t('pages.tourism.planHeading')}</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl">
            <Link to="/about">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    {t('pages.tourism.aboutCardTitle')}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {t('pages.tourism.aboutCardBody')}
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/hotlines">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    {t('pages.tourism.hotlinesCardTitle')}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {t('pages.tourism.hotlinesCardBody')}
                  </p>
                </CardContent>
              </Card>
            </Link>
            <a
              href="https://koronadal.gov.ph/culture/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    {t('pages.tourism.cultureCardTitle')}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {t('pages.tourism.cultureCardBody')}
                  </p>
                </CardContent>
              </Card>
            </a>
          </div>

          <SourceNote
            verified="June 2026"
            sources={[
              {
                label: 'City Government of Koronadal — Culture',
                href: 'https://koronadal.gov.ph/culture/',
                note: 'Hinugyaw Festival, heritage sites, cultural values',
              },
              {
                label:
                  'Vigattin Tourism — Araw ng Koronadal "Hinugyaw Festival"',
                href: 'https://www.vigattintourism.com/tourism/articles/Araw-ng-Koronadal-Hinugayaw-Festival',
              },
              {
                label: 'Camella — Top Things to Do in Koronadal City',
                href: 'https://www.camella.com.ph/top-things-to-do-in-koronadal-city-south-cotabato-philippines/',
              },
              {
                label: 'Out of Town Blog — Top Things to Do in Koronadal City',
                href: 'https://outoftownblog.com/things-to-do-in-koronadal-city/',
              },
            ]}
          />
        </Section>
      </main>
    </>
  );
};

export default Tourism;
