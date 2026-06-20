import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import { useTranslation, Trans } from 'react-i18next';
import { Card, CardContent } from '@bettergov/kapwa/card';
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
  name: string;
  description: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const resources: Resource[] = [
  {
    name: 'Full Disclosure Policy (FDP) Portal',
    description:
      'The DILG portal where LGUs post budgets, finances, bids, and the status of programs and projects, as required by DILG Memorandum Circular 2011-134.',
    href: 'https://fdpp.dilg.gov.ph',
    Icon: FileText,
  },
  {
    name: 'PhilGEPS — Bids & Procurement',
    description:
      'The Philippine Government Electronic Procurement System lists invitations to bid, awards, and notices to proceed under RA 9184 (Government Procurement Reform Act).',
    href: 'https://www.philgeps.gov.ph',
    Icon: Gavel,
  },
  {
    name: 'Budget & Financial Reports',
    description:
      "Annual budgets, statements of receipts and expenditures, and other financial documents are posted to the LGU's FDP page and official website.",
    href: 'https://fdpp.dilg.gov.ph',
    Icon: Wallet,
  },
  {
    name: 'Freedom of Information (FOI)',
    description:
      'Request government records through the national eFOI platform. FOI covers documents held by government agencies, subject to the standard exceptions.',
    href: 'https://www.foi.gov.ph',
    Icon: ClipboardList,
  },
  {
    name: 'Commission on Audit (COA) Reports',
    description:
      'Independent annual audit reports on the finances of LGUs and other government agencies, published by the Commission on Audit.',
    href: 'https://www.coa.gov.ph',
    Icon: ScrollText,
  },
  {
    name: 'Official City Website',
    description:
      'The City Government of Koronadal posts official issuances, news, and transparency documents on its own website.',
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

          {/* Resource grid */}
          <Heading level={2}>
            {t('pages.transparency.whereToFindHeading')}
          </Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {resources.map(({ name, description, href, Icon }) => (
              <a
                key={name}
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
                    <p className="font-semibold text-gray-900">{name}</p>
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
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
            ]}
          />
        </Section>
      </main>
    </>
  );
};

export default Transparency;
