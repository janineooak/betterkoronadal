import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Section from '../ui/Section';
import Breadcrumbs from '../ui/Breadcrumbs';
import { Heading } from '../ui/Heading';
import { cn } from '../../lib/utils';

interface StatisticsLayoutProps {
  /** Page heading, e.g. "Demographics". */
  title: string;
  /** Intro paragraph under the heading. */
  intro: React.ReactNode;
  /** Breadcrumb label for the current page. */
  crumb: string;
  /** Breadcrumb href for the current page. */
  crumbHref: string;
  children: React.ReactNode;
}

/**
 * Shared chrome for the three statistics pages: breadcrumbs, a pill tab bar to
 * switch between Demographics / Competitiveness / City Income, the page
 * heading, and intro text.
 */
export default function StatisticsLayout({
  title,
  intro,
  crumb,
  crumbHref,
  children,
}: StatisticsLayoutProps) {
  const { t } = useTranslation();
  const tabs = [
    { label: t('pages.statistics.tabsDemographics'), to: '/statistics' },
    {
      label: t('pages.statistics.tabsCompetitiveness'),
      to: '/statistics/competitiveness',
    },
    {
      label: t('pages.statistics.tabsCityIncome'),
      to: '/statistics/municipal-income',
    },
  ];
  return (
    <main className="flex-grow">
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: t('pages.statistics.breadcrumbHome'), href: '/' },
            {
              label: t('pages.statistics.breadcrumbStatistics'),
              href: '/statistics',
            },
            { label: crumb, href: crumbHref },
          ]}
        />

        {/* Tab bar */}
        <div
          className="mb-8 inline-flex flex-wrap gap-1.5 rounded-2xl bg-gray-100 p-1.5"
          role="tablist"
          aria-label={t('pages.statistics.sectionsAria')}
        >
          {tabs.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/statistics'}
              className={({ isActive }) =>
                cn(
                  'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        <Heading>{title}</Heading>
        <div className="max-w-3xl text-gray-600 mb-10">{intro}</div>

        {children}
      </Section>
    </main>
  );
}
