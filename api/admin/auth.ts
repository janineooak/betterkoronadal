import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  isConfigured,
  verifyCredentials,
  sign,
  findDbAdmin,
  hashPassword,
  verifyPassword,
  newCode,
  hashCode,
  safeEqual,
  requireAdmin,
  envAdmins,
  MIN_PASSWORD_LENGTH,
} from '../_lib/auth';
import { getPool, audit } from '../_lib/db';
import { sendEmail, emailConfigured, emailHtml } from '../_lib/mail';

// POST /api/admin/auth  { action, ... }
//   login            { identifier, password }          -> { token, username }
//   send-code        { email, purpose: login|reset }   -> { ok }  (never reveals if the email exists)
//   verify-code      { email, code }                   -> { token, username }
//   reset-password   { email, code, newPassword }      -> { token, username }
//   change-password  { currentPassword?, newPassword } (auth) -> { token }
//   me               (auth)                            -> account info
//
// All auth actions share one function to stay within serverless limits.

const CODE_TTL_MIN = 10;
const MAX_CODE_ATTEMPTS = 5;
const MAX_CODES_PER_WINDOW = 3; // per account per 15 min
const MAX_LOGIN_FAILS = 8; // per identifier per 15 min

type Body = Record<string, string | undefined>;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed.' });
  if (!isConfigured())
    return res.status(503).json({ error: 'Admin auth is not configured.' });

  const body = (req.body ?? {}) as Body;
  try {
    switch (body.action) {
      case 'login':
        return await login(body, res);
      case 'send-code':
        return await sendCode(body, res);
      case 'verify-code':
        return await verifyCode(body, res, 'login');
      case 'reset-password':
        return await verifyCode(body, res, 'reset');
      case 'change-password':
        return await changePassword(req, body, res);
      case 'me':
        return await me(req, res);
      default:
        return res.status(400).json({ error: 'Unknown action.' });
    }
  } catch (ex) {
    console.error('[admin/auth]', ex);
    return res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
}

/* -------------------------------------------------------------------------- */

async function recentLoginFails(identifier: string): Promise<number> {
  const pool = getPool();
  if (!pool) return 0;
  try {
    const { rows } = await pool.query(
      `select count(*)::int as n from audit_log
        where action = 'admin.login.fail' and detail->>'id' = $1
          and at > now() - interval '15 minutes'`,
      [identifier.toLowerCase()]
    );
    return rows[0]?.n ?? 0;
  } catch {
    return 0;
  }
}

async function markLogin(username: string) {
  const pool = getPool();
  if (!pool) return;
  await pool
    .query('update admin_users set last_login_at = now() where username = $1', [
      username,
    ])
    .catch(() => {});
}

async function login(body: Body, res: VercelResponse) {
  const identifier = (body.identifier ?? body.username ?? '').trim();
  const password = body.password ?? '';
  if (!identifier || !password)
    return res.status(400).json({ error: 'Enter your username and password.' });

  if ((await recentLoginFails(identifier)) >= MAX_LOGIN_FAILS)
    return res.status(429).json({
      error:
        'Too many failed attempts. Wait 15 minutes or sign in with an email code.',
    });

  const username = await verifyCredentials(identifier, password);
  if (!username) {
    await audit(null, 'admin.login.fail', { id: identifier.toLowerCase() });
    return res.status(401).json({ error: 'Incorrect username or password.' });
  }
  await markLogin(username);
  await audit(username, 'admin.login', { method: 'password' });
  return res.json({ token: sign(username), username });
}

async function sendCode(body: Body, res: VercelResponse) {
  const email = (body.email ?? '').trim().toLowerCase();
  const purpose = body.purpose === 'reset' ? 'reset' : 'login';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Enter a valid email address.' });

  const pool = getPool();
  if (!pool)
    return res
      .status(503)
      .json({ error: 'Email sign-in needs the database backend.' });
  if (!emailConfigured())
    return res
      .status(503)
      .json({ error: 'Email delivery is not configured on this site.' });

  // Same response whether or not the account exists, so this can't be used
  // to discover admin emails.
  const ok = () =>
    res.json({
      ok: true,
      message: `If ${email} belongs to an admin, a code is on its way.`,
    });

  const user = await findDbAdmin(email);
  if (!user || user.disabled || user.email.toLowerCase() !== email) {
    await audit(null, 'admin.code.unknown', { email, purpose });
    return ok();
  }

  const { rows } = await pool.query(
    `select count(*)::int as n from admin_codes
      where username = $1 and created_at > now() - interval '15 minutes'`,
    [user.username]
  );
  if ((rows[0]?.n ?? 0) >= MAX_CODES_PER_WINDOW) {
    await audit(user.username, 'admin.code.throttled', { purpose });
    return ok();
  }

  // Invalidate earlier unused codes for this purpose.
  await pool.query(
    `update admin_codes set used_at = now()
      where username = $1 and purpose = $2 and used_at is null`,
    [user.username, purpose]
  );

  const code = newCode();
  await pool.query(
    `insert into admin_codes (username, purpose, code_hash, expires_at)
     values ($1, $2, $3, now() + ($4 || ' minutes')::interval)`,
    [
      user.username,
      purpose,
      hashCode(user.username, code),
      String(CODE_TTL_MIN),
    ]
  );

  const isReset = purpose === 'reset';
  const heading = isReset ? 'Reset your password' : 'Your sign-in code';
  const lines = [
    isReset
      ? `Use this code to set a new password for ${user.username}.`
      : `Use this code to sign in as ${user.username}.`,
    `It expires in ${CODE_TTL_MIN} minutes and works once.`,
    "If you didn't request this, you can ignore this email.",
  ];
  await sendEmail({
    to: user.email,
    subject: `${code} is your Bantay Opisyal ${isReset ? 'reset' : 'sign-in'} code`,
    text: `${heading}\n\n${code}\n\n${lines.join('\n')}`,
    html: emailHtml(heading, lines, code),
  });
  await audit(user.username, 'admin.code.sent', { purpose });
  return ok();
}

