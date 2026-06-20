import React from 'react';
import { useTranslation } from 'react-i18next';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { FileText, Building2, CalendarClock, ExternalLink } from 'lucide-react';
import {
  procurementNotices,
  PROCUREMENT_SOURCE,
  PROCUREMENT_FETCHED_AT,
  type ProcurementNotice,
} from '../data/procurements';

const peso = (n: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(n);

function NoticeCard({ notice }: { notice: ProcurementNotice }) {
  const { t } = useTranslation();
  return (
    <Card className="h-full">
      <CardContent>
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 shrink-0 text-primary-600" />
          <div className="min-w-0 flex-1">
            <a
              href={notice.url}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-gray-900 hover:text-primary-700 hover:underline"
            >
              {notice.title}
            </a>

            {notice.agency && (
              <div className="mt-3 flex items-start gap-2">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                <p className="text-sm text-gray-700">{notice.agency}</p>
              </div>
            )}

            {notice.abc != null && (
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">
                  {t('pages.procurements.approvedBudget')}
                </span>{' '}
                {peso(notice.abc)}
              </p>
            )}

            {notice.closingDate && (
              <div className="mt-2 flex items-start gap-2">
                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">
                    {t('pages.procurements.closing')}
                  </span>{' '}
                  {notice.closingDate}
                </p>
              </div>
            )}

            <p className="mt-2 text-xs text-gray-400">
              {t('pages.procurements.ref', { refId: notice.refId })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Procurements: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('pages.procurements.seoTitle')}
        description={t('pages.procurements.seoDescription')}
        keywords={t('pages.procurements.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.procurements.breadcrumbHome'), href: '/' },
              {
                label: t('pages.procurements.breadcrumbTitle'),
                href: '/procurements',
              },
            ]}
          />

          <Heading>{t('pages.procurements.heading')}</Heading>
          <p className="mb-4 max-w-3xl text-gray-600">
            {t('pages.procurements.introBefore')}{' '}
            <a
              href={PROCUREMENT_SOURCE}
              target="_blank"
              rel="noreferrer"
              className="text-primary-700 hover:underline"
            >
              PhilGEPS
            </a>
            {t('pages.procurements.introAfter')}
          </p>
          <p className="mb-10 max-w-3xl text-sm text-gray-500">
            {PROCUREMENT_FETCHED_AT
              ? t('pages.procurements.lastRefreshed', {
                  date: PROCUREMENT_FETCHED_AT.slice(0, 10),
                }) + ' '
              : ''}
            {t('pages.procurements.disclaimer')}
          </p>

          {procurementNotices.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {procurementNotices.map(notice => (
                <NoticeCard key={notice.refId} notice={notice} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent>
                <div className="flex items-start gap-3 py-2">
                  <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {t('pages.procurements.emptyTitle')}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {t('pages.procurements.emptyBody')}
                    </p>
                    <a
                      href={PROCUREMENT_SOURCE}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:underline"
                    >
                      {t('pages.procurements.emptyLink')}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </Section>
      </main>
    </>
  );
};

export default Procurements;
