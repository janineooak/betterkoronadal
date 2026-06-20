import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Wallet, Layers, Users, FileText } from 'lucide-react';
import SEO from '../../components/SEO';
import SourceNote from '../../components/ui/SourceNote';
import StatCard from '../../components/ui/StatCard';
import { Heading } from '../../components/ui/Heading';
import StatisticsLayout from '../../components/statistics/StatisticsLayout';
import { income, incomeHistory } from '../../data/statistics';

/** Format pesos compactly, e.g. ₱1.56B, ₱720M. */
const peso = (n: number) => {
  if (n >= 1_000_000_000) return `₱${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `₱${Math.round(n / 1_000_000)}M`;
  return `₱${n.toLocaleString('en-US')}`;
};

export default function MunicipalIncome() {
  const { t } = useTranslation();
  const m = (k: string, opts?: Record<string, unknown>) =>
    t(`pages.statistics.income.${k}`, opts ?? {});
  return (
    <>
      <SEO
        title={m('seoTitle')}
        description={m('seoDescription')}
        keywords={m('seoKeywords')}
      />
      <StatisticsLayout
        title={m('title')}
        crumb={m('title')}
        crumbHref="/statistics/municipal-income"
        intro={
          <p>
            {m('introBefore')} <strong>{m('introBlgfStrong')}</strong>{' '}
            {m('introAfter')}
          </p>
        }
      >
        {/* Headline stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-12">
          <StatCard
            label={m('statTotalRevenue')}
            value={peso(income.totalRevenue)}
            subtext={m('statTotalRevenueSub', { year: income.fiscalYear })}
            icon={Wallet}
          />
          <StatCard
            label={m('statClassification')}
            value={m('statClassificationValue')}
            subtext={m('statClassificationSub')}
            icon={Layers}
          />
          <StatCard
            label={m('statPerResident')}
            value={`₱${income.perCapita.toLocaleString('en-US')}`}
            subtext={m('statPerResidentSub', { year: income.fiscalYear })}
            icon={Users}
          />
        </div>

        {/* Income trend */}
        <div className="rounded-lg border border-gray-200 p-4 sm:p-6 mb-4">
          <Heading level={3} className="!mb-1 !text-lg">
            {m('chartIncomeTitle')}
          </Heading>
          <p className="text-sm text-gray-500 mb-6">
            {m('chartIncomeSubtitle')}
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={incomeHistory}
              margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={v => peso(v)}
                width={52}
              />
              <Tooltip
                formatter={(v, _n, p) => [
                  peso(Number(v)),
                  (p?.payload?.basis as string) ?? m('tooltipIncome'),
                ]}
                labelFormatter={l => m('tooltipFY', { year: l })}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {incomeHistory.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.year === income.fiscalYear ? '#0052bc' : '#99c2f7'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-4 text-xs italic leading-relaxed text-gray-500">
            {m('chartNote', { year: income.fiscalYear })}
          </p>
        </div>

        {/* Composition not yet itemized */}
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-5 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 shrink-0 text-primary-600" />
            <p className="font-semibold text-gray-900">
              {m('compositionTitle')}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            {m('compositionBody', { year: income.fiscalYear })}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a
              href="https://koronadal.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 underline hover:text-primary-800"
            >
              {m('linkCityBudget')}
            </a>
            <a
              href="https://blgf.gov.ph/lgu-fiscal-data/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 underline hover:text-primary-800"
            >
              {m('linkBlgf')}
            </a>
          </div>
        </div>

        <SourceNote
          verified="June 2026"
          sources={[
            {
              label: 'Bureau of Local Government Finance (BLGF)',
              href: 'https://blgf.gov.ph/lgu-fiscal-data/',
              note: `FY ${income.fiscalYear} total revenue (₱1.56B); income classification`,
            },
            {
              label: 'PhilAtlas — Koronadal',
              href: 'https://www.philatlas.com/mindanao/r12/south-cotabato/koronadal.html',
              note: 'Historical annual regular income (2009–2016)',
            },
            {
              label: 'Koronadal, South Cotabato — Wikipedia',
              href: 'https://en.wikipedia.org/wiki/Koronadal',
              note: 'FY 2024 revenue and income classification',
            },
          ]}
        />
      </StatisticsLayout>
    </>
  );
}
