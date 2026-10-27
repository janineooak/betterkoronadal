import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Clock,
  ExternalLink,
  Search,
  ShieldAlert,
  UserRound,
  X,
} from 'lucide-react';
import type {
  EntryRow,
  SensitiveItem,
  Submission,
} from '../../lib/registryApi';
import { cn } from '../../lib/utils';
import { Button, DataList, EmptyState, KindBadge } from './ui';
import { SENSITIVE_KINDS, field, timeAgo } from './helpers';

type Run = (id: string, fn: () => Promise<unknown>, ok: string) => void;

/* -------------------------------------------------------------------------- */
/* Submissions                                                                 */
/* -------------------------------------------------------------------------- */

export function SubmissionsPanel({
  subs,
  busyIds,
  onReview,
}: {
  subs: Submission[];
  busyIds: Set<string>;
  onReview: (
    s: Submission,
    action: 'approve' | 'reject',
    note?: string
  ) => void;
}) {
  const [kind, setKind] = useState('all');
  const [query, setQuery] = useState('');

  const kinds = useMemo(() => {
    const counts = new Map<string, number>();
    subs.forEach(s => counts.set(s.kind, (counts.get(s.kind) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [subs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subs.filter(s => {
      if (kind !== 'all' && s.kind !== kind) return false;
      if (!q) return true;
      return [s.person_name, s.note, s.submitter_name, s.submitter_email]
        .filter(Boolean)
        .some(v => v!.toLowerCase().includes(q));
    });
  }, [subs, kind, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-1.5">
          <Chip active={kind === 'all'} onClick={() => setKind('all')}>
            All <span className="opacity-60">{subs.length}</span>
          </Chip>
          {kinds.map(([k, n]) => (
            <Chip key={k} active={kind === k} onClick={() => setKind(k)}>
              {k.replace(/_/g, ' ')} <span className="opacity-60">{n}</span>
            </Chip>
          ))}
        </div>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search name, note, submitter…"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={subs.length === 0 ? 'Queue is clear' : 'No matches'}>
          {subs.length === 0
            ? 'New citizen contributions will show up here.'
            : 'Try a different filter or search.'}
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {filtered.map(s => (
            <SubmissionCard
              key={s.id}
              s={s}
              busy={busyIds.has(s.id)}
              onReview={onReview}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function SubmissionCard({
  s,
  busy,
  onReview,
}: {
  s: Submission;
  busy: boolean;
  onReview: (
    s: Submission,
    action: 'approve' | 'reject',
    note?: string
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [confirmReject, setConfirmReject] = useState(false);
  const sensitive = SENSITIVE_KINDS.has(s.kind);
  const { sources, ...rest } = (s.payload ?? {}) as {
    sources?: unknown;
  } & Record<string, unknown>;
  const sourceList = Array.isArray(sources)
    ? (sources.filter(x => typeof x === 'string') as string[])
    : [];
  const hasDetails = Object.keys(rest).length > 0;

  return (
    <li
      className={cn(
        'rounded-xl border bg-white shadow-sm',
        sensitive ? 'border-amber-200' : 'border-gray-200'
      )}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <KindBadge kind={s.kind} />
          {sensitive && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-700">
              <ShieldAlert className="h-3.5 w-3.5" /> Needs 2 reviewers
            </span>
          )}
          <span
            className="ml-auto inline-flex items-center gap-1 text-xs text-gray-400"
            title={new Date(s.created_at).toLocaleString()}
          >
            <Clock className="h-3 w-3" /> {timeAgo(s.created_at)}
          </span>
        </div>

        <h3 className="mt-2 text-base font-semibold text-gray-900">
          {s.person_name}
          {s.person_id && (
            <a
              href={`/officials/${s.person_id}`}
              target="_blank"
              rel="noreferrer"
              className="ml-2 inline-flex items-center gap-0.5 align-middle text-xs font-normal text-primary-600 hover:underline"
            >
              view profile <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </h3>

        {s.note && (
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {s.note}
          </p>
        )}

        {sourceList.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-500">Sources</p>
            <ul className="mt-1 space-y-0.5">
              {sourceList.map((u, i) => (
                <li key={i}>
                  <a
                    href={u}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-xs text-primary-700 underline"
                  >
                    {u}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasDetails && (
          <div className="mt-3">
            <button
              onClick={() => setOpen(o => !o)}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition', open && 'rotate-180')}
              />
              {open ? 'Hide' : 'Show'} proposed data
            </button>
            {open && (
              <div className="mt-2 rounded-lg bg-gray-50 p-3">
                <DataList data={rest} />
              </div>
            )}
          </div>
        )}

        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-500">
          <UserRound className="h-3.5 w-3.5" />
          {s.submitter_name || 'Anonymous'}
          {s.submitter_email && (
            <a
              href={`mailto:${s.submitter_email}`}
              className="text-gray-400 hover:text-primary-600"
            >
              · {s.submitter_email}
            </a>
          )}
        </p>
      </div>

      <div className="space-y-3 border-t border-gray-100 bg-gray-50/60 p-4 sm:px-5">
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Review note (optional, saved with your decision)"
          rows={1}
          className={cn(field, 'resize-y text-xs')}
        />
        <div className="flex flex-wrap items-center gap-2">
          {!confirmReject ? (
            <>
              <Button
                size="sm"
                busy={busy}
                icon={<Check className="h-3.5 w-3.5" />}
                onClick={() => onReview(s, 'approve', note.trim() || undefined)}
                className="bg-green-600 hover:bg-green-700"
              >
                {sensitive ? 'Approve (1 of 2)' : 'Approve & publish'}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={busy}
                icon={<X className="h-3.5 w-3.5" />}
                onClick={() => setConfirmReject(true)}
              >
                Reject
              </Button>
            </>
          ) : (
            <>
              <span className="text-xs text-gray-600">
                Reject this submission?
              </span>
              <Button
                size="sm"
                variant="danger"
                busy={busy}
                onClick={() => onReview(s, 'reject', note.trim() || undefined)}
              >
                Yes, reject
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirmReject(false)}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Sensitive — second review                                                   */
/* -------------------------------------------------------------------------- */

export function SensitivePanel({
  items,
  username,
  busyIds,
  run,
  onDecide,
}: {
  items: SensitiveItem[];
  username: string | null;
  busyIds: Set<string>;
  run: Run;
  onDecide: (id: string, action: 'publish' | 'reject') => Promise<unknown>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          Court cases and concerns go live only after a <strong>second</strong>{' '}
          admin confirms them. Check the sources, use neutral wording, and keep
          the presumption of innocence in mind.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState title="Nothing awaiting a second review" />
      ) : (
        <ul className="space-y-3">
          {items.map(i => {
            const busy = busyIds.has(i.id);
            const mine = !!username && i.first_reviewer === username;
            return (
              <li
                key={i.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <KindBadge kind={i.kind} />
                  <a
                    href={`/officials/${i.person_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-gray-900 hover:text-primary-700"
                  >
                    {i.person_id}
                  </a>
                  <span className="ml-auto text-xs text-gray-500">
                    1st review by{' '}
                    <strong className="font-medium text-gray-700">
                      {i.first_reviewer ?? '—'}
                    </strong>{' '}
                    · {timeAgo(i.first_at ?? i.created_at)}
                  </span>
                </div>
                <div className="mt-3 rounded-lg bg-gray-50 p-3">
                  <DataList data={i.data} />
                </div>
                {mine && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-700">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    You did the first review, so another admin must publish
                    this.
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="warning"
                    busy={busy}
                    disabled={mine}
                    icon={<Check className="h-3.5 w-3.5" />}
                    onClick={() =>
                      run(i.id, () => onDecide(i.id, 'publish'), 'Published.')
                    }
                  >
                    Publish
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    icon={<X className="h-3.5 w-3.5" />}
                    onClick={() =>
                      run(i.id, () => onDecide(i.id, 'reject'), 'Rejected.')
                    }
                  >
                    Reject
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Published                                                                   */
/* -------------------------------------------------------------------------- */

export function PublishedPanel({ entries }: { entries: EntryRow[] }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? entries.filter(
          e =>
            e.name.toLowerCase().includes(q) ||
            e.person_id.toLowerCase().includes(q)
        )
      : entries;
  }, [entries, query]);

  if (entries.length === 0)
    return (
      <EmptyState title="No published entries yet">
        Approved additions and edits will be listed here.
      </EmptyState>
    );

  return (
    <div className="space-y-4">
      <SearchBox
        value={query}
        onChange={setQuery}
        placeholder="Search published people…"
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500">
            <tr>
              <th className="px-4 py-2.5">Person</th>
              <th className="hidden px-4 py-2.5 sm:table-cell">Updated by</th>
              <th className="px-4 py-2.5 text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(e => (
              <tr key={e.person_id} className="hover:bg-gray-50">
                <td className="px-4 py-2.5">
                  <a
                    href={`/officials/${e.person_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-gray-900 hover:text-primary-700"
                  >
                    {e.name}
                  </a>
                  <span className="block text-xs text-gray-400">
                    {e.person_id}
                  </span>
                </td>
                <td className="hidden px-4 py-2.5 text-gray-600 sm:table-cell">
                  {e.updated_by ?? '—'}
                </td>
                <td
                  className="px-4 py-2.5 text-right text-xs text-gray-500"
                  title={new Date(e.updated_at).toLocaleString()}
                >
                  {timeAgo(e.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-500">No matches.</p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
        active
          ? 'bg-gray-900 text-white'
          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
      )}
    >
      {children}
    </button>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative sm:ml-auto sm:w-72">
      <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(field, 'pl-9')}
      />
    </div>
  );
}
