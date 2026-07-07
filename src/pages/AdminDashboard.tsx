import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  Search,
  Check,
  X,
  AlertTriangle,
  Inbox,
  Clock,
  User,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { StatCard } from '../components/data/ui';
import { shortDate } from '../lib/format';
import {
  adminLogin,
  adminListSubmissions,
  adminReview,
  adminListEntries,
  adminReviewSensitive,
  getToken,
  setToken,
  getUsername,
  type Submission,
  type SensitiveItem,
  type EntryRow,
} from '../lib/registryApi';

const field =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';

const SENSITIVE_KINDS = new Set(['court_case', 'concern']);

/* -------------------------------------------------------------------------- */
/* Login                                                                       */
/* -------------------------------------------------------------------------- */

const LoginForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="mx-auto mt-10 max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-primary-600" />
        <p className="text-lg font-semibold text-gray-900">Admin sign-in</p>
      </div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setBusy(true);
          setErr(null);
          try {
            await adminLogin(u.trim(), p);
            onDone();
          } catch (ex) {
            setErr(ex instanceof Error ? ex.message : 'Login failed.');
          } finally {
            setBusy(false);
          }
        }}
        className="space-y-4"
      >
        <input
          placeholder="Username"
          autoComplete="username"
          value={u}
          onChange={e => setU(e.target.value)}
          className={field}
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={p}
          onChange={e => setP(e.target.value)}
          className={field}
        />
        {err && (
          <p className="flex items-start gap-1.5 text-sm text-red-600">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {err}
          </p>
        )}
        <button
          disabled={busy || !u || !p}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Small presentational helpers                                                */
/* -------------------------------------------------------------------------- */

const KindBadge: React.FC<{ kind: string }> = ({ kind }) => (
  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
    {kind.replace(/_/g, ' ')}
  </span>
);

const Banner: React.FC<{
  tone: 'success' | 'error';
  children: React.ReactNode;
  onClose: () => void;
}> = ({ tone, children, onClose }) => (
  <div
    className={`flex items-start justify-between gap-3 rounded-lg border p-3 text-sm ${
      tone === 'success'
        ? 'border-green-200 bg-green-50 text-green-800'
        : 'border-red-200 bg-red-50 text-red-700'
    }`}
  >
    <span className="flex items-start gap-2">
      {tone === 'success' ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      {children}
    </span>
    <button onClick={onClose} aria-label="Dismiss" className="shrink-0">
      <X className="h-4 w-4 opacity-60 hover:opacity-100" />
    </button>
  </div>
);

const EmptyState: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500">
    <Inbox className="h-6 w-6 text-gray-400" />
    {children}
  </div>
);

