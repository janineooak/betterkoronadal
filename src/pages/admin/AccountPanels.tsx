import { useCallback, useEffect, useState } from 'react';
import { Loader2, Mail, UserPlus } from 'lucide-react';
import {
  adminChangePassword,
  adminInviteUser,
  adminListUsers,
  adminSetUserDisabled,
  type AdminAccount,
  type AdminUser,
} from '../../lib/registryApi';
import { cn } from '../../lib/utils';
import { Button, Notice } from './ui';
import { errMsg, field, timeAgo } from './helpers';

type Notify = (tone: 'success' | 'error', text: string) => void;

/* -------------------------------------------------------------------------- */
/* Admins                                                                      */
/* -------------------------------------------------------------------------- */

export function AdminsPanel({
  me,
  notify,
}: {
  me: string | null;
  notify: Notify;
}) {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setUsers(await adminListUsers());
      setLoadErr(null);
    } catch (ex) {
      setLoadErr(errMsg(ex));
    }
  }, []);

  useEffect(() => {
    let active = true;
    adminListUsers()
      .then(u => active && setUsers(u))
      .catch(ex => active && setLoadErr(errMsg(ex)));
    return () => {
      active = false;
    };
  }, []);

  const toggle = async (u: AdminUser) => {
    setBusy(u.username);
    try {
      await adminSetUserDisabled(u.username, !u.disabled);
      notify(
        'success',
        `${u.username} ${u.disabled ? 're-enabled' : 'disabled'}.`
      );
      await refresh();
    } catch (ex) {
      notify('error', errMsg(ex));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loadErr ? (
          <Notice tone="error" className="m-4">
            {loadErr}
          </Notice>
        ) : !users ? (
          <p className="flex items-center gap-2 p-6 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading admins…
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {users.map(u => (
              <li
                key={u.username}
                className={cn(
                  'flex flex-wrap items-center gap-3 px-4 py-3',
                  u.disabled && 'opacity-60'
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold uppercase text-primary-700">
                  {u.username.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-gray-900">
                    {u.username}
                    {u.username === me && (
                      <span className="rounded bg-gray-100 px-1.5 text-[11px] text-gray-600">
                        you
                      </span>
                    )}
                    {u.source === 'env' && (
                      <span
                        className="rounded bg-gray-100 px-1.5 text-[11px] text-gray-600"
                        title="Defined in the ADMIN_USERS env var. Add it here with an email to enable codes and resets."
                      >
                        env
                      </span>
                    )}
                    {u.disabled && (
                      <span className="rounded bg-red-50 px-1.5 text-[11px] text-red-700">
                        disabled
                      </span>
                    )}
                    {u.source === 'database' && !u.has_password && (
                      <span className="rounded bg-amber-50 px-1.5 text-[11px] text-amber-700">
                        code sign-in only
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {u.email ?? 'no email'} · last sign-in{' '}
                    {u.last_login_at ? timeAgo(u.last_login_at) : 'never'}
                  </p>
                </div>
                {u.source === 'database' && u.username !== me && (
                  <Button
                    size="sm"
                    variant={u.disabled ? 'secondary' : 'ghost'}
                    busy={busy === u.username}
                    onClick={() => toggle(u)}
                  >
                    {u.disabled ? 'Enable' : 'Disable'}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <InviteForm notify={notify} onInvited={refresh} />
    </div>
  );
}

function InviteForm({
  notify,
  onInvited,
}: {
  notify: Notify;
  onInvited: () => void;
}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="h-fit space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      onSubmit={async e => {
        e.preventDefault();
        setBusy(true);
        try {
          const r = await adminInviteUser(username.trim(), email.trim());
          notify(
            r.emailed ? 'success' : 'error',
            r.emailed
              ? `Added ${username}. They've been emailed sign-in instructions.`
              : `Added ${username}, but the invite email failed. Tell them to sign in at /admin with "Email code".`
          );
          setUsername('');
          setEmail('');
          onInvited();
        } catch (ex) {
          notify('error', errMsg(ex));
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <UserPlus className="h-4 w-4 text-primary-600" /> Add an admin
      </p>
      <p className="text-xs text-gray-500">
        They sign in with an emailed code, then can set a password. To move an
        env admin over, add them with the same username.
      </p>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        autoComplete="off"
        className={field}
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="off"
        className={field}
      />
      <Button
        busy={busy}
        disabled={!username.trim() || !email.includes('@')}
        icon={<Mail className="h-4 w-4" />}
        className="w-full"
      >
        Add & send invite
      </Button>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Account                                                                     */
/* -------------------------------------------------------------------------- */

export function AccountPanel({
  account,
  notify,
  onChanged,
}: {
  account: AdminAccount | null;
  notify: Notify;
  onChanged: () => void;
}) {
  const [current, setCurrent] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);

  if (!account)
    return (
      <p className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading account…
      </p>
    );

  const isEnv = account.source === 'env';
  const tooShort = pw.length > 0 && pw.length < 10;
  const mismatch = pw2.length > 0 && pw !== pw2;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">Profile</p>
        <dl className="mt-3 grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
          <dt className="text-gray-500">Username</dt>
          <dd className="text-gray-900">{account.username}</dd>
          <dt className="text-gray-500">Email</dt>
          <dd className="text-gray-900">{account.email ?? '—'}</dd>
          <dt className="text-gray-500">Sign-in</dt>
          <dd className="text-gray-900">
            {[
              account.hasPassword && 'password',
              account.email && account.emailEnabled && 'email code',
            ]
              .filter(Boolean)
              .join(' + ') || '—'}
          </dd>
          <dt className="text-gray-500">Source</dt>
          <dd className="text-gray-900">
            {isEnv ? 'ADMIN_USERS env var' : 'Database'}
          </dd>
        </dl>
        {isEnv && (
          <Notice tone="info" className="mt-4">
            Your account comes from the <code>ADMIN_USERS</code> env var, so it
            can't use email codes or password resets. Add yourself under{' '}
            <strong>Admins</strong> with the same username and your email to
            switch over.
          </Notice>
        )}
      </div>

      {!isEnv && (
        <form
          className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          onSubmit={async e => {
            e.preventDefault();
            setBusy(true);
            try {
              await adminChangePassword(pw, current || undefined);
              notify(
                'success',
                'Password updated. Other sessions have been signed out.'
              );
              setCurrent('');
              setPw('');
              setPw2('');
              onChanged();
            } catch (ex) {
              notify('error', errMsg(ex));
            } finally {
              setBusy(false);
            }
          }}
        >
          <p className="text-sm font-semibold text-gray-900">
            {account.hasPassword ? 'Change password' : 'Set a password'}
          </p>
          {!account.hasPassword && (
            <p className="text-xs text-gray-500">
              You currently sign in with email codes only. A password lets you
              sign in without email.
            </p>
          )}
          {account.hasPassword && (
            <input
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              placeholder="Current password"
              className={field}
            />
          )}
          <input
            type="password"
            autoComplete="new-password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="New password (10+ characters)"
            className={field}
          />
          {tooShort && (
            <p className="text-xs text-red-600">Use at least 10 characters.</p>
          )}
          <input
            type="password"
            autoComplete="new-password"
            value={pw2}
            onChange={e => setPw2(e.target.value)}
            placeholder="Confirm new password"
            className={field}
          />
          {mismatch && (
            <p className="text-xs text-red-600">Passwords don't match.</p>
          )}
          <Button
            busy={busy}
            disabled={
              pw.length < 10 || pw !== pw2 || (account.hasPassword && !current)
            }
          >
            {account.hasPassword ? 'Update password' : 'Set password'}
          </Button>
        </form>
      )}
    </div>
  );
}
