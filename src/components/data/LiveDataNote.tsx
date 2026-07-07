import { Database, ExternalLink } from 'lucide-react';
import { shortDate } from '../../lib/format';

interface LiveDataNoteProps {
  /** Human label for the upstream source, e.g. "BetterGov Open Congress API". */
  source: string;
  /** Link to the upstream explorer/source page. */
  href: string;
  /** ISO timestamp the snapshot was pulled (the feed's `fetchedAt`). */
  fetchedAt: string;
}

/**
 * A compact provenance line for a live-data section. These sections are
 * built from public BetterGov.ph APIs and refreshed on a schedule into
 * static JSON, so the figures are a dated snapshot, not real-time.
 */
export default function LiveDataNote({
  source,
  href,
  fetchedAt,
}: LiveDataNoteProps) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gray-500">
      <Database className="h-3.5 w-3.5 shrink-0 text-primary-600" />
      <span>
        Live data via{' '}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-primary-700 underline hover:text-primary-800"
        >
          {source}
          <ExternalLink className="h-3 w-3" />
        </a>
        . Snapshot updated {shortDate(fetchedAt)} — figures are indicative;
        verify against the official source.
      </span>
    </p>
  );
}
