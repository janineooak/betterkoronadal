import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Award, Gavel, Info, ScrollText } from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import LegislationList from '../components/LegislationList';
import CourtCaseList from '../components/CourtCaseList';
import { useRegistry } from '../hooks/useRegistry';

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
    .replace(/["“”'].*?["“”']/g, '')
    .replace(/Hon\.?/gi, '')
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

const statusStyles: Record<string, string> = {
  current: 'bg-green-100 text-green-800',
  past: 'bg-gray-200 text-gray-700',
  future: 'bg-amber-100 text-amber-800',
};

const OfficialProfile: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const people = useRegistry();
  const person = id ? people.find(p => p.id === id) : undefined;

  if (!person) {
    return (
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Heading>{t('pages.registry.notFoundTitle')}</Heading>
          <p className="mt-4 text-gray-600">
            {t('pages.registry.notFoundBody')}
          </p>
          <Link
            to="/officials"
            className="mt-6 inline-block text-primary-600 underline"
          >
            {t('pages.registry.backToRegistry')}
          </Link>
        </Section>
      </main>
    );
  }

  return (
    <>
      <SEO
        title={`${person.name} — ${t('pages.registry.profileTitleSuffix')}`}
        description={person.bio}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.registry.breadcrumbHome'), href: '/' },
              { label: t('pages.registry.title'), href: '/officials' },
              { label: person.name, href: `/officials/${person.id}` },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="h-40 w-40 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <Avatar name={person.name} photo={person.photo} />
            </div>
            <div className="min-w-0">
              <Heading>{person.name}</Heading>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[person.status]}`}
              >
                {t(`pages.registry.status.${person.status}`)}
              </span>

              {/* Tenure timeline */}
              <ul className="mt-4 space-y-1.5">
                {person.tenures.map((ten, i) => (
                  <li
                    key={i}
                    className="flex flex-wrap items-baseline gap-x-2 text-sm"
                  >
                    <span className="font-medium text-gray-900">
                      {ten.position}
                    </span>
                    <span className="text-gray-500">· {ten.body}</span>
                    {ten.term && (
                      <span className="text-gray-500">· {ten.term}</span>
                    )}
                    {ten.status === 'current' && (
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800">
                        {t('pages.registry.status.current')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {person.bio && (
            <p className="mt-8 max-w-3xl text-gray-700">{person.bio}</p>
          )}

          {person.achievements.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary-600" />
                <Heading level={2}>{t('pages.registry.achievements')}</Heading>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
                {person.achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </section>
          )}

          {person.legislation.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-primary-600" />
                <Heading level={2}>{t('pages.registry.legislation')}</Heading>
              </div>
              <LegislationList legislation={person.legislation} />
            </section>
          )}

          {person.notableNotes.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary-600" />
                <Heading level={2}>{t('pages.registry.notableNotes')}</Heading>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
                {person.notableNotes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </section>
          )}

          {person.concerns.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <Heading level={2}>{t('pages.registry.concerns')}</Heading>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
                {person.concerns.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {person.courtCases.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-amber-600" />
                <Heading level={2}>{t('pages.registry.courtCases')}</Heading>
              </div>
              <CourtCaseList courtCases={person.courtCases} />
            </section>
          )}

          {person.sources.length > 0 && (
            <SourceNote
              verified="June 2026"
              sources={person.sources.map(s => ({
                label: s.label,
                href: s.href,
              }))}
            />
          )}

          <Link
            to="/officials"
            className="mt-6 inline-block text-primary-600 underline"
          >
            {t('pages.registry.backToRegistry')}
          </Link>
        </Section>
      </main>
    </>
  );
};

export default OfficialProfile;
