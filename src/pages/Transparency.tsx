import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import { useTranslation, Trans } from 'react-i18next';
import { Card, CardContent } from '@bettergov/kapwa/card';
import FloodControlSection from '../components/data/FloodControlSection';
import ProcurementSection from '../components/data/ProcurementSection';
import BudgetSection from '../components/data/BudgetSection';
import CongressSection from '../components/data/CongressSection';
import {
  FileText,
  Gavel,
  Wallet,
  ClipboardList,
  ScrollText,
  Building2,
  ExternalLink,
  Info,
} from 'lucide-react';

interface Resource {
  key: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const resources: Resource[] = [
  {
    key: 'fdpPortal',
    href: 'https://fdpp.dilg.gov.ph',
    Icon: FileText,
  },
  {
    key: 'philgeps',
    href: 'https://www.philgeps.gov.ph',
    Icon: Gavel,
  },
  {
    key: 'budgetReports',
    href: 'https://fdpp.dilg.gov.ph',
    Icon: Wallet,
  },
  {
    key: 'foi',
    href: 'https://www.foi.gov.ph',
    Icon: ClipboardList,
  },
  {
    key: 'coa',
    href: 'https://www.coa.gov.ph',
    Icon: ScrollText,
  },
  {
    key: 'cityWebsite',
    href: 'https://koronadal.gov.ph',
    Icon: Building2,
  },
];

const Transparency: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('pages.transparency.seoTitle')}
        description={t('pages.transparency.seoDescription')}
        keywords={t('pages.transparency.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.transparency.breadcrumbHome'), href: '/' },
              {
                label: t('pages.transparency.breadcrumbTransparency'),
                href: '/transparency',
              },
            ]}
          />

          <Heading>{t('pages.transparency.heading')}</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            <Trans
              i18nKey="pages.transparency.intro"
              components={{ strong: <strong /> }}
            />
          </p>

          {/* Disclaimer banner */}
          <Card className="mb-10 border-l-4 border-amber-500">
            <CardContent>
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 shrink-0 text-amber-600" />
                <p className="text-sm text-gray-700">
                  <Trans
                    i18nKey="pages.transparency.disclaimer"
                    components={{
                      strong: <strong className="text-gray-900" />,
                    }}
                  />
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Live data pulled from the BetterGov.ph open APIs */}
          <Heading level={2}>Live Koronadal Data</Heading>
          <p className="mb-8 max-w-3xl text-gray-600">
            The sections below are compiled automatically from the open{' '}
            <a
              href="https://bettergov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 underline hover:text-primary-800"
            >
              BetterGov.ph
            </a>{' '}
            data APIs and refreshed on a schedule. They surface the
            flood-control projects, contract awards, national budget
            allocations, and legislation that specifically name Koronadal.
          </p>

          <FloodControlSection />
          <ProcurementSection />
          <BudgetSection />
          <CongressSection />

          {/* Resource grid */}
          <Heading level={2}>
            {t('pages.transparency.whereToFindHeading')}
          </Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {resources.map(({ key, href, Icon }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card hoverable className="h-full">
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <Icon className="h-6 w-6 text-primary-600 mb-2" />
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="font-semibold text-gray-900">
                      {t(`pages.transparency.resources.${key}.name`)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {t(`pages.transparency.resources.${key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          {/* What FDP covers */}
          <Heading level={2}>
            {t('pages.transparency.whatFdpCoversHeading')}
          </Heading>
          <div className="max-w-3xl space-y-3 text-gray-700 mb-6">
            <p>{t('pages.transparency.whatFdpCoversP1')}</p>
            <p>{t('pages.transparency.whatFdpCoversP2')}</p>
          </div>

          <SourceNote
            verified="June 2026"
            sources={[
              {
                label: 'DILG — Full Disclosure Policy Portal (About & FAQ)',
                href: 'https://fdpp.dilg.gov.ph/fdpp/about',
                note: 'DILG MC 2011-134',
              },
              {
                label: 'DILG Region XII — Full Disclosure Policy (FDP)',
                href: 'https://region12.dilg.gov.ph/programs-projects/full-disclosure-policy-fdp',
              },
              {
                label: 'Government Procurement Reform Act (RA 9184) — PhilGEPS',
                href: 'https://www.philgeps.gov.ph',
              },
              {
                label: 'eFOI — Freedom of Information',
                href: 'https://www.foi.gov.ph',
              },
              {
                label: 'BetterGov.ph — open government data APIs',
                href: 'https://bettergov.ph',
                note: 'flood control, procurement, budget, and legislation feeds',
              },
            ]}
          />
        </Section>
      </main>
    </>
  );
};

export default Transparency;
