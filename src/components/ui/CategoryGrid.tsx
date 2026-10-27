import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router';

export interface CategoryGridItem {
  key: string;
  to: string;
  title: string;
  description: string;
  icon: string;
}

const getIcon = (name: string) => {
  const Icon = LucideIcons[name as keyof typeof LucideIcons] as
    React.ComponentType<{ className?: string }> | undefined;
  return Icon ? <Icon className="h-6 w-6" /> : null;
};

/**
 * Category cards in the regov.app style: a thick brand rule with a yellow
 * tab, a large number, then title and description.
 */
export default function CategoryGrid({ items }: { items: CategoryGridItem[] }) {
  return (
    <ol className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((item, i) => (
        <li key={item.key} className="relative">
          <Link
            to={item.to}
            className="group flex h-full flex-col border-t-2 border-kapwa-brand-900 pt-5"
          >
            <span
              aria-hidden="true"
              className="absolute -top-0.5 left-0 h-1.5 w-12 bg-kapwa-yellow-400 transition-all group-hover:w-full"
            />
            <div className="flex items-center justify-between">
              <span className="text-4xl font-black tracking-tight tabular-nums text-kapwa-brand-900">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-kapwa-brand-900">{getIcon(item.icon)}</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-neutral-900 group-hover:text-kapwa-brand-900">
              {item.title}
            </h3>
            <p className="mt-2 text-[15px] leading-snug text-neutral-600">
              {item.description}
            </p>
            <span
              aria-hidden="true"
              className="mt-auto pt-4 text-lg font-bold text-kapwa-brand-900 transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
