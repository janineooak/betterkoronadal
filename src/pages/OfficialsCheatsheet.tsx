import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, Gavel } from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import {
  registryBodies,
  type RegistryPerson,
  type TenureStatus,
} from '../data/officialsRegistry';
import type { GovBody } from '../data/pastOfficials';
import { useRegistry } from '../hooks/useRegistry';

const statusStyles: Record<TenureStatus, string> = {
  current: 'bg-green-100 text-green-800',
  past: 'bg-gray-200 text-gray-700',
  future: 'bg-amber-100 text-amber-800',
};

const STATUS_FILTERS: (TenureStatus | 'all')[] = [
  'all',
  'current',
  'past',
  'future',
];

const OfficialsCheatsheet: React.FC = () => {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<TenureStatus | 'all'>('all');
  const [body, setBody] = useState<GovBody | 'all'>('all');
  const [casesOnly, setCasesOnly] = useState(false);
  const people = useRegistry();

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return people.filter(p => {
      if (status !== 'all' && p.status !== status) return false;
      if (body !== 'all' && !p.tenures.some(ten => ten.body === body))
        return false;
      if (casesOnly && p.courtCases.length === 0) return false;
      if (query) {
        const hay = [
          p.name,
          ...p.tenures.map(ten => `${ten.position} ${ten.body}`),
          ...p.legislation.map(l => l.title),
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [people, q, status, body, casesOnly]);

  const roleSummary = (p: RegistryPerson) =>
    p.tenures
      .map(
        ten => `${ten.position} (${ten.body}${ten.term ? `, ${ten.term}` : ''})`
      )
      .join('; ');

  return (
    <>
      <SEO
        title={t('pages.registry.seoTitle')}
        description={t('pages.registry.seoDescription')}
        keywords={t('pages.registry.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.registry.breadcrumbHome'), href: '/' },
              { label: t('pages.registry.title'), href: '/officials' },
            ]}
          />

          <Heading>{t('pages.registry.title')}</Heading>
          <p className="text-lg text-gray-700 mb-2 max-w-3xl">
            {t('pages.registry.subtitle')}
          </p>
          <p className="text-gray-600 mb-4 max-w-3xl">
            {t('pages.registry.intro')}
          </p>
          <Link
            to="/officials/contribute"
            className="mb-8 inline-flex items-center gap-1.5 rounded-lg border border-primary-600 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50"
          >
            + {t('pages.registry.contribute')}
          </Link>

          {/* Controls */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 sm:w-72">
              <SearchIcon className="h-4 w-4 text-gray-400" />
              <input
                type="search"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={t('pages.registry.searchPlaceholder')}
                className="w-full bg-transparent text-sm text-gray-900 outline-none"
                aria-label={t('pages.registry.searchPlaceholder')}
              />
            </div>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as TenureStatus | 'all')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
              aria-label={t('pages.registry.filterStatus')}
            >
              {STATUS_FILTERS.map(s => (
                <option key={s} value={s}>
                  {s === 'all'
                    ? t('pages.registry.allStatuses')
                    : t(`pages.registry.status.${s}`)}
                </option>
              ))}
            </select>
            <select
              value={body}
              onChange={e => setBody(e.target.value as GovBody | 'all')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
              aria-label={t('pages.registry.filterBody')}
            >
              <option value="all">{t('pages.registry.allBodies')}</option>
              {registryBodies.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={casesOnly}
                onChange={e => setCasesOnly(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              {t('pages.registry.courtCasesOnly')}
            </label>
          </div>

          <p className="mb-3 text-sm text-gray-500">
            {t('pages.registry.resultCount', { count: rows.length })}
          </p>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    {t('pages.registry.colName')}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t('pages.registry.colStatus')}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t('pages.registry.colRoles')}
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    {t('pages.registry.colLaws')}
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    {t('pages.registry.colCases')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/officials/${p.id}`}
                        className="font-medium text-primary-700 hover:underline"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[p.status]}`}
                      >
                        {t(`pages.registry.status.${p.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {roleSummary(p)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {p.legislation.length || ''}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {p.courtCases.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-amber-700">
                          <Gavel className="h-3.5 w-3.5" />
                          {p.courtCases.length}
                        </span>
                      ) : (
                        ''
                      )}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {t('pages.registry.noResults')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <SourceNote
            verified="June 2026"
            sources={[
              {
                label: t('pages.registry.sourceLabel'),
                href: 'https://koronadal.gov.ph',
                note: t('pages.registry.sourceNote'),
              },
            ]}
          />
        </Section>
      </main>
    </>
  );
};

export default OfficialsCheatsheet;
