import { BookOpenCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Source {
  label: string;
  href: string;
  /** Optional note shown after the label, e.g. "PSA 2024 census". */
  note?: string;
}

interface SourceNoteProps {
  sources: Source[];
  /** Optional ISO date string for "last verified". Defaults to none. */
  verified?: string;
  className?: string;
}

/**
 * A compact, citable "Sources" block for the bottom of content pages.
 * Mirrors the per-page footnote pattern; links out to official references
 * and back to the central /sources page.
 */
export default function SourceNote({
  sources,
  verified,
  className,
}: SourceNoteProps) {
  return (
    <aside
      className={`mt-12 rounded-lg border border-gray-200 bg-gray-50 p-5 text-sm ${
        className ?? ''
      }`}
      aria-label="Sources"
    >
      <div className="flex items-center gap-2 mb-2">
        <BookOpenCheck className="h-4 w-4 shrink-0 text-primary-600" />
        <p className="font-semibold text-gray-900">Sources</p>
      </div>
      <ul className="list-disc space-y-1 pl-6 text-gray-700">
        {sources.map(source => (
          <li key={source.href + source.label}>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 underline hover:text-primary-800"
            >
              {source.label}
            </a>
            {source.note && (
              <span className="text-gray-500"> — {source.note}</span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-gray-500">
        {verified && <>Last verified {verified}. </>}
        See the full{' '}
        <Link to="/sources" className="text-primary-600 underline">
          list of sources
        </Link>{' '}
        for how this information was compiled.
      </p>
    </aside>
  );
}
