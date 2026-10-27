import { useState } from 'react';
import { ArrowLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import {
  adminLogin,
  adminResetPassword,
  adminSendCode,
  adminVerifyCode,
} from '../../lib/registryApi';
import { cn } from '../../lib/utils';
import { Button, Notice } from './ui';
import { errMsg, field, useCooldown } from './helpers';

type Mode = 'password' | 'code' | 'reset';
const MIN_PASSWORD = 10;

export default function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [mode, setMode] = useState<Mode>('password');
  // Shared between flows so switching modes keeps what was typed.
  const [email, setEmail] = useState('');

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          {mode === 'reset' ? 'Reset your password' : 'Bantay Opisyal admin'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {mode === 'reset'
            ? "We'll email you a code to set a new password."
            : 'Sign in to review contributions.'}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {mode !== 'reset' && (
          <div
            role="tablist"
            className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1"
          >
            {(
              [
                ['password', 'Password', KeyRound],
                ['code', 'Email code', Mail],
              ] as const
            ).map(([m, label, Icon]) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors',
                  mode === m
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        )}

        {mode === 'password' && (
          <PasswordForm
            onSignedIn={onSignedIn}
            onForgot={() => setMode('reset')}
          />
        )}
        {mode === 'code' && (
          <CodeFlow
            purpose="login"
            email={email}
            setEmail={setEmail}
            onSignedIn={onSignedIn}
          />
        )}
        {mode === 'reset' && (
          <>
            <CodeFlow
              purpose="reset"
              email={email}
              setEmail={setEmail}
              onSignedIn={onSignedIn}
            />
            <button
              onClick={() => setMode('password')}
              className="mt-5 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </button>
          </>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        Restricted area. Sign-ins are recorded in the audit log.
      </p>
    </div>
  );
}

function PasswordForm({
  onSignedIn,
  onForgot,
}: {
  onSignedIn: () => void;
  onForgot: () => void;
}) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async e => {
        e.preventDefault();
        setBusy(true);
        setErr(null);
        try {
          await adminLogin(id.trim(), pw);
          onSignedIn();
        } catch (ex) {
          setErr(errMsg(ex, 'Sign-in failed.'));
          setBusy(false);
        }
      }}
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">
          Username or email
        </span>
        <input
          autoFocus
          autoComplete="username"
          value={id}
          onChange={e => setId(e.target.value)}
          className={field}
        />
      </label>
      <label className="block">
        <span className="mb-1 flex items-center justify-between text-sm font-medium text-gray-700">
          Password
          <button
            type="button"
            onClick={onForgot}
            className="text-xs font-medium text-primary-600 hover:text-primary-700"
          >
            Forgot password?
          </button>
        </span>
        <input
          type="password"
          autoComplete="current-password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          className={field}
        />
      </label>
      {err && <Notice tone="error">{err}</Notice>}
      <Button busy={busy} disabled={!id || !pw} className="w-full">
        {busy ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}

function CodeFlow({
  purpose,
  email,
  setEmail,
  onSignedIn,
}: {
  purpose: 'login' | 'reset';
  email: string;
  setEmail: (v: string) => void;
  onSignedIn: () => void;
}) {
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [code, setCode] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const cooldown = useCooldown(30);

  const send = async () => {
    setBusy(true);
    setErr(null);
    try {
      const r = await adminSendCode(email.trim(), purpose);
      setInfo(r.message);
      setStep('verify');
      setCode('');
      cooldown.start();
    } catch (ex) {
      setErr(errMsg(ex));
    } finally {
      setBusy(false);
    }
  };

  if (step === 'email') {
    return (
      <form
        className="space-y-4"
        onSubmit={e => {
          e.preventDefault();
          send();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Admin email
          </span>
          <input
            autoFocus
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={field}
          />
        </label>
        {err && <Notice tone="error">{err}</Notice>}
        <Button busy={busy} disabled={!email.includes('@')} className="w-full">
          {purpose === 'reset' ? 'Send reset code' : 'Email me a code'}
        </Button>
      </form>
    );
  }

  const pwTooShort = purpose === 'reset' && pw.length < MIN_PASSWORD;
  const pwMismatch = purpose === 'reset' && pw !== pw2;

  return (
    <form
      className="space-y-4"
      onSubmit={async e => {
        e.preventDefault();
        setBusy(true);
        setErr(null);
        try {
          if (purpose === 'reset')
            await adminResetPassword(email.trim(), code, pw);
          else await adminVerifyCode(email.trim(), code);
          onSignedIn();
        } catch (ex) {
          setErr(errMsg(ex));
          setBusy(false);
        }
      }}
    >
      {info && <Notice tone="info">{info}</Notice>}
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">
          6-digit code
        </span>
        <input
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className={cn(
            field,
            'text-center font-mono text-2xl tracking-[0.5em] placeholder:tracking-[0.5em]'
          )}
        />
      </label>

      {purpose === 'reset' && (
        <>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              New password
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              className={field}
            />
            <span
              className={cn(
                'mt-1 block text-xs',
                pw && pwTooShort ? 'text-red-600' : 'text-gray-400'
              )}
            >
              At least {MIN_PASSWORD} characters.
            </span>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Confirm new password
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={pw2}
              onChange={e => setPw2(e.target.value)}
              className={field}
            />
            {pw2 && pwMismatch && (
              <span className="mt-1 block text-xs text-red-600">
                Passwords don't match.
              </span>
            )}
          </label>
        </>
      )}

      {err && <Notice tone="error">{err}</Notice>}
      <Button
        busy={busy}
        disabled={code.length !== 6 || pwTooShort || pwMismatch}
        className="w-full"
      >
        {purpose === 'reset' ? 'Set password & sign in' : 'Verify & sign in'}
      </Button>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <button
          type="button"
          onClick={() => {
            setStep('email');
            setErr(null);
            setInfo(null);
          }}
          className="hover:text-gray-900"
        >
          Use a different email
        </button>
        <button
          type="button"
          disabled={cooldown.left > 0 || busy}
          onClick={send}
          className="font-medium text-primary-600 hover:text-primary-700 disabled:text-gray-400"
        >
          {cooldown.left > 0 ? `Resend in ${cooldown.left}s` : 'Resend code'}
        </button>
      </div>
    </form>
  );
}
