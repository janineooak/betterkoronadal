import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { Users, TrendingUp, MapPinned, Home } from 'lucide-react';
import SEO from '../../components/SEO';
import SourceNote from '../../components/ui/SourceNote';
import StatCard from '../../components/ui/StatCard';
import { Heading } from '../../components/ui/Heading';
import StatisticsLayout from '../../components/statistics/StatisticsLayout';
import {
  censusHistory,
  growthRates,
  barangayPopulations,
  demographics,
} from '../../data/statistics';

const fmt = (n: number) => n.toLocaleString('en-US');

export default function Demographics() {
  const { t } = useTranslation();
  const [view, setView] = useState<'trend' | 'barangays'>('trend');
  const d = (k: string, opts?: Record<string, unknown>) =>
    t(`pages.statistics.demographics.${k}`, opts ?? {});

  // Barangays sorted high → low for the comparison chart.
  const sortedBarangays = useMemo(
    () => [...barangayPopulations].sort((a, b) => b.population - a.population),
    []
  );

  return (
    <>
      <SEO
        title={d('seoTitle')}
        description={d('seoDescription')}
        keywords={d('seoKeywords')}
      />
      <StatisticsLayout
        title={d('title')}
        crumb={d('title')}
        crumbHref="/statistics"
        intro={
          <p>
            {d('introBefore')} <strong>{d('introPsaStrong')}</strong>{' '}
            {d('introAfter')}
          </p>
        }
      >
        {/* Headline stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <StatCard
            label={d('statTotalPopulation')}
            value={fmt(demographics.population2024)}
            subtext={d('statTotalPopulationSub')}
            icon={Users}
          />
          <StatCard
            label={d('statAnnualGrowth')}
            value={`${demographics.annualGrowth}%`}
            subtext={d('statAnnualGrowthSub')}
            icon={TrendingUp}
          />
          <StatCard
            label={d('statBarangays')}
            value={String(demographics.barangayCount)}
            subtext={d('statBarangaysSub', {
              density: fmt(demographics.density2024),
            })}
            icon={MapPinned}
          />
          <StatCard
            label={d('statHouseholds')}
            value={fmt(demographics.households2024)}
            subtext={d('statHouseholdsSub')}
            icon={Home}
          />
        </div>

        {/* Chart toggle */}
        <div className="mb-4 inline-flex gap-1.5 rounded-xl bg-gray-100 p-1.5">
          {(
            [
              ['trend', d('togglePopulationTrend')],
              ['barangays', d('toggleByBarangay')],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                view === key
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {view === 'trend' ? (
          <>
            <div className="rounded-lg border border-gray-200 p-4 sm:p-6 mb-8">
              <Heading level={3} className="!mb-1 !text-lg">
                {d('chartPopulationTitle')}
              </Heading>
              <p className="text-sm text-gray-500 mb-6">
                {d('chartPopulationSubtitle')}
              </p>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={censusHistory}
                  margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={v => `${Math.round(v / 1000)}k`}
                    width={44}
                  />
                  <Tooltip
                    formatter={v => [fmt(Number(v)), d('tooltipPopulation')]}
                    labelFormatter={l => d('tooltipCensus', { year: l })}
                  />
                  <Line
                    type="monotone"
                    dataKey="population"
                    stroke="#0052bc"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0052bc' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Growth rates */}
            <Heading level={3} className="!text-lg">
              {d('growthHeading')}
            </Heading>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-8">
              {growthRates.map(g => (
                <div
                  key={g.period}
                  className="rounded-lg border border-gray-200 px-4 py-3"
                >
                  <p className="text-xs text-gray-500">{g.period}</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {g.rate}%
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-gray-200 p-4 sm:p-6 mb-8">
            <Heading level={3} className="!mb-1 !text-lg">
              {d('chartByBarangayTitle')}
            </Heading>
            <p className="text-sm text-gray-500 mb-6">
              {d('chartByBarangaySubtitle')}
            </p>
            <ResponsiveContainer
              width="100%"
              height={Math.max(420, sortedBarangays.length * 22)}
            >
              <BarChart
                data={sortedBarangays}
                layout="vertical"
                margin={{ top: 0, right: 24, bottom: 0, left: 8 }}
              >
                <CartesianGrid horizontal={false} stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12 }}
                  tickFormatter={v => `${Math.round(v / 1000)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={v => [fmt(Number(v)), d('tooltipPopulation')]}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Bar dataKey="population" radius={[0, 4, 4, 0]}>
                  {sortedBarangays.map((_, i) => (
                    <Cell key={i} fill={i < 5 ? '#0052bc' : '#3385ef'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* How to read this data */}
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-5 text-sm text-gray-600 mb-2">
          <p className="font-semibold text-gray-900 mb-1">
            {d('howToReadTitle')}
          </p>
          <p>
            {d('howToReadBody', {
              population: fmt(demographics.population2024),
              share: demographics.provinceShare,
            })}
          </p>
        </div>

        <SourceNote
          verified="June 2026"
          sources={[
            {
              label: 'Philippine Statistics Authority (PSA) — RSSO XII',
              href: 'https://rsso12.psa.gov.ph/content/koronadal-citys-population-reaches-201844-says-2024-census',
              note: '2024 census (201,844); 50,814 households; 0.78% annual growth',
            },
            {
              label: 'PhilAtlas — Koronadal',
              href: 'https://www.philatlas.com/mindanao/r12/south-cotabato/koronadal.html',
              note: 'Census history 2000–2020; per-barangay 2020 populations',
            },
            {
              label: 'Koronadal, South Cotabato — Wikipedia',
              href: 'https://en.wikipedia.org/wiki/Koronadal',
              note: 'Census totals and growth rates',
            },
          ]}
        />
      </StatisticsLayout>
    </>
  );
}
