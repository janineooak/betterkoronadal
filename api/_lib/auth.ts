import crypto from 'node:crypto';
import type { VercelRequest } from '@vercel/node';

// Minimal stateless admin auth: HMAC-signed token, no external auth service.
// Admins are configured via env: ADMIN_USERS="alice:pass1,bob:pass2".
// Two distinct admins enable enforced two-person review of sensitive items.

const SECRET = process.env.ADMIN_SECRET || '';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function admins(): Record<string, string> {
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

export function adminCount(): number {
  return Object.keys(admins()).length;
}

export function isConfigured(): boolean {
  return !!SECRET && adminCount() > 0;
}

export function verifyCredentials(username: string, password: string): boolean {
  const m = admins();
  const stored = m[username];
  if (!username || stored === undefined) return false;
  // Constant-time compare so a wrong password can't be timed character by
  // character. (Passwords are still plaintext in ADMIN_USERS — hashing them is
  // a separate, breaking change.)
  const a = Buffer.from(stored);
  const b = Buffer.from(password ?? '');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function b64url(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function sign(username: string): string {
  const payload = b64url(
    Buffer.from(JSON.stringify({ u: username, exp: Date.now() + TOKEN_TTL_MS }))
  );
  const sig = b64url(
    crypto.createHmac('sha256', SECRET).update(payload).digest()
  );
  return `${payload}.${sig}`;
}

export function verify(token?: string): { u: string } | null {
  if (!token || !SECRET) return null;
  const [p, s] = token.split('.');
  if (!p || !s) return null;
  const expected = b64url(
    crypto.createHmac('sha256', SECRET).update(p).digest()
  );
  if (
    s.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    const data = JSON.parse(
      Buffer.from(p.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    );
    if (!data.u || typeof data.exp !== 'number' || data.exp < Date.now())
      return null;
    return { u: data.u };
  } catch {
    return null;
  }
}

export function requireAdmin(req: VercelRequest): { u: string } | null {
  const h = req.headers['authorization'];
  const raw = (Array.isArray(h) ? h[0] : h) || '';
  return verify(raw.replace(/^Bearer\s+/i, ''));
}
