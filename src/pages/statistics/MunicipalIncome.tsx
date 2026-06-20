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
  return (
    <>
      <SEO
        title="Koronadal City Income & Revenue"
        description="The City of Koronadal's finances: total revenue, income classification, and the long-run trend in annual income, drawn from the Bureau of Local Government Finance (BLGF)."
        keywords="Koronadal city income, Koronadal budget, BLGF revenue, local government finance, NTA Koronadal"
      />
      <StatisticsLayout
        title="City Income"
        crumb="City Income"
        crumbHref="/statistics/municipal-income"
        intro={
          <p>
            Where the city&rsquo;s money comes from, drawn from the{' '}
            <strong>Bureau of Local Government Finance (BLGF)</strong> Statement
            of Receipts and Expenditures.
          </p>
        }
      >
        {/* Headline stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-12">
          <StatCard
            label="Total Revenue"
            value={peso(income.totalRevenue)}
            subtext={`FY ${income.fiscalYear} (BLGF)`}
            icon={Wallet}
          />
          <StatCard
            label="Income Classification"
            value="1st class"
            subtext="Highest LGU income tier"
            icon={Layers}
          />
          <StatCard
            label="Revenue per Resident"
            value={`₱${income.perCapita.toLocaleString('en-US')}`}
            subtext={`FY ${income.fiscalYear} ÷ population`}
            icon={Users}
          />
        </div>

        {/* Income trend */}
        <div className="rounded-lg border border-gray-200 p-4 sm:p-6 mb-4">
          <Heading level={3} className="!mb-1 !text-lg">
            Annual income over time
          </Heading>
          <p className="text-sm text-gray-500 mb-6">
            Bureau of Local Government Finance
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
                  (p?.payload?.basis as string) ?? 'Income',
                ]}
                labelFormatter={l => `FY ${l}`}
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
            Figures through 2016 are annual regular income; the{' '}
            {income.fiscalYear} figure is total revenue per the BLGF Statement
            of Receipts and Expenditures. The basis differs slightly, so read
            the trend as indicative rather than a like-for-like series.
          </p>
        </div>

        {/* Composition not yet itemized */}
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-5 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 shrink-0 text-primary-600" />
            <p className="font-semibold text-gray-900">
              Detailed revenue composition
            </p>
          </div>
          <p className="text-sm text-gray-600">
            A line-item breakdown — locally sourced revenue (business tax, real
            property tax, non-tax revenue) versus the National Tax Allotment —
            is not yet published in a machine-readable form for FY{' '}
            {income.fiscalYear}. The full itemization is available in the
            city&rsquo;s annual appropriation ordinance and the BLGF SRE; this
            page will be expanded once those figures are confirmed.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a
              href="https://koronadal.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 underline hover:text-primary-800"
            >
              City budget ordinances →
            </a>
            <a
              href="https://blgf.gov.ph/lgu-fiscal-data/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 underline hover:text-primary-800"
            >
              BLGF LGU fiscal data →
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
