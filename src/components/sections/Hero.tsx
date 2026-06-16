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
  label: string;
  to: string;
  Icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

const tasks: Task[] = [
  {
    label: 'Apply for a Business Permit',
    to: '/services/business/apply-for-barangay-clearance-and-mayors-business-permits',
    Icon: Building2,
  },
  {
    label: 'Renew Permit / Pay Business Tax',
    to: '/services/business/renew-permits-and-pay-local-business-taxes',
    Icon: Receipt,
  },
  {
    label: 'Find Health Services',
    to: '/services/health-services',
    Icon: HeartPulse,
  },
  {
    label: 'Apply for a Scholarship',
    to: '/services/education/apply-for-local-scholarships',
    Icon: GraduationCap,
  },
  {
    label: 'Garbage Collection Schedule',
    to: '/services/garbage-waste-disposal/check-garbage-collection-schedules-and-request-pickup',
    Icon: Trash2,
  },
  {
    label: 'Social Welfare Assistance',
    to: '/services/social-welfare/apply-for-senior-citizen-solo-parent-or-pwd-assistance',
    Icon: Users,
  },
  {
    label: 'Report a Road or Drainage Issue',
    to: '/services/infrastructure-public-works/report-damaged-roads-bridges-or-drainage',
    Icon: Wrench,
  },
  {
    label: 'Emergency Hotlines',
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
            <Text transform="uppercase">Welcome to</Text>
            <Heading>{import.meta.env.VITE_GOVERNMENT_NAME}</Heading>
            <Text>{t('hero.subtitle')}</Text>

            <form onSubmit={onSubmit} className="mt-6 max-w-md">
              <div className="flex items-center gap-2 rounded-lg bg-white p-1.5 shadow-sm">
                <Search className="ml-2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search services and information…"
                  aria-label="Search BetterKoronadal.org"
                  className="w-full bg-transparent py-1.5 text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Search
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
                    Top Tasks
                  </h2>
                  <p className="text-sm text-white/70">
                    Jump straight to the things people do most.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {tasks.map(({ label, to, Icon, highlight }) => (
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
                      {label}
                    </span>
                  </Link>
                ))}
              </div>

              <Link
                to="/services"
                className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white"
              >
                View all services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
