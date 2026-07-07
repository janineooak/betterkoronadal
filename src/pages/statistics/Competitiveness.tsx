import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Trophy, Medal, ShieldCheck, ArrowUpRight } from 'lucide-react';
import SEO from '../../components/SEO';
import SourceNote from '../../components/ui/SourceNote';
import StatCard from '../../components/ui/StatCard';
import { Heading } from '../../components/ui/Heading';
import { Card, CardContent } from '@bettergov/kapwa/card';
import StatisticsLayout from '../../components/statistics/StatisticsLayout';
import { cmci } from '../../data/statistics';

export default function Competitiveness() {
  const { t } = useTranslation();
  const c = (k: string, opts?: Record<string, unknown>) =>
    t(`pages.statistics.competitiveness.${k}`, opts ?? {});
  const rankDelta = cmci.previousRank - cmci.rank; // positive = improved
  const strongest = [...cmci.pillars].sort((a, b) => a.rank - b.rank)[0];

  const chartData = cmci.pillars.map(p => ({
    name: p.name.replace('Government ', 'Govt. '),
    [`${cmci.edition - 1}`]: p.score2023,
    [`${cmci.edition}`]: p.score2024,
  }));

  return (
    <>
      <SEO
        title={c('seoTitle')}
        description={c('seoDescription')}
        keywords={c('seoKeywords')}
      />
      <StatisticsLayout
        title={c('title')}
        crumb={c('title')}
        crumbHref="/statistics/competitiveness"
        intro={
          <p>
            {c('introBefore')} <strong>{c('introDtiStrong')}</strong>{' '}
            {c('introMiddle')} <strong>{c('introCmciStrong')}</strong>
            {c('introAfter', { edition: cmci.edition })}
          </p>
        }
      >
        {/* Headline stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <StatCard
            label={c('statOverallScore')}
            value={cmci.overallScore.toFixed(2)}
            subtext={c('statOverallScoreSub', { edition: cmci.edition })}
            icon={Trophy}
          />
          <StatCard
            label={c('statNationalRank')}
            value={c('statNationalRankValue', { rank: cmci.rank })}
            subtext={c('statNationalRankSub', { total: cmci.totalRanked })}
            icon={Medal}
          />
          <StatCard
            label={c('statYoY')}
            value={rankDelta > 0 ? `+${rankDelta}` : String(rankDelta)}
            subtext={c('statYoYSub', {
              prevEdition: cmci.edition - 1,
              prevRank: cmci.previousRank,
            })}
            icon={ArrowUpRight}
          />
          <StatCard
            label={c('statStrongest')}
            value={c('statStrongestValue', { rank: strongest.rank })}
            subtext={strongest.name}
            icon={ShieldCheck}
          />
        </div>

        {/* Pillar comparison chart */}
        <div className="rounded-lg border border-gray-200 p-4 sm:p-6 mb-10">
          <Heading level={3} className="!mb-1 !text-lg">
            {c('pillarChartTitle')}
          </Heading>
          <p className="text-sm text-gray-500 mb-6">
            {c('pillarChartSubtitle')}
          </p>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={56}
              />
              <YAxis tick={{ fontSize: 12 }} width={36} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} />
              <Legend />
              <Bar
                dataKey={`${cmci.edition - 1}`}
                fill="#99c2f7"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey={`${cmci.edition}`}
                fill="#0052bc"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pillar detail cards */}
        <Heading level={3} className="!text-lg">
          {c('fivePillarsHeading')}
        </Heading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {cmci.pillars.map(p => (
            <Card key={p.name} className="h-full">
              <CardContent>
                <p className="font-semibold text-gray-900">{p.name}</p>
                <p className="mt-2 text-2xl font-bold text-primary-700">
                  {p.score2024.toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {c('pillarRankLine', { rank: p.rank, edition: cmci.edition })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top strengths */}
        <div className="rounded-lg bg-primary-50 border border-primary-100 p-5 mb-2">
          <p className="font-semibold text-gray-900 mb-2">
            {c('rankedFirstTitle', { edition: cmci.edition })}
          </p>
          <ul className="list-disc space-y-1 pl-6 text-sm text-gray-700">
            {cmci.topStrengths.map(s => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <SourceNote
          verified="June 2026"
          sources={[
            {
              label: 'DTI — Cities and Municipalities Competitiveness Index',
              href: 'https://cmci.dti.gov.ph/lgu-profile.php?lgu=Koronadal',
              note: `${cmci.edition} edition — Koronadal city profile`,
            },
            {
              label: 'DTI CMCI — Component Cities rankings',
              href: 'https://cmci.dti.gov.ph/rankings-data.php?unit=Component+Cities',
              note: `Overall ${cmci.overallScore} · rank ${cmci.rank} of ${cmci.totalRanked}`,
            },
          ]}
        />
      </StatisticsLayout>
    </>
  );
}
