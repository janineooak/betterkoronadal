import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
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
  return (
    <>
      <SEO
        title="Transparency & Full Disclosure"
        description="Find transparency and Full Disclosure Policy resources for the City of Koronadal — budgets, bids and procurement, FOI requests, and COA audit reports, with links to the official DILG, PhilGEPS, FOI, and COA portals."
        keywords="Koronadal transparency, Full Disclosure Policy, FDP, DILG, PhilGEPS, bids and procurement, FOI, COA, Koronadal budget"
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Transparency', href: '/transparency' },
            ]}
          />

          <Heading>Transparency &amp; Full Disclosure</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            Philippine local government units are required to make key financial
            and project information public under the{' '}
            <strong>Full Disclosure Policy</strong> (DILG Memorandum Circular
            2011-134) and the <strong>Government Procurement Reform Act</strong>{' '}
            (RA 9184). This page gathers the official channels where you can
            find Koronadal&rsquo;s budgets, bids, audit reports, and records.
          </p>

          {/* Disclaimer banner */}
          <Card className="mb-10 border-l-4 border-amber-500">
            <CardContent>
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 shrink-0 text-amber-600" />
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">
                    These documents are published by official government
                    portals.
                  </strong>{' '}
                  BetterKoronadal.org is an independent community portal and
                  does not host or certify these records — the links below point
                  to the authoritative sources.
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
          <Heading level={2}>Where to Find the Documents</Heading>
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
          <Heading level={2}>What the Full Disclosure Policy Covers</Heading>
          <div className="max-w-3xl space-y-3 text-gray-700 mb-6">
            <p>
              Under the policy, LGUs post documents such as their annual budget,
              statement of receipts and expenditures, the annual procurement
              plan, bid results and awarded contracts, the status of local
              development projects, and reports on the use of special funds
              (e.g. the Local Disaster Risk Reduction and Management Fund).
            </p>
            <p>
              These must be displayed in conspicuous public places, on the
              LGU&rsquo;s website, and/or in print media, and submitted through
              the DILG&rsquo;s FDP Portal so any citizen can review how public
              funds are managed and spent.
            </p>
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
