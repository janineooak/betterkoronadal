import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool, audit } from '../_lib/db';
import { requireAdmin, envAdmins, adminCount } from '../_lib/auth';
import { sendEmail, emailHtml } from '../_lib/mail';

// Admin account management.
//   GET   /api/admin/users                          -> { users }
//   POST  /api/admin/users  { username, email }     -> invite (no password; they sign in with an email code)
//   PATCH /api/admin/users  { username, disabled }  -> enable / disable
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = await requireAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized.' });
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Backend not configured.' });

  if (req.method === 'GET') {
    const { rows } = await pool.query(
      `select username, email, created_at, created_by, last_login_at, disabled,
              password_hash is not null as has_password
         from admin_users order by created_at`
    );
    const inDb = new Set(rows.map((r: { username: string }) => r.username));
    const envOnly = Object.keys(envAdmins())
      .filter(u => !inDb.has(u))
      .map(u => ({
        username: u,
        email: null,
        created_at: null,
        created_by: null,
        last_login_at: null,
        disabled: false,
        has_password: true,
        source: 'env',
      }));
    return res.json({
      users: [...rows.map(r => ({ ...r, source: 'database' })), ...envOnly],
    });
  }

  if (req.method === 'POST') {
    const { username, email } = (req.body ?? {}) as Record<string, string>;
    const u = (username ?? '').trim();
    const e = (email ?? '').trim().toLowerCase();
    if (!/^[a-z0-9._-]{2,32}$/i.test(u))
      return res.status(400).json({
        error: 'Username: 2–32 letters, numbers, dots, dashes or underscores.',
      });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      return res.status(400).json({ error: 'Enter a valid email address.' });

    try {
      await pool.query(
        `insert into admin_users (username, email, created_by) values ($1, $2, $3)`,
        [u, e, admin.u]
      );
    } catch (ex) {
      if ((ex as { code?: string }).code === '23505')
        return res
          .status(409)
          .json({ error: 'That username or email is already an admin.' });
      throw ex;
    }
    await audit(admin.u, 'admin.user.create', { username: u, email: e });

    const origin =
      (req.headers['x-forwarded-proto'] ? 'https://' : 'http://') +
      (req.headers['x-forwarded-host'] || req.headers.host || '');
    const lines = [
      `${admin.u} added you as a Bantay Opisyal admin (username: ${u}).`,
      `To sign in, open ${origin}/admin, choose "Email code" and enter this address. You can set a password afterwards under Account.`,
    ];
    let emailed = true;
    try {
      await sendEmail({
        to: e,
        subject: "You've been added as a Bantay Opisyal admin",
        text: lines.join('\n\n'),
        html: emailHtml('Welcome to the admin team', lines),
      });
    } catch (ex) {
      console.error('[admin/users] invite email failed', ex);
      emailed = false;
    }
    return res.status(201).json({ ok: true, emailed });
  }

  if (req.method === 'PATCH') {
    const { username, disabled } = (req.body ?? {}) as {
      username?: string;
      disabled?: boolean;
    };
    if (!username || typeof disabled !== 'boolean')
      return res.status(400).json({ error: 'Invalid request.' });
    if (disabled && username === admin.u)
      return res.status(400).json({ error: "You can't disable yourself." });
    if (disabled && (await adminCount()) <= 1)
      return res
        .status(400)
        .json({ error: "Can't disable the last active admin." });

    const r = await pool.query(
      'update admin_users set disabled = $2 where username = $1',
      [username, disabled]
    );
    if (r.rowCount !== 1)
      return res.status(404).json({
        error:
          'Only database accounts can be disabled. Remove env admins from ADMIN_USERS.',
      });
    await audit(
      admin.u,
      disabled ? 'admin.user.disable' : 'admin.user.enable',
      {
        username,
      }
    );
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
