import { useMemo, useState } from 'react';
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
  const [view, setView] = useState<'trend' | 'barangays'>('trend');

  // Barangays sorted high → low for the comparison chart.
  const sortedBarangays = useMemo(
    () => [...barangayPopulations].sort((a, b) => b.population - a.population),
    []
  );

  return (
    <>
      <SEO
        title="Koronadal Demographics & Population Statistics"
        description="Population statistics for the City of Koronadal: PSA census history from 2000 to 2024, annual growth rates, and a breakdown of all 27 barangays."
        keywords="Koronadal population, Koronadal demographics, PSA census, Koronadal barangays population, South Cotabato statistics"
      />
      <StatisticsLayout
        title="Demographics"
        crumb="Demographics"
        crumbHref="/statistics"
        intro={
          <p>
            How many people call Koronadal home, where they live, and how the
            city has grown — drawn from the official{' '}
            <strong>Philippine Statistics Authority (PSA)</strong> census.
          </p>
        }
      >
        {/* Headline stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <StatCard
            label="Total Population"
            value={fmt(demographics.population2024)}
            subtext="2024 PSA census"
            icon={Users}
          />
          <StatCard
            label="Annual Growth"
            value={`${demographics.annualGrowth}%`}
            subtext="Per year, 2020–2024"
            icon={TrendingUp}
          />
          <StatCard
            label="Barangays"
            value={String(demographics.barangayCount)}
            subtext={`${fmt(demographics.density2024)} residents / km²`}
            icon={MapPinned}
          />
          <StatCard
            label="Households"
            value={fmt(demographics.households2024)}
            subtext="2024 PSA census"
            icon={Home}
          />
        </div>

        {/* Chart toggle */}
        <div className="mb-4 inline-flex gap-1.5 rounded-xl bg-gray-100 p-1.5">
          {(
            [
              ['trend', 'Population Trend'],
              ['barangays', 'By Barangay'],
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
                Population, 2000–2024
              </Heading>
              <p className="text-sm text-gray-500 mb-6">
                PSA Census of Population
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
                    formatter={v => [fmt(Number(v)), 'Population']}
                    labelFormatter={l => `Census ${l}`}
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
              Average annual growth rate
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
              Population by barangay
            </Heading>
            <p className="text-sm text-gray-500 mb-6">
              2020 PSA Census — all 27 barangays
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
                  formatter={v => [fmt(Number(v)), 'Population']}
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
            How to read this data
          </p>
          <p>
            Census figures are actual resident counts taken by the PSA, not
            estimates. The annual growth rate is the average yearly change
            between two census years. Per-barangay figures are from the 2020
            census; barangay-level 2024 counts have not yet been published.
            Koronadal&rsquo;s {fmt(demographics.population2024)} residents make
            up about {demographics.provinceShare}% of South Cotabato&rsquo;s
            population.
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
