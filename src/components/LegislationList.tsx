import { useTranslation } from 'react-i18next';
import type { Legislation, LegislationRole } from '../data/provincialOfficials';

// Role badge styling for a legislative measure.
const legislationRoleStyles: Record<LegislationRole, string> = {
  authored: 'bg-primary-100 text-primary-800',
  'co-authored': 'bg-primary-50 text-primary-700',
  sponsored: 'bg-blue-100 text-blue-800',
  supported: 'bg-gray-100 text-gray-700',
};

/**
 * Renders a list of laws / ordinances with role badges, status, and sources.
 * Shared by the provincial and city official profile pages.
 */
export default function LegislationList({
  legislation,
}: {
  legislation: Legislation[];
}) {
  const { t } = useTranslation();
  return (
    <div className="mt-4 space-y-4">
      {legislation.map((law, i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-gray-900">{law.title}</p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${legislationRoleStyles[law.role]}`}
            >
              {t(`pages.provincialOfficials.legislationRole.${law.role}`)}
            </span>
            {law.status && (
              <span className="text-xs text-gray-500">{law.status}</span>
            )}
          </div>
          {law.summary && (
            <p className="mt-2 text-sm text-gray-700">{law.summary}</p>
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
  );
}
