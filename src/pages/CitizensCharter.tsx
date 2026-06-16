import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { FileText, Info, ExternalLink, Clock } from 'lucide-react';
import {
  citizensCharter,
  CITIZENS_CHARTER_EDITION,
  CITIZENS_CHARTER_PDF,
  CITIZENS_CHARTER_SOURCE,
} from '../data/citizensCharter';

const totalServices = citizensCharter.reduce(
  (sum, office) => sum + office.services.length,
  0
);

const CitizensCharter: React.FC = () => {
  return (
    <>
      <SEO
        title="Citizen's Charter"
        description={`A complete, searchable index of all ${totalServices} frontline services in the City of Koronadal Citizen's Charter (${CITIZENS_CHARTER_EDITION} edition), grouped by office, with a link to the official guidebook.`}
        keywords="Koronadal Citizen's Charter, frontline services, city services directory, requirements, fees, processing time, ARTA, koronadal.gov.ph"
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: 'Home', href: '/' },
              { label: "Citizen's Charter", href: '/citizens-charter' },
            ]}
          />

          <Heading>Citizen&rsquo;s Charter</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            The <strong>Citizen&rsquo;s Charter</strong> is the City Government
            of Koronadal&rsquo;s official guide to its frontline services — the
            requirements, fees, and processing times for each transaction, as
            mandated by the Ease of Doing Business Act (RA 11032). This page
            indexes all <strong>{totalServices} services</strong> from the{' '}
            <strong>{CITIZENS_CHARTER_EDITION} edition</strong>, grouped by
            office.
          </p>

          {/* Primary CTA: official PDF */}
          <div className="mb-8 flex flex-wrap gap-3">
            <a
              href={CITIZENS_CHARTER_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white font-medium hover:bg-primary-700 transition-colors"
            >
              <FileText className="h-5 w-5" />
              Open the official Citizen&rsquo;s Charter (
              {CITIZENS_CHARTER_EDITION} PDF)
            </a>
            <a
              href={CITIZENS_CHARTER_SOURCE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:border-primary-400 hover:text-primary-700 transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              koronadal.gov.ph
            </a>
          </div>

          {/* Disclaimer */}
          <Card className="mb-10 border-l-4 border-amber-500">
            <CardContent>
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 shrink-0 text-amber-600" />
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">
                    This is a community-built index, not the official document.
                  </strong>{' '}
                  Service names are summarized from the official charter for
                  easy browsing. For the exact requirements, fees, and
                  step-by-step procedures, always open the official PDF above.
                  Many of the most-used services also have a plain-language
                  guide in our{' '}
                  <a href="/services" className="text-primary-600 underline">
                    Services
                  </a>{' '}
                  section.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-12">
            <Card className="h-full">
              <CardContent>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total services
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {totalServices}
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Offices
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {citizensCharter.length}
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Edition
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {CITIZENS_CHARTER_EDITION}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Office-by-office service index */}
          <Heading level={2}>Services by Office</Heading>
          <div className="space-y-6">
            {citizensCharter.map(office => (
              <Card key={office.office} className="h-full">
                <CardContent>
                  <div className="flex items-baseline justify-between gap-2 mb-3 border-b border-gray-100 pb-2">
                    <p className="font-semibold text-gray-900">
                      {office.office}
                      {office.abbr && (
                        <span className="text-gray-500"> ({office.abbr})</span>
                      )}
                    </p>
                    <span className="shrink-0 text-xs text-gray-500">
                      {office.services.length}{' '}
                      {office.services.length === 1 ? 'service' : 'services'}
                    </span>
                  </div>
                  <ol className="space-y-1.5">
                    {office.services.map(service => (
                      <li
                        key={service.n}
                        className="flex gap-2 text-sm text-gray-700"
                      >
                        <span className="shrink-0 tabular-nums text-gray-400">
                          {service.n}.
                        </span>
                        <span>
                          {service.title}
                          {service.processingTime && (
                            <span className="ml-2 inline-flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {service.processingTime}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </main>
    </>
  );
};

export default CitizensCharter;
