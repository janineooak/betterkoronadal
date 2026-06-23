import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  Award,
  Gavel,
  Info,
  ScrollText,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import LegislationList from '../components/LegislationList';
import CourtCaseList from '../components/CourtCaseList';
import {
  getProvincialOfficial,
  provincialTerm,
} from '../data/provincialOfficials';

const Avatar: React.FC<{ name: string; photo?: string | null }> = ({
  name,
  photo,
}) => {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="h-full w-full object-cover object-top"
      />
    );
  }
  const initials = name
    .replace(/["'].*?["']/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-primary-50 text-4xl font-semibold text-primary-700">
      {initials}
    </div>
  );
};

const ProvincialOfficialProfile: React.FC = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const official = slug ? getProvincialOfficial(slug) : undefined;

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

  const fullPosition = official.district
    ? `${official.position} · ${official.district}`
    : official.position;

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
                href: `/provincial-officials/${official.slug}`,
              },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="h-40 w-40 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <Avatar name={official.name} photo={official.photo} />
            </div>
            <div className="min-w-0">
              <Heading>{official.name}</Heading>
              <p className="mt-1 text-lg text-primary-600">{fullPosition}</p>
              {official.party && (
                <p className="mt-1 text-sm text-gray-600">{official.party}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {t('pages.provincialOfficials.termLabel', {
                  term: provincialTerm,
                })}
              </p>
              <span
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  official.verified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {official.verified ? (
                  <ShieldCheck className="h-3.5 w-3.5" />
                ) : (
                  <ShieldAlert className="h-3.5 w-3.5" />
                )}
                {official.verified
                  ? t('pages.provincialOfficials.verifiedBadge')
                  : t('pages.provincialOfficials.unverifiedBadge')}
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-8 max-w-3xl text-gray-700">{official.bio}</p>

          {/* Achievements */}
          {official.achievements.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary-600" />
                <Heading level={2}>
                  {t('pages.provincialOfficials.achievements')}
                </Heading>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
                {official.achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </section>
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

          {/* Notable notes */}
          {official.notableNotes.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary-600" />
                <Heading level={2}>
                  {t('pages.provincialOfficials.notableNotes')}
                </Heading>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
                {official.notableNotes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Concerns / criticism */}
          {official.concerns.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <Heading level={2}>
                  {t('pages.provincialOfficials.concerns')}
                </Heading>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
                {official.concerns.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Court cases */}
          {official.courtCases.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-amber-600" />
                <Heading level={2}>
                  {t('pages.provincialOfficials.courtCases')}
                </Heading>
              </div>
              <CourtCaseList courtCases={official.courtCases} />
            </section>
          )}

          <SourceNote
            verified="June 2026"
            sources={
              official.sources.length > 0
                ? official.sources.map(s => ({ label: s.label, href: s.href }))
                : [
                    {
                      label: t('pages.provincialOfficials.sourceLabel'),
                      href: 'https://southcotabato.gov.ph',
                    },
                  ]
            }
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

export default ProvincialOfficialProfile;
