import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isConfigured, verifyCredentials, sign } from '../_lib/auth';
import { audit } from '../_lib/db';

// POST /api/admin/login  { username, password } -> { token, username }
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed.' });
  if (!isConfigured())
    return res.status(503).json({ error: 'Admin auth is not configured.' });

  const { username, password } = (req.body ?? {}) as Record<string, string>;
  if (!verifyCredentials(username, password)) {
    await audit(username || null, 'admin.login.fail', {});
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  await audit(username, 'admin.login', {});
  return res.json({ token: sign(username), username });
}
