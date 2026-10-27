import { Link } from 'react-router';

interface SectionHeaderProps {
  /** Two-digit section number shown before the label, e.g. "01". */
  index?: string;
  label: string;
  title?: string;
  description?: string;
  link?: { to: string; label: string };
}

/**
 * Numbered section header in the regov.app editorial style: a thick brand
 * rule, a small uppercase label, an optional big title and a side link.
 */
export default function SectionHeader({
  index,
  label,
  title,
  description,
  link,
}: SectionHeaderProps) {
  return (
    <div className="border-t-2 border-kapwa-brand-900 pt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div>
        <div className="eyebrow text-neutral-500 flex items-center gap-3">
          {index && (
            <span className="text-kapwa-brand-900 tabular-nums">{index}</span>
          )}
          {label}
        </div>
        {title && (
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-2 max-w-2xl text-neutral-600">{description}</p>
        )}
      </div>
      {link && (
        <Link
          to={link.to}
          className="text-sm font-semibold text-neutral-900 hover:text-kapwa-brand-900"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
