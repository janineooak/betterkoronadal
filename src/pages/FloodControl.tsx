import React from 'react';
import { useTranslation } from 'react-i18next';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Waves, HardHat, Coins, Calendar } from 'lucide-react';
import {
  koronadalFloodProjects,
  koronadalFloodTotalCost,
  FLOOD_CONTROL_SOURCE,
  FLOOD_CONTROL_FETCHED_AT,
  type FloodControlProject,
} from '../data/floodControl';

const peso = (n: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(n);

function ProjectCard({ project }: { project: FloodControlProject }) {
  const { t } = useTranslation();
  return (
    <Card className="h-full">
      <CardContent>
        <div className="flex items-start gap-3">
          <Waves className="h-5 w-5 shrink-0 text-primary-600" />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900">{project.name}</p>

            {project.contractor && (
              <div className="mt-3 flex items-start gap-2">
                <HardHat className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">
                    {t('pages.floodControl.contractor')}
                  </span>{' '}
                  {project.contractor}
                </p>
              </div>
            )}

            {project.cost != null && (
              <div className="mt-2 flex items-start gap-2">
                <Coins className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">
                    {t('pages.floodControl.contractCost')}
                  </span>{' '}
                  {peso(project.cost)}
                </p>
              </div>
            )}

            {project.year && (
              <div className="mt-2 flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">
                    {t('pages.floodControl.infraYear')}
                  </span>{' '}
                  {project.year}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const FloodControl: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('pages.floodControl.seoTitle')}
        description={t('pages.floodControl.seoDescription')}
        keywords={t('pages.floodControl.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.floodControl.breadcrumbHome'), href: '/' },
              {
                label: t('pages.floodControl.breadcrumbTitle'),
                href: '/flood-control',
              },
            ]}
          />

          <Heading>{t('pages.floodControl.heading')}</Heading>
          <p className="mb-4 max-w-3xl text-gray-600">
            {t('pages.floodControl.intro')}
          </p>

          {koronadalFloodProjects.length > 0 && (
            <div className="mb-10 grid max-w-2xl grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-2xl font-bold text-gray-900">
                  {koronadalFloodProjects.length}
                </p>
                <p className="text-sm text-gray-500">
                  {t('pages.floodControl.statProjects')}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-2xl font-bold text-gray-900">
                  {peso(koronadalFloodTotalCost)}
                </p>
                <p className="text-sm text-gray-500">
                  {t('pages.floodControl.statTotalValue')}
                </p>
              </div>
            </div>
          )}

          <p className="mb-10 max-w-3xl text-sm text-gray-500">
            {t('pages.floodControl.sourceBefore')}{' '}
            <a
              href={FLOOD_CONTROL_SOURCE}
              target="_blank"
              rel="noreferrer"
              className="text-primary-700 hover:underline"
            >
              {t('pages.floodControl.sourceLink')}
            </a>{' '}
            {t('pages.floodControl.sourceDataset')}
            {FLOOD_CONTROL_FETCHED_AT
              ? t('pages.floodControl.sourceRefreshed', {
                  date: FLOOD_CONTROL_FETCHED_AT.slice(0, 10),
                })
              : ''}
            {t('pages.floodControl.sourceDisclaimer')}
          </p>

          {koronadalFloodProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {koronadalFloodProjects.map((project, i) => (
                <ProjectCard key={`${project.name}-${i}`} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              {t('pages.floodControl.emptyBefore')}{' '}
              <a
                href={FLOOD_CONTROL_SOURCE}
                target="_blank"
                rel="noreferrer"
                className="text-primary-700 hover:underline"
              >
                {t('pages.floodControl.emptyLink')}
              </a>
              {t('pages.floodControl.emptyAfter')}
            </p>
          )}
        </Section>
      </main>
    </>
  );
};

export default FloodControl;