async function verifyCode(
  body: Body,
  res: VercelResponse,
  purpose: 'login' | 'reset'
) {
  const email = (body.email ?? '').trim().toLowerCase();
  const code = (body.code ?? '').replace(/\D/g, '');
  const pool = getPool();
  if (!pool)
    return res.status(503).json({ error: 'Backend is not configured.' });
  if (!email || code.length !== 6)
    return res.status(400).json({ error: 'Enter the 6-digit code.' });

  let newHash: string | null = null;
  if (purpose === 'reset') {
    const pw = body.newPassword ?? '';
    if (pw.length < MIN_PASSWORD_LENGTH)
      return res.status(400).json({
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    newHash = await hashPassword(pw);
  }

  const invalid = () =>
    res.status(401).json({ error: 'That code is invalid or has expired.' });

  const user = await findDbAdmin(email);
  if (!user || user.disabled || user.email.toLowerCase() !== email)
    return invalid();

  const { rows } = await pool.query(
    `select id, code_hash, attempts from admin_codes
      where username = $1 and purpose = $2 and used_at is null
        and expires_at > now()
      order by created_at desc limit 1`,
    [user.username, purpose]
  );
  const row = rows[0] as
    { id: string; code_hash: string; attempts: number } | undefined;
  if (!row || row.attempts >= MAX_CODE_ATTEMPTS) return invalid();

  if (!safeEqual(row.code_hash, hashCode(user.username, code))) {
    await pool.query(
      'update admin_codes set attempts = attempts + 1 where id = $1',
      [row.id]
    );
    await audit(user.username, 'admin.code.fail', { purpose });
    return invalid();
  }

  // Single use: only proceed if we were the one to mark it used.
  const used = await pool.query(
    'update admin_codes set used_at = now() where id = $1 and used_at is null',
    [row.id]
  );
  if (used.rowCount !== 1) return invalid();

  const issuedAt = Date.now();
  if (newHash) {
    // Revoke every session issued before this reset.
    await pool.query(
      `update admin_users set password_hash = $2, sessions_valid_after = $3
        where username = $1`,
      [user.username, newHash, new Date(issuedAt)]
    );
    await audit(user.username, 'admin.password.reset', {});
  }
  await markLogin(user.username);
  await audit(user.username, 'admin.login', { method: `code:${purpose}` });
  return res.json({
    token: sign(user.username, issuedAt),
    username: user.username,
  });
}

async function changePassword(
  req: VercelRequest,
  body: Body,
  res: VercelResponse
) {
  const admin = await requireAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized.' });
  const pool = getPool();
  const user = await findDbAdmin(admin.u);
  if (!pool || !user || user.username !== admin.u)
    return res.status(400).json({
      error:
        'This account is set in ADMIN_USERS. Add it under Admins with an email first.',
    });

  const pw = body.newPassword ?? '';
  if (pw.length < MIN_PASSWORD_LENGTH)
    return res.status(400).json({
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
  if (
    user.password_hash &&
    !(await verifyPassword(body.currentPassword ?? '', user.password_hash))
  )
    return res.status(401).json({ error: 'Current password is incorrect.' });

  const hash = await hashPassword(pw);
  const issuedAt = Date.now();
  await pool.query(
    `update admin_users set password_hash = $2, sessions_valid_after = $3
      where username = $1`,
    [admin.u, hash, new Date(issuedAt)]
  );
  await audit(admin.u, 'admin.password.change', {});
  // Old tokens are now revoked; hand back a fresh one.
  return res.json({ ok: true, token: sign(admin.u, issuedAt) });
}

async function me(req: VercelRequest, res: VercelResponse) {
  const admin = await requireAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized.' });
  const user = await findDbAdmin(admin.u);
  const inDb = !!user && user.username === admin.u;
  return res.json({
    username: admin.u,
    email: inDb ? user!.email : null,
    hasPassword: inDb ? !!user!.password_hash : admin.u in envAdmins(),
    source: inDb ? 'database' : 'env',
    lastLoginAt: inDb ? user!.last_login_at : null,
    emailEnabled: emailConfigured() && !!getPool(),
  });
}
