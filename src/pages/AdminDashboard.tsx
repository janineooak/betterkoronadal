import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router';
import {
  CheckCircle2,
  Inbox,
  LogOut,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react';
import {
  adminListEntries,
  adminListSubmissions,
  adminMe,
  adminReview,
  adminReviewSensitive,
  getToken,
  getUsername,
  setToken,
  type AdminAccount,
  type EntryRow,
  type SensitiveItem,
  type Submission,
} from '../lib/registryApi';
import { cn } from '../lib/utils';
import SignIn from './admin/SignIn';
import {
  PublishedPanel,
  SensitivePanel,
  SubmissionsPanel,
} from './admin/ReviewPanels';
import { AccountPanel, AdminsPanel } from './admin/AccountPanels';
import { Notice, Toast } from './admin/ui';
import { SENSITIVE_KINDS, errMsg } from './admin/helpers';

type Tab = 'queue' | 'sensitive' | 'published' | 'admins' | 'account';
const TABS: Tab[] = ['queue', 'sensitive', 'published', 'admins', 'account'];

type ToastState = { tone: 'success' | 'error'; text: string; id: number };

/** ms until the stored token expires (or 0). */
function tokenMsLeft(): number {
  const t = getToken();
  if (!t) return 0;
  try {
    const p = JSON.parse(
      atob(t.split('.')[0].replace(/-/g, '+').replace(/_/g, '/'))
    ) as { exp?: number };
    return Math.max(0, (p.exp ?? 0) - Date.now());
  } catch {
    return 0;
  }
}

const AdminDashboard: React.FC = () => {
  const [authed, setAuthed] = useState(() => !!getUsername());
  const [username, setUsername] = useState<string | null>(getUsername());
  const [account, setAccount] = useState<AdminAccount | null>(null);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [sensitive, setSensitive] = useState<SensitiveItem[]>([]);
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [loading, setLoading] = useState(authed);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<ToastState | null>(null);
  const [signedOutReason, setSignedOutReason] = useState<string | null>(null);

  const [params, setParams] = useSearchParams();
  const tabParam = params.get('tab') as Tab | null;
  const tab: Tab = tabParam && TABS.includes(tabParam) ? tabParam : 'queue';
  const setTab = (t: Tab) =>
    setParams(t === 'queue' ? {} : { tab: t }, { replace: true });

  const notify = useCallback(
    (tone: 'success' | 'error', text: string) =>
      setToast({ tone, text, id: Date.now() }),
    []
  );
  const clearToast = useCallback(() => setToast(null), []);

  const signOut = useCallback((reason?: string) => {
    setToken(null);
    setAuthed(false);
    setUsername(null);
    setAccount(null);
    setSubs([]);
    setSensitive([]);
    setEntries([]);
    setSignedOutReason(reason ?? null);
  }, []);

  const handleError = useCallback(
    (ex: unknown) => {
      if (/unauth/i.test(errMsg(ex)))
        signOut('Your session expired. Please sign in again.');
      else setLoadError(errMsg(ex, 'Could not load data.'));
    },
    [signOut]
  );

  const fetchAll = useCallback(
    () => Promise.all([adminListSubmissions(), adminListEntries(), adminMe()]),
    []
  );
  const apply = useCallback(
    ([s, e, me]: Awaited<ReturnType<typeof fetchAll>>) => {
      setSubs(s);
      setSensitive(e.sensitive.filter(i => i.state === 'pending_second'));
      setEntries(e.entries);
      setAccount(me);
      setLoadError(null);
    },
    []
  );

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      apply(await fetchAll());
    } catch (ex) {
      handleError(ex);
    } finally {
      setLoading(false);
    }
  }, [apply, fetchAll, handleError]);

  // Initial load after sign-in (`loading` is already true at that point).
  useEffect(() => {
    if (!authed) return;
    let active = true;
    fetchAll()
      .then(d => active && apply(d))
      .catch(ex => active && handleError(ex))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [authed, apply, fetchAll, handleError]);

  // Sign out automatically when the token expires.
  useEffect(() => {
    if (!authed) return;
    const t = setTimeout(
      () => signOut('Your session expired. Please sign in again.'),
      tokenMsLeft()
    );
    return () => clearTimeout(t);
  }, [authed, signOut, account]);

  const run = useCallback(
    async (id: string, fn: () => Promise<unknown>, ok: string) => {
      setBusyIds(prev => new Set(prev).add(id));
      try {
        await fn();
        notify('success', ok);
        // Drop it locally right away, then sync with the server.
        setSubs(prev => prev.filter(s => s.id !== id));
        setSensitive(prev => prev.filter(s => s.id !== id));
        await reload();
      } catch (ex) {
        if (/unauth/i.test(errMsg(ex))) handleError(ex);
        else notify('error', errMsg(ex, 'Action failed.'));
      } finally {
        setBusyIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [notify, reload, handleError]
  );

  const onReview = (
    s: Submission,
    action: 'approve' | 'reject',
    note?: string
  ) =>
    run(
      s.id,
      () => adminReview(s.id, action, note),
      action === 'reject'
        ? `Rejected submission for ${s.person_name}.`
        : SENSITIVE_KINDS.has(s.kind)
          ? `Approved — ${s.person_name} now needs a second reviewer.`
          : `Published update for ${s.person_name}.`
    );

  if (!authed) {
    return (
      <main className="flex-grow bg-gray-50 px-4">
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <title>Admin sign-in · Bantay Opisyal</title>
        </Helmet>
        {signedOutReason && (
          <div className="mx-auto max-w-md pt-8">
            <Notice tone="info" onClose={() => setSignedOutReason(null)}>
              {signedOutReason}
            </Notice>
          </div>
        )}
        <SignIn
          onSignedIn={() => {
            setUsername(getUsername());
            setSignedOutReason(null);
            setLoading(true);
            setAuthed(true);
          }}
        />
      </main>
    );
  }

  const nav: {
    id: Tab;
    label: string;
    icon: typeof Inbox;
    count?: number;
    alert?: boolean;
  }[] = [
    { id: 'queue', label: 'Review queue', icon: Inbox, count: subs.length },
    {
      id: 'sensitive',
      label: 'Second review',
      icon: ShieldAlert,
      count: sensitive.length,
      alert: sensitive.some(i => i.first_reviewer !== username),
    },
    {
      id: 'published',
      label: 'Published',
      icon: CheckCircle2,
      count: entries.length,
    },
    { id: 'admins', label: 'Admins', icon: Users },
    { id: 'account', label: 'Account', icon: UserCog },
  ];
  const current = nav.find(n => n.id === tab)!;

  return (
    <main className="flex-grow bg-gray-50">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin · Bantay Opisyal</title>
      </Helmet>

      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex items-center gap-3 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight text-gray-900">
              Bantay Opisyal
            </p>
            <p className="text-xs leading-tight text-gray-500">Admin</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={reload}
              disabled={loading}
              title="Refresh"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </button>
            <span className="hidden px-2 text-sm text-gray-600 sm:inline">
              {username}
            </span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:flex lg:gap-8 lg:py-8">
        {/* Navigation: sidebar on desktop, scrollable tabs on mobile */}
        <nav className="-mx-4 mb-6 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:mb-0 lg:w-56 lg:shrink-0 lg:flex-col lg:px-0">
          {nav.map(n => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              aria-current={tab === n.id ? 'page' : undefined}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                tab === n.id
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-600 hover:bg-white/70 hover:text-gray-900'
              )}
            >
              <n.icon
                className={cn(
                  'h-4 w-4',
                  tab === n.id ? 'text-primary-600' : 'text-gray-400'
                )}
              />
              {n.label}
              {n.count !== undefined && n.count > 0 && (
                <span
                  className={cn(
                    'ml-auto rounded-full px-2 py-0.5 text-xs',
                    n.alert
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {n.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-5">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {current.label}
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {
                {
                  queue: 'Citizen contributions waiting for a decision.',
                  sensitive:
                    'Court cases and concerns approved once, awaiting a second admin.',
                  published: 'Admin-approved additions live on the site.',
                  admins: 'Who can sign in to this dashboard.',
                  account: 'Your sign-in details.',
                }[tab]
              }
            </p>
          </div>

          {loadError && (
            <Notice tone="error" onClose={() => setLoadError(null)}>
              {loadError}
            </Notice>
          )}

          {loading &&
          !account &&
          (tab === 'queue' || tab === 'sensitive' || tab === 'published') ? (
            <div className="space-y-3">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white"
                />
              ))}
            </div>
          ) : (
            <>
              {tab === 'queue' && (
                <SubmissionsPanel
                  subs={subs}
                  busyIds={busyIds}
                  onReview={onReview}
                />
              )}
              {tab === 'sensitive' && (
                <SensitivePanel
                  items={sensitive}
                  username={username}
                  busyIds={busyIds}
                  run={run}
                  onDecide={adminReviewSensitive}
                />
              )}
              {tab === 'published' && <PublishedPanel entries={entries} />}
              {tab === 'admins' && (
                <AdminsPanel me={username} notify={notify} />
              )}
              {tab === 'account' && (
                <AccountPanel
                  account={account}
                  notify={notify}
                  onChanged={reload}
                />
              )}
            </>
          )}
        </div>
      </div>

      <Toast toast={toast} onDone={clearToast} />
    </main>
  );
};

export default AdminDashboard;
