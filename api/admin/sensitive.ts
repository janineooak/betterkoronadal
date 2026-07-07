import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool, audit } from '../_lib/db';
import { requireAdmin, adminCount } from '../_lib/auth';

// POST /api/admin/sensitive  { id, action: 'publish'|'reject' }
// Second step of the two-person review for court cases / concerns. When more
// than one admin is configured, the publisher MUST differ from the first
// reviewer. Only after this does the item surface publicly.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = requireAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized.' });
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed.' });

  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Backend not configured.' });

  const { id, action } = (req.body ?? {}) as Record<string, string>;
  if (!id || (action !== 'publish' && action !== 'reject'))
    return res.status(400).json({ error: 'Invalid request.' });

  const { rows } = await pool.query(
    'select * from sensitive_items where id = $1',
    [id]
  );
  const item = rows[0];
  if (!item) return res.status(404).json({ error: 'Item not found.' });
  if (item.state !== 'pending_second')
    return res.status(409).json({ error: 'Already resolved.' });

  if (action === 'reject') {
    await pool.query(
      "update sensitive_items set state='rejected', second_reviewer=$2, second_at=now() where id=$1",
      [id, admin.u]
    );
    await audit(admin.u, 'sensitive.reject', { id });
    return res.json({ ok: true, state: 'rejected' });
  }

  // publish — enforce two distinct reviewers when more than one admin exists
  if (adminCount() > 1 && item.first_reviewer === admin.u) {
    return res.status(403).json({
      error:
        'A different admin must publish this item (two-person review for court cases and concerns).',
    });
  }
  await pool.query(
    "update sensitive_items set state='approved', second_reviewer=$2, second_at=now() where id=$1",
    [id, admin.u]
  );
  await audit(admin.u, 'sensitive.publish', { id });
  return res.json({ ok: true, state: 'approved' });
}
