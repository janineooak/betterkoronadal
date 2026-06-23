import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ScrollText } from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import LegislationList from '../components/LegislationList';
import { getCityOfficial, cityTerm } from '../data/officials';

const CityOfficialProfile: React.FC = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const official = slug ? getCityOfficial(slug) : undefined;

  if (!official) {
    return (
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Heading>{t('pages.provincialOfficials.notFoundTitle')}</Heading>
          <p className="mt-4 text-gray-600">
            {t('pages.provincialOfficials.notFoundBody')}
          </p>
          <Link
            to="/government/city-officials"
            className="mt-6 inline-block text-primary-600 underline"
          >
            {t('pages.provincialOfficials.backToDirectory')}
          </Link>
        </Section>
      </main>
    );
  }

  return (
    <>
      <SEO
        title={`${official.name} — ${official.position}`}
        description={official.bio}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              {
                label: t('pages.provincialOfficials.breadcrumbHome'),
                href: '/',
              },
              {
                label: t('pages.officials.breadcrumb'),
                href: '/government/city-officials',
              },
              {
                label: official.name,
                href: `/city-officials/${official.slug}`,
              },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="h-40 w-40 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={official.photo}
                alt={official.name}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="min-w-0">
              <Heading>{official.name}</Heading>
              <p className="mt-1 text-lg text-primary-600">
                {official.position}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {t('pages.provincialOfficials.termLabel', { term: cityTerm })}
              </p>
            </div>
          </div>

          {/* Bio */}
          {official.bio && (
            <p className="mt-8 max-w-3xl text-gray-700">{official.bio}</p>
          )}

          {/* Legislation */}
          {official.legislation && official.legislation.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-primary-600" />
                <Heading level={2}>
                  {t('pages.provincialOfficials.legislation')}
                </Heading>
              </div>
              <LegislationList legislation={official.legislation} />
            </section>
          )}

          <SourceNote
            verified="June 2026"
            sources={[
              {
                label: t('pages.cityOfficials.sourceLabel'),
                href: 'https://koronadal.gov.ph/category/news/',
                note: t('pages.cityOfficials.sourceNote'),
              },
            ]}
          />

          <Link
            to="/government/city-officials"
            className="mt-6 inline-block text-primary-600 underline"
          >
            {t('pages.provincialOfficials.backToDirectory')}
          </Link>
        </Section>
      </main>
    </>
  );
};

export default CityOfficialProfile;
