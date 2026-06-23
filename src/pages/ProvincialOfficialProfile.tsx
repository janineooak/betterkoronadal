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
import {
  getProvincialOfficial,
  provincialTerm,
  type CaseStatus,
  type LegislationRole,
} from '../data/provincialOfficials';

// Role badge styling for a legislative measure.
const legislationRoleStyles: Record<LegislationRole, string> = {
  authored: 'bg-primary-100 text-primary-800',
  'co-authored': 'bg-primary-50 text-primary-700',
  sponsored: 'bg-blue-100 text-blue-800',
  supported: 'bg-gray-100 text-gray-700',
};

// Status badge styling per case status.
const caseStatusStyles: Record<CaseStatus, string> = {
  alleged: 'bg-amber-100 text-amber-800',
  filed: 'bg-amber-100 text-amber-800',
  pending: 'bg-amber-100 text-amber-800',
  dismissed: 'bg-green-100 text-green-800',
  acquitted: 'bg-green-100 text-green-800',
  convicted: 'bg-red-100 text-red-800',
  settled: 'bg-gray-100 text-gray-700',
};

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
              <div className="mt-4 space-y-4">
                {official.legislation.map((law, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{law.title}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${legislationRoleStyles[law.role]}`}
                      >
                        {t(
                          `pages.provincialOfficials.legislationRole.${law.role}`
                        )}
                      </span>
                      {law.status && (
                        <span className="text-xs text-gray-500">
                          {law.status}
                        </span>
                      )}
                    </div>
                    {law.summary && (
                      <p className="mt-2 text-sm text-gray-700">
                        {law.summary}
                      </p>
                    )}
                    {law.sources.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                        {law.sources.map(s => (
                          <li key={s.href}>
                            <a
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-700 underline hover:text-primary-800"
                            >
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
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
              <div className="mt-4 space-y-4">
                {official.courtCases.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{c.title}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${caseStatusStyles[c.status]}`}
                      >
                        {t(`pages.provincialOfficials.caseStatus.${c.status}`)}
                      </span>
                    </div>
                    {c.forum && (
                      <p className="mt-1 text-xs text-gray-500">{c.forum}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-700">{c.summary}</p>
                    {c.sources.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                        {c.sources.map(s => (
                          <li key={s.href}>
                            <a
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-700 underline hover:text-primary-800"
                            >
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                {t('pages.provincialOfficials.legalDisclaimer')}
              </p>
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
