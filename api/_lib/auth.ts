import crypto from 'node:crypto';
import { promisify } from 'node:util';
import type { VercelRequest } from '@vercel/node';
import { getPool } from './db';

// Stateless admin auth: HMAC-signed tokens, no external auth service.
//
// Admin accounts live in the `admin_users` table (scrypt-hashed passwords +
// email, which enables sign-in codes and password resets). The legacy
// ADMIN_USERS env var ("alice:pass1,bob:pass2") still works as a bootstrap /
// fallback; a DB account with the same username takes precedence over it.

const SECRET = process.env.ADMIN_SECRET || '';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

const scrypt = promisify(crypto.scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

export interface DbAdmin {
  username: string;
  email: string;
  password_hash: string | null;
  sessions_valid_after: Date;
  created_at: Date;
  created_by: string | null;
  last_login_at: Date | null;
  disabled: boolean;
}

/* ----------------------------- env (legacy) ------------------------------ */

export function envAdmins(): Record<string, string> {
  const map: Record<string, string> = {};
  (process.env.ADMIN_USERS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(pair => {
      const i = pair.indexOf(':');
      if (i > 0) map[pair.slice(0, i)] = pair.slice(i + 1);
    });
  return map;
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/* ------------------------------- passwords ------------------------------- */

export const MIN_PASSWORD_LENGTH = 10;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export async function verifyPassword(
  password: string,
  stored: string | null
): Promise<boolean> {
  if (!stored) return false;
  const [scheme, saltB64, hashB64] = stored.split('$');
  if (scheme !== 'scrypt' || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, 'base64');
  const actual = await scrypt(
    password ?? '',
    Buffer.from(saltB64, 'base64'),
    expected.length
  );
  return crypto.timingSafeEqual(actual, expected);
}

/* --------------------------------- codes --------------------------------- */

export function newCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
}

export function hashCode(username: string, code: string): string {
  return crypto
    .createHmac('sha256', SECRET)
    .update(`${username}:${code}`)
    .digest('hex');
}

export { safeEqual };

/* -------------------------------- lookups -------------------------------- */

export function isConfigured(): boolean {
  return !!SECRET && (!!getPool() || Object.keys(envAdmins()).length > 0);
}

export async function findDbAdmin(identifier: string): Promise<DbAdmin | null> {
  const pool = getPool();
  if (!pool || !identifier) return null;
  try {
    const { rows } = await pool.query(
      'select * from admin_users where username = $1 or lower(email) = lower($1) limit 1',
      [identifier.trim()]
    );
    return (rows[0] as DbAdmin) ?? null;
  } catch {
    // Table may not exist yet (schema not migrated) — fall back to env.
    return null;
  }
}

/** Active admins across the DB and the env fallback (DB wins on name clash). */
export async function adminCount(): Promise<number> {
  const names = new Set(Object.keys(envAdmins()));
  const pool = getPool();
  if (pool) {
    try {
      const { rows } = await pool.query(
        'select username, disabled from admin_users'
      );
      for (const r of rows as { username: string; disabled: boolean }[]) {
        if (r.disabled) names.delete(r.username);
        else names.add(r.username);
      }
    } catch {
      // ignore — env only
    }
  }
  return names.size;
}

/**
 * Check a username/email + password. DB accounts are checked first; the env
 * list is only consulted when no DB account matches.
 */
export async function verifyCredentials(
  identifier: string,
  password: string
): Promise<string | null> {
  if (!identifier || !password) return null;
  const dbUser = await findDbAdmin(identifier);
  if (dbUser) {
    if (dbUser.disabled) return null;
    return (await verifyPassword(password, dbUser.password_hash))
      ? dbUser.username
      : null;
  }
  const stored = envAdmins()[identifier];
  if (stored === undefined) return null;
  return safeEqual(stored, password) ? identifier : null;
}

/* -------------------------------- tokens --------------------------------- */

function b64url(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Issue a token. Pass `issuedAt` to stamp it with the exact time that was
 * written to `sessions_valid_after`, so the cutoff and the new token share
 * one clock.
 */
export function sign(username: string, issuedAt = Date.now()): string {
  const now = issuedAt;
  const payload = b64url(
    Buffer.from(
      JSON.stringify({ u: username, iat: now, exp: now + TOKEN_TTL_MS })
    )
  );
  const sig = b64url(
    crypto.createHmac('sha256', SECRET).update(payload).digest()
  );
  return `${payload}.${sig}`;
}

function verifyToken(token?: string): { u: string; iat: number } | null {
  if (!token || !SECRET) return null;
  const [p, s] = token.split('.');
  if (!p || !s) return null;
  const expected = b64url(
    crypto.createHmac('sha256', SECRET).update(p).digest()
  );
  if (!safeEqual(s, expected)) return null;
  try {
    const data = JSON.parse(
      Buffer.from(p.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    );
    if (!data.u || typeof data.exp !== 'number' || data.exp < Date.now())
      return null;
    return { u: data.u, iat: typeof data.iat === 'number' ? data.iat : 0 };
  } catch {
    return null;
  }
}

/**
 * Verify the bearer token AND that the account is still active. Disabling an
 * admin or changing their password revokes their existing sessions.
 */
export async function requireAdmin(
  req: VercelRequest
): Promise<{ u: string } | null> {
  const h = req.headers['authorization'];
  const raw = (Array.isArray(h) ? h[0] : h) || '';
  const t = verifyToken(raw.replace(/^Bearer\s+/i, ''));
  if (!t) return null;

  const dbUser = await findDbAdmin(t.u);
  if (dbUser && dbUser.username === t.u) {
    if (dbUser.disabled) return null;
    // Password changes bump sessions_valid_after, revoking older tokens.
    if (t.iat < new Date(dbUser.sessions_valid_after).getTime()) return null;
    return { u: t.u };
  }
  return t.u in envAdmins() ? { u: t.u } : null;
}
