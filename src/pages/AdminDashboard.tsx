import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import {
  adminLogin,
  adminListSubmissions,
  adminReview,
  adminListEntries,
  adminReviewSensitive,
  getToken,
  setToken,
  type Submission,
  type SensitiveItem,
  type EntryRow,
} from '../lib/registryApi';

const field =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';

const LoginForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        setBusy(true);
        setErr(null);
        try {
          await adminLogin(u, p);
          onDone();
        } catch (ex) {
          setErr(ex instanceof Error ? ex.message : 'Login failed.');
        } finally {
          setBusy(false);
        }
      }}
      className="max-w-sm space-y-4"
    >
      <input
        placeholder="Username"
        value={u}
        onChange={e => setU(e.target.value)}
        className={field}
      />
      <input
        type="password"
        placeholder="Password"
        value={p}
        onChange={e => setP(e.target.value)}
        className={field}
      />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button
        disabled={busy}
        className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
};

const AdminDashboard: React.FC = () => {
  const [authed, setAuthed] = useState(!!getToken());
  const [subs, setSubs] = useState<Submission[]>([]);
  const [sensitive, setSensitive] = useState<SensitiveItem[]>([]);
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [s, e] = await Promise.all([
        adminListSubmissions(),
        adminListEntries(),
      ]);
      setSubs(s);
      setSensitive(e.sensitive.filter(i => i.state === 'pending_second'));
      setEntries(e.entries);
    } catch (ex) {
      // token likely expired
      if (ex instanceof Error && /unauth/i.test(ex.message)) {
        setToken(null);
        setAuthed(false);
      } else setMsg(ex instanceof Error ? ex.message : 'Load failed.');
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const act = async (fn: () => Promise<unknown>, ok: string) => {
    setMsg(null);
    try {
      await fn();
      setMsg(ok);
      await load();
    } catch (ex) {
      setMsg(ex instanceof Error ? ex.message : 'Action failed.');
    }
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin · Bantay Opisyal</title>
      </Helmet>
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <div className="flex items-center justify-between">
            <Heading>Bantay Opisyal — Admin</Heading>
            {authed && (
              <button
                onClick={() => {
                  setToken(null);
                  setAuthed(false);
                }}
                className="text-sm text-gray-500 underline"
              >
                Sign out
              </button>
            )}
          </div>

          {!authed ? (
            <div className="mt-6">
              <LoginForm onDone={() => setAuthed(true)} />
            </div>
          ) : (
            <div className="mt-6 space-y-12">
              {msg && (
                <p className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                  {msg}
                </p>
              )}

              {/* Pending submissions */}
              <section>
                <Heading level={2}>Pending submissions ({subs.length})</Heading>
                {subs.length === 0 && (
                  <p className="text-sm text-gray-500">Nothing to review.</p>
                )}
                <div className="space-y-3">
                  {subs.map(s => (
                    <div
                      key={s.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium">
                          {s.kind}
                        </span>
                        <span className="font-semibold">{s.person_name}</span>
                        {(s.kind === 'court_case' || s.kind === 'concern') && (
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                            sensitive · needs 2-person review
                          </span>
                        )}
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                        {s.note}
                      </p>
                      {Array.isArray(
                        (s.payload as { sources?: string[] })?.sources
                      ) && (
                        <ul className="mt-2 text-xs text-primary-700">
                          {(s.payload as { sources?: string[] }).sources!.map(
                            (u, i) => (
                              <li key={i}>
                                <a
                                  href={u}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline"
                                >
                                  {u}
                                </a>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                      <p className="mt-2 text-xs text-gray-400">
                        {s.submitter_name || 'anonymous'}
                        {s.submitter_email ? ` · ${s.submitter_email}` : ''}
                      </p>
                      <div className="mt-3 flex gap-3">
                        <button
                          onClick={() =>
                            act(() => adminReview(s.id, 'approve'), 'Approved.')
                          }
                          className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            act(() => adminReview(s.id, 'reject'), 'Rejected.')
                          }
                          className="rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sensitive items awaiting second review */}
              <section>
                <Heading level={2}>
                  Sensitive items — second review ({sensitive.length})
                </Heading>
                <p className="mb-3 text-sm text-gray-500">
                  Court cases and concerns publish only after a second admin
                  confirms. With more than one admin, the publisher must differ
                  from the first reviewer.
                </p>
                <div className="space-y-3">
                  {sensitive.map(i => (
                    <div
                      key={i.id}
                      className="rounded-lg border border-amber-200 bg-amber-50 p-4"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          {i.kind}
                        </span>
                        <span className="font-semibold">{i.person_id}</span>
                        <span className="text-xs text-gray-500">
                          first: {i.first_reviewer ?? '—'}
                        </span>
                      </div>
                      <pre className="mt-2 overflow-x-auto rounded bg-white p-2 text-xs text-gray-700">
                        {JSON.stringify(i.data, null, 2)}
                      </pre>
                      <div className="mt-3 flex gap-3">
                        <button
                          onClick={() =>
                            act(
                              () => adminReviewSensitive(i.id, 'publish'),
                              'Published.'
                            )
                          }
                          className="rounded bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700"
                        >
                          Publish
                        </button>
                        <button
                          onClick={() =>
                            act(
                              () => adminReviewSensitive(i.id, 'reject'),
                              'Rejected.'
                            )
                          }
                          className="rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Published entries (live additions/edits) */}
              <section>
                <Heading level={2}>
                  Published entries ({entries.length})
                </Heading>
                <div className="space-y-2 text-sm">
                  {entries.map(e => (
                    <div
                      key={e.person_id}
                      className="rounded border border-gray-200 px-3 py-2"
                    >
                      <span className="font-medium">{e.name}</span>{' '}
                      <span className="text-gray-400">
                        ({e.person_id}) · {e.updated_by ?? '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </Section>
      </main>
    </>
  );
};

export default AdminDashboard;
