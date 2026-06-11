import { Link } from 'react-router-dom';
import {
  Building2,
  Receipt,
  HeartPulse,
  GraduationCap,
  Trash2,
  Users,
  Wrench,
  Siren,
} from 'lucide-react';
import Section from '../ui/Section';
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
    label: 'Get Social Welfare Assistance',
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

export default function TopTasks() {
  return (
    <Section className="bg-gray-50">
      <Heading level={2}>Top Tasks</Heading>
      <Text className="text-gray-600 mb-6">
        Jump straight to the things people do most.
      </Text>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tasks.map(({ label, to, Icon, highlight }) => (
          <Link
            key={to}
            to={to}
            className={`group flex flex-col items-start rounded-lg border bg-white p-4 transition-colors ${
              highlight
                ? 'border-red-200 hover:border-red-400 hover:bg-red-50'
                : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            <span
              className={`mb-3 inline-flex rounded-md p-2 ${
                highlight
                  ? 'bg-red-100 text-red-600'
                  : 'bg-primary-100 text-primary-600'
              }`}
            >
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium text-gray-900">{label}</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