/** Render a sensitive item's payload as a readable key/value list. */
const SensitivePayload: React.FC<{ data: unknown }> = ({ data }) => {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return (
      <dl className="mt-2 grid grid-cols-1 gap-1 text-xs sm:grid-cols-[8rem_1fr]">
        {Object.entries(data as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-semibold capitalize text-gray-600">
              {k.replace(/_/g, ' ')}
            </dt>
            <dd className="whitespace-pre-wrap break-words text-gray-800">
              {typeof v === 'string' ? v : JSON.stringify(v)}
            </dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <p className="mt-2 whitespace-pre-wrap text-xs text-gray-800">
      {typeof data === 'string' ? data : JSON.stringify(data)}
    </p>
  );
};

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                   */
/* -------------------------------------------------------------------------- */

type Tab = 'submissions' | 'sensitive' | 'published';

const AdminDashboard: React.FC = () => {
  const [authed, setAuthed] = useState(!!getToken());
  const [username, setUsername] = useState<string | null>(getUsername());
  const [subs, setSubs] = useState<Submission[]>([]);
  const [sensitive, setSensitive] = useState<SensitiveItem[]>([]);
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<{
    tone: 'success' | 'error';
    text: string;
  } | null>(null);

  const [tab, setTab] = useState<Tab>('submissions');
  const [kindFilter, setKindFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, e] = await Promise.all([
        adminListSubmissions(),
        adminListEntries(),
      ]);
      setSubs(s);
      setSensitive(e.sensitive.filter(i => i.state === 'pending_second'));
      setEntries(e.entries);
    } catch (ex) {
      if (ex instanceof Error && /unauth/i.test(ex.message)) {
        setToken(null);
        setAuthed(false);
      } else {
        setBanner({
          tone: 'error',
          text: ex instanceof Error ? ex.message : 'Load failed.',
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) {
      setUsername(getUsername());
      load();
    }
  }, [authed, load]);

  const runAction = async (
    id: string,
    fn: () => Promise<unknown>,
    ok: string
  ) => {
    setBanner(null);
    setBusyIds(prev => new Set(prev).add(id));
    try {
      await fn();
      setBanner({ tone: 'success', text: ok });
      await load();
    } catch (ex) {
      setBanner({
        tone: 'error',
        text: ex instanceof Error ? ex.message : 'Action failed.',
      });
    } finally {
      setBusyIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const kinds = useMemo(
    () => ['all', ...Array.from(new Set(subs.map(s => s.kind)))],
    [subs]
  );

  const filteredSubs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subs.filter(s => {
      if (kindFilter !== 'all' && s.kind !== kindFilter) return false;
      if (!q) return true;
      return (
        s.person_name.toLowerCase().includes(q) ||
        (s.note ?? '').toLowerCase().includes(q) ||
        (s.submitter_name ?? '').toLowerCase().includes(q)
      );
    });
  }, [subs, kindFilter, query]);

  const signOut = () => {
    setToken(null);
    setAuthed(false);
    setUsername(null);
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin · Bantay Opisyal</title>
      </Helmet>
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary-600" />
              <Heading>Bantay Opisyal — Admin</Heading>
            </div>
            {authed && (
              <div className="flex items-center gap-4 text-sm">
                {username && (
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <User className="h-4 w-4" />
                    {username}
                  </span>
                )}
                <button
                  onClick={load}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                  />
                  Refresh
                </button>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>

          {!authed ? (
            <LoginForm onDone={() => setAuthed(true)} />
          ) : (
            <div className="mt-6 space-y-6">
              {banner && (
                <Banner tone={banner.tone} onClose={() => setBanner(null)}>
                  {banner.text}
                </Banner>
              )}

              {/* Summary */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Pending submissions" value={subs.length} />
                <StatCard
                  label="Sensitive — 2nd review"
                  value={sensitive.length}
                />
                <StatCard label="Published entries" value={entries.length} />
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-1 border-b border-gray-200">
                {(
                  [
                    ['submissions', `Submissions (${subs.length})`],
                    ['sensitive', `Sensitive review (${sensitive.length})`],
                    ['published', `Published (${entries.length})`],
                  ] as [Tab, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                      tab === id
                        ? 'border-primary-600 text-primary-700'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {loading && subs.length === 0 && entries.length === 0 ? (
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </p>
              ) : (
                <>
                  {/* Submissions */}
                  {tab === 'submissions' && (
                    <section className="space-y-4">
                      {/* Filter bar */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex flex-wrap gap-1">
                          {kinds.map(k => (
                            <button
                              key={k}
                              onClick={() => setKindFilter(k)}
                              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                                kindFilter === k
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {k.replace(/_/g, ' ')}
                            </button>
                          ))}
                        </div>
                        <div className="relative ml-auto">
                          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search name, note, submitter…"
                            className={`${field} w-64 max-w-full pl-8`}
                          />
                        </div>
                      </div>

                      {filteredSubs.length === 0 ? (
                        <EmptyState>
                          {subs.length === 0
                            ? 'Nothing to review — the queue is clear.'
                            : 'No submissions match this filter.'}
                        </EmptyState>
                      ) : (
                        filteredSubs.map(s => {
                          const busy = busyIds.has(s.id);
                          const sources = (s.payload as { sources?: string[] })
                            ?.sources;
                          return (
                            <div
                              key={s.id}
                              className="rounded-lg border border-gray-200 p-4"
                            >
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <KindBadge kind={s.kind} />
                                <span className="font-semibold text-gray-900">
                                  {s.person_name}
                                </span>
                                {SENSITIVE_KINDS.has(s.kind) && (
                                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                                    sensitive · needs 2-person review
                                  </span>
                                )}
                                <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                                  <Clock className="h-3 w-3" />
                                  {shortDate(s.created_at)}
                                </span>
                              </div>

                              {s.note && (
                                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                                  {s.note}
                                </p>
                              )}

                              {Array.isArray(sources) && sources.length > 0 && (
                                <ul className="mt-2 space-y-0.5 text-xs text-primary-700">
                                  {sources.map((u, i) => (
                                    <li key={i}>
                                      <a
                                        href={u}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="underline break-all"
                                      >
                                        {u}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              <p className="mt-2 text-xs text-gray-400">
                                {s.submitter_name || 'anonymous'}
                                {s.submitter_email
                                  ? ` · ${s.submitter_email}`
                                  : ''}
                              </p>

                              <textarea
                                value={notes[s.id] ?? ''}
                                onChange={e =>
                                  setNotes(n => ({
                                    ...n,
                                    [s.id]: e.target.value,
                                  }))
                                }
                                placeholder="Optional review note (recorded with your decision)…"
                                rows={2}
                                className={`${field} mt-3 text-xs`}
                              />

                              <div className="mt-3 flex gap-3">
                                <button
                                  disabled={busy}
                                  onClick={() =>
                                    runAction(
                                      s.id,
                                      () =>
                                        adminReview(
                                          s.id,
                                          'approve',
                                          notes[s.id]?.trim() || undefined
                                        ),
                                      SENSITIVE_KINDS.has(s.kind)
                                        ? 'Approved — sent for second review.'
                                        : 'Approved and published.'
                                    )
                                  }
                                  className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
                                >
                                  {busy ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                  Approve
                                </button>
                                <button
                                  disabled={busy}
                                  onClick={() => {
                                    if (
                                      !window.confirm(
                                        `Reject this submission for ${s.person_name}?`
                                      )
                                    )
                                      return;
                                    runAction(
                                      s.id,
                                      () =>
                                        adminReview(
                                          s.id,
                                          'reject',
                                          notes[s.id]?.trim() || undefined
                                        ),
                                      'Rejected.'
                                    );
                                  }}
                                  className="flex items-center gap-1 rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-60"
                                >
                                  <X className="h-3 w-3" />
                                  Reject
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </section>
                  )}

                  {/* Sensitive — second review */}
                  {tab === 'sensitive' && (
                    <section className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Court cases and concerns publish only after a{' '}
                        <strong>second</strong> admin confirms. The publisher
                        must differ from the first reviewer.
                      </p>
                      {sensitive.length === 0 ? (
                        <EmptyState>
                          Nothing awaiting a second review.
                        </EmptyState>
                      ) : (
                        sensitive.map(i => {
                          const busy = busyIds.has(i.id);
                          const conflict =
                            !!username && i.first_reviewer === username;
                          return (
                            <div
                              key={i.id}
                              className="rounded-lg border border-amber-200 bg-amber-50 p-4"
                            >
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <KindBadge kind={i.kind} />
                                <span className="font-semibold text-gray-900">
                                  {i.person_id}
                                </span>
                                <span className="ml-auto text-xs text-gray-500">
                                  first review: {i.first_reviewer ?? '—'}
                                </span>
                              </div>
                              <SensitivePayload data={i.data} />
                              {conflict && (
                                <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-700">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  You performed the first review — a different
                                  admin must publish this.
                                </p>
                              )}
                              <div className="mt-3 flex gap-3">
                                <button
                                  disabled={busy || conflict}
                                  onClick={() =>
                                    runAction(
                                      i.id,
                                      () =>
                                        adminReviewSensitive(i.id, 'publish'),
                                      'Published.'
                                    )
                                  }
                                  className="flex items-center gap-1 rounded bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-60"
                                >
                                  {busy ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                  Publish
                                </button>
                                <button
                                  disabled={busy}
                                  onClick={() =>
                                    runAction(
                                      i.id,
                                      () =>
                                        adminReviewSensitive(i.id, 'reject'),
                                      'Rejected.'
                                    )
                                  }
                                  className="flex items-center gap-1 rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-60"
                                >
                                  <X className="h-3 w-3" />
                                  Reject
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </section>
                  )}

                  {/* Published entries */}
                  {tab === 'published' && (
                    <section className="space-y-2 text-sm">
                      {entries.length === 0 ? (
                        <EmptyState>No published entries yet.</EmptyState>
                      ) : (
                        entries.map(e => (
                          <div
                            key={e.person_id}
                            className="flex flex-wrap items-center gap-x-2 rounded border border-gray-200 px-3 py-2"
                          >
                            <span className="font-medium text-gray-900">
                              {e.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({e.person_id})
                            </span>
                            <span className="ml-auto text-xs text-gray-400">
                              {e.updated_by ?? '—'} · {shortDate(e.updated_at)}
                            </span>
                          </div>
                        ))
                      )}
                    </section>
                  )}
                </>
              )}
            </div>
          )}
        </Section>
      </main>
    </>
  );
};

export default AdminDashboard;
