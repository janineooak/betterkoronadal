import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  executives,
  councilors,
  exOfficio,
  type Official,
} from '../data/officials';
import {
  officialGroups,
  officialsInGroup,
  type ProvincialOfficial,
} from '../data/provincialOfficials';

// Initials avatar used when a provincial official has no portrait on file.
const Avatar: React.FC<{ name: string; photo?: string | null }> = ({
  name,
  photo,
}) => {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        loading="lazy"
        className="h-full w-full object-cover object-top"
      />
    );
  }
  const initials = name
    .replace(/["'].*?["']/g, '') // drop quoted nickname
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-primary-50 text-2xl font-semibold text-primary-700">
      {initials}
    </div>
  );
};

// Static card for city officials (portraits, not linked).
const OfficialCard: React.FC<{ official: Official; featured?: boolean }> = ({
  official,
  featured,
}) => (
  <Card className="h-full overflow-hidden">
    <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
      <img
        src={official.photo}
        alt={`${official.name}, ${official.position}`}
        loading="lazy"
        className="h-full w-full object-cover object-top"
      />
    </div>
    <CardContent>
      <p
        className={`font-semibold text-gray-900 ${
          featured ? 'text-lg' : 'text-base'
        }`}
      >
        {official.name}
      </p>
      <p className="mt-0.5 text-sm text-primary-600">{official.position}</p>
    </CardContent>
  </Card>
);

// Clickable card for provincial officials (links to a full profile sub-page).
const ProvincialCard: React.FC<{ official: ProvincialOfficial }> = ({
  official,
}) => (
  <Link to={`/provincial-officials/${official.slug}`} className="block h-full">
    <Card hoverable className="h-full overflow-hidden">
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Avatar name={official.name} photo={official.photo} />
      </div>
      <CardContent>
        <p className="font-semibold text-gray-900">{official.name}</p>
        <p className="mt-0.5 text-sm text-primary-600">{official.position}</p>
        {official.party && (
          <p className="mt-1 text-xs text-gray-500">{official.party}</p>
        )}
      </CardContent>
    </Card>
  </Link>
);

const CityOfficials: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('pages.officials.seoTitle')}
        description={t('pages.officials.seoDescription')}
        keywords={t('pages.officials.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.cityOfficials.breadcrumbHome'), href: '/' },
              {
                label: t('pages.cityOfficials.breadcrumbGovernment'),
                href: '/government/departments',
              },
              {
                label: t('pages.officials.breadcrumb'),
                href: '/government/city-officials',
              },
            ]}
          />

          <Heading>{t('pages.officials.title')}</Heading>
          <p className="text-gray-600 mb-12 max-w-3xl">
            {t('pages.officials.intro')}
          </p>

          {/* ===================== City of Koronadal ===================== */}
          <Heading level={2}>{t('pages.officials.cityHeading')}</Heading>
          <p className="text-gray-600 mb-8 max-w-3xl">
            {t('pages.officials.cityIntro')}
          </p>

          {/* Executive */}
          <Heading level={3}>
            {t('pages.cityOfficials.officeOfCityMayor')}
          </Heading>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl mb-12">
            {executives.map(official => (
              <OfficialCard key={official.name} official={official} featured />
            ))}
          </div>

          {/* Council */}
          <Heading level={3}>
            {t('pages.cityOfficials.sangguniangPanlungsodCouncil')}
          </Heading>
          <p className="text-gray-600 mb-6 max-w-3xl">
            {t('pages.cityOfficials.councilIntro')}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mb-12">
            {councilors.map(official => (
              <OfficialCard key={official.name} official={official} />
            ))}
          </div>

          {/* Ex-officio */}
          <Heading level={3}>
            {t('pages.cityOfficials.exOfficioMembers')}
          </Heading>
          <p className="text-gray-600 mb-6 max-w-3xl">
            {t('pages.cityOfficials.exOfficioIntro')}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mb-16">
            {exOfficio.map(official => (
              <OfficialCard key={official.name} official={official} />
            ))}
          </div>

          {/* ==================== South Cotabato Province ==================== */}
          <Heading level={2}>{t('pages.officials.provinceHeading')}</Heading>
          <p className="text-gray-600 mb-8 max-w-3xl">
            {t('pages.officials.provinceIntro')}
          </p>

          {officialGroups.map(group => {
            const members = officialsInGroup(group.key);
            if (members.length === 0) return null;
            return (
              <section key={group.key} className="mb-12">
                <Heading level={3}>
                  {t(
                    `pages.provincialOfficials.groups.${group.key}`,
                    group.title
                  )}
                </Heading>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {members.map(official => (
                    <ProvincialCard key={official.slug} official={official} />
                  ))}
                </div>
              </section>
            );
          })}

          {/* Links */}
          <Heading level={2}>{t('pages.cityOfficials.learnMore')}</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl">
            <Link to="/government/departments/executive">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    {t('pages.cityOfficials.officeOfCityMayor')}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {t('pages.cityOfficials.mayorCardDesc')}
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/government/departments/legislative">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    {t('pages.cityOfficials.sangguniangPanlungsod')}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {t('pages.cityOfficials.councilCardDesc')}
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/government/departments">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    {t('pages.cityOfficials.departmentsOffices')}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {t('pages.cityOfficials.departmentsCardDesc')}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <SourceNote
            verified="June 2026"
            sources={[
              {
                label: t('pages.cityOfficials.sourceLabel'),
                href: 'https://koronadal.gov.ph/city-officials/',
                note: t('pages.cityOfficials.sourceNote'),
              },
              {
                label: t('pages.provincialOfficials.sourceLabel'),
                href: 'https://southcotabato.gov.ph',
                note: t('pages.provincialOfficials.sourceNote'),
              },
            ]}
          />
          <p className="mt-4 text-xs text-gray-500 max-w-3xl">
            {t('pages.cityOfficials.photoCredit')}
          </p>
        </Section>
      </main>
    </>
  );
};

export default CityOfficials;
