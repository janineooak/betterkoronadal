import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation, Trans } from 'react-i18next';
import {
  Search,
  Building2,
  Receipt,
  HeartPulse,
  GraduationCap,
  Trash2,
  Users,
  Wrench,
  Siren,
  ArrowRight,
} from 'lucide-react';

interface Task {
  labelKey: string;
  to: string;
  Icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

const tasks: Task[] = [
  {
    labelKey: 'hero.tasks.businessPermit',
    to: '/services/business/apply-for-barangay-clearance-and-mayors-business-permits',
    Icon: Building2,
  },
  {
    labelKey: 'hero.tasks.renewPermit',
    to: '/services/business/renew-permits-and-pay-local-business-taxes',
    Icon: Receipt,
  },
  {
    labelKey: 'hero.tasks.healthServices',
    to: '/services/health-services',
    Icon: HeartPulse,
  },
  {
    labelKey: 'hero.tasks.scholarship',
    to: '/services/education/apply-for-local-scholarships',
    Icon: GraduationCap,
  },
  {
    labelKey: 'hero.tasks.garbage',
    to: '/services/garbage-waste-disposal/check-garbage-collection-schedules-and-request-pickup',
    Icon: Trash2,
  },
  {
    labelKey: 'hero.tasks.socialWelfare',
    to: '/services/social-welfare/apply-for-senior-citizen-solo-parent-or-pwd-assistance',
    Icon: Users,
  },
  {
    labelKey: 'hero.tasks.reportRoad',
    to: '/services/infrastructure-public-works/report-damaged-roads-bridges-or-drainage',
    Icon: Wrench,
  },
  {
    labelKey: 'hero.tasks.hotlines',
    to: '/hotlines',
    Icon: Siren,
    highlight: true,
  },
];

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Soft brand wash at the bottom, standing in for regov's hero photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,var(--color-kapwa-brand-50)_100%)]"
      />
      <div className="relative container-gov pt-14 pb-16 lg:pt-20 lg:pb-20">
        <div className="text-center animate-fade-in">
          <p className="eyebrow text-kapwa-brand-900">{t('hero.eyebrow')}</p>
          <h1 className="mt-5 text-5xl sm:text-6xl xl:text-[84px] font-black tracking-tight leading-[0.95] text-neutral-900">
            <Trans
              i18nKey="hero.headline"
              components={{
                accent: <span className="text-kapwa-brand-900" />,
              }}
            />
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-neutral-600 leading-snug">
            {t('hero.subtitle')}
          </p>

          <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-2xl">
            <div className="flex border-2 border-kapwa-brand-900 bg-white">
              <Search
                aria-hidden="true"
                className="ml-4 h-5 w-5 self-center shrink-0 text-neutral-400"
              />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                aria-label={t('hero.searchAria')}
                className="min-w-0 flex-1 bg-transparent px-3 h-14 text-base sm:text-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 bg-kapwa-brand-900 px-4 sm:px-6 font-bold text-white hover:bg-kapwa-brand-950 transition inline-flex items-center gap-2"
              >
                <span className="hidden sm:inline">
                  {t('hero.searchButton')}
                </span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </div>

        {/* Top tasks, as a shared-border grid */}
        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div className="eyebrow text-neutral-500">{t('hero.topTasks')}</div>
            <Link
              to="/services"
              className="text-sm font-semibold text-neutral-900 hover:text-kapwa-brand-900"
            >
              {t('hero.viewAllServices')} →
            </Link>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-kapwa-brand-900 bg-white">
            {tasks.map(({ labelKey, to, Icon, highlight }, i) => (
              <li key={to} className="border-r border-b border-kapwa-brand-900">
                <Link
                  to={to}
                  className={`group flex h-full items-center gap-4 p-4 transition-colors ${
                    highlight
                      ? 'bg-kapwa-red-600 text-white hover:bg-kapwa-red-700'
                      : 'hover:bg-kapwa-brand-50'
                  }`}
                >
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      highlight ? 'text-white/80' : 'text-kapwa-brand-900'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      highlight ? 'text-white' : 'text-kapwa-brand-900'
                    }`}
                  />
                  <span
                    className={`flex-1 text-[15px] font-semibold leading-snug ${
                      highlight ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {t(labelKey)}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
