import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';

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
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left section with title and search */}
          <div className="animate-fade-in">
            <Text transform="uppercase">{t('hero.welcomeTo')}</Text>
            <Heading>{import.meta.env.VITE_GOVERNMENT_NAME}</Heading>
            <Text>{t('hero.subtitle')}</Text>

            <form onSubmit={onSubmit} className="mt-6 max-w-md">
              <div className="flex items-center gap-2 rounded-lg bg-white p-1.5 shadow-sm">
                <Search className="ml-2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t('hero.searchPlaceholder')}
                  aria-label={t('hero.searchAria')}
                  className="w-full bg-transparent py-1.5 text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  {t('hero.searchButton')}
                </button>
              </div>
            </form>
          </div>

          {/* Right section with top tasks */}
          <div className="animate-fade-in lg:animate-slide-in">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {t('hero.topTasks')}
                  </h2>
                  <p className="text-sm text-white/70">
                    {t('hero.topTasksSubtitle')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {tasks.map(({ labelKey, to, Icon, highlight }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`group flex items-center gap-3 rounded-xl border p-3 transition-all hover:-translate-y-0.5 ${
                      highlight
                        ? 'border-red-300/40 bg-red-500/20 hover:bg-red-500/30'
                        : 'border-white/15 bg-white/10 hover:border-white/40 hover:bg-white/20'
                    }`}
                  >
                    <span
                      className={`inline-flex shrink-0 rounded-lg p-2 ${
                        highlight
                          ? 'bg-red-100 text-red-600'
                          : 'bg-white text-primary-600'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium leading-snug text-white">
                      {t(labelKey)}
                    </span>
                  </Link>
                ))}
              </div>

              <Link
                to="/services"
                className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white"
              >
                {t('hero.viewAllServices')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
