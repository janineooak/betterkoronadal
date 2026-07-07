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
import { useTranslation, Trans } from 'react-i18next';

const totalServices = citizensCharter.reduce(
  (sum, office) => sum + office.services.length,
  0
);

const CitizensCharter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('pages.citizensCharter.seoTitle')}
        description={t('pages.citizensCharter.seoDescription', {
          totalServices,
          edition: CITIZENS_CHARTER_EDITION,
        })}
        keywords={t('pages.citizensCharter.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.citizensCharter.breadcrumbHome'), href: '/' },
              {
                label: t('pages.citizensCharter.breadcrumbCharter'),
                href: '/citizens-charter',
              },
            ]}
          />

          <Heading>{t('pages.citizensCharter.heading')}</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            <Trans
              i18nKey="pages.citizensCharter.intro"
              values={{ totalServices, edition: CITIZENS_CHARTER_EDITION }}
              components={{ strong: <strong /> }}
            />
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
              {t('pages.citizensCharter.openOfficialPdf', {
                edition: CITIZENS_CHARTER_EDITION,
              })}
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
                  <Trans
                    i18nKey="pages.citizensCharter.disclaimer"
                    components={{
                      strong: <strong className="text-gray-900" />,
                      servicesLink: (
                        <a
                          href="/services"
                          className="text-primary-600 underline"
                        />
                      ),
                    }}
                  />
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-12">
            <Card className="h-full">
              <CardContent>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {t('pages.citizensCharter.statTotalServices')}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {totalServices}
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {t('pages.citizensCharter.statOffices')}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {citizensCharter.length}
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {t('pages.citizensCharter.statEdition')}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {CITIZENS_CHARTER_EDITION}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Office-by-office service index */}
          <Heading level={2}>
            {t('pages.citizensCharter.servicesByOfficeHeading')}
          </Heading>
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
                      {t('pages.citizensCharter.serviceCount', {
                        count: office.services.length,
                      })}
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
