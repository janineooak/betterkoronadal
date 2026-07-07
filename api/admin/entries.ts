import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool, audit } from '../_lib/db';
import { requireAdmin } from '../_lib/auth';

// Admin-curated live edits (hybrid model).
//   GET  /api/admin/entries  -> { entries, sensitive }  (all, for the dashboard)
//   PUT  /api/admin/entries  { personId, name, data }   -> upsert NON-sensitive entry (live)
//   POST /api/admin/entries  { personId, kind, data }    -> add court_case/concern (two-step)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = requireAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized.' });
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Backend not configured.' });

  if (req.method === 'GET') {
    const [entries, sensitive] = await Promise.all([
      pool.query('select * from published_entries order by name'),
      pool.query('select * from sensitive_items order by created_at desc'),
    ]);
    return res.json({ entries: entries.rows, sensitive: sensitive.rows });
  }

  if (req.method === 'PUT') {
    const { personId, name, data } = (req.body ?? {}) as Record<
      string,
      unknown
    >;
    if (typeof personId !== 'string' || typeof name !== 'string')
      return res.status(400).json({ error: 'personId and name are required.' });
    await pool.query(
      `insert into published_entries (person_id, name, data, updated_at, updated_by)
       values ($1,$2,$3, now(), $4)
       on conflict (person_id) do update
         set name = excluded.name, data = excluded.data,
             updated_at = now(), updated_by = excluded.updated_by`,
      [personId, name, JSON.stringify(data ?? {}), admin.u]
    );
    await audit(admin.u, 'entry.upsert', { personId });
    return res.json({ ok: true });
  }

  if (req.method === 'POST') {
    const { personId, kind, data } = (req.body ?? {}) as Record<
      string,
      unknown
    >;
    if (
      typeof personId !== 'string' ||
      (kind !== 'court_case' && kind !== 'concern')
    )
      return res.status(400).json({ error: 'Invalid sensitive item.' });
    await pool.query(
      `insert into sensitive_items (person_id, kind, data, state, first_reviewer, first_at)
       values ($1,$2,$3,'pending_second',$4, now())`,
      [personId, kind, JSON.stringify(data ?? {}), admin.u]
    );
    await audit(admin.u, 'sensitive.create', { personId, kind });
    return res
      .status(201)
      .json({ ok: true, note: 'Needs a second admin to publish.' });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
