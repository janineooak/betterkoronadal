import { useTranslation } from 'react-i18next';
import type { CourtCase, CaseStatus } from '../data/provincialOfficials';

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

/**
 * Renders court cases / legal matters with status badges, neutral framing, and
 * a presumption-of-innocence disclaimer. Shared by the provincial and the
 * historical-registry profile pages.
 */
export default function CourtCaseList({
  courtCases,
}: {
  courtCases: CourtCase[];
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="mt-4 space-y-4">
        {courtCases.map((c, i) => (
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
            {c.forum && <p className="mt-1 text-xs text-gray-500">{c.forum}</p>}
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
    </>
  );
}
