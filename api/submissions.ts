import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool, audit } from './_lib/db';
import { requireAdmin } from './_lib/auth';

const KINDS = [
  'new_person',
  'edit',
  'court_case',
  'concern',
  'correction',
  'other',
];

// POST  /api/submissions          — public: file a contribution (moderated)
// GET   /api/submissions          — admin: list submissions
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pool = getPool();
  if (!pool)
    return res.status(503).json({ error: 'Backend is not configured.' });

  if (req.method === 'POST') {
    const {
      kind,
      personId,
      personName,
      payload,
      submitterName,
      submitterEmail,
      note,
    } = (req.body ?? {}) as Record<string, unknown>;

    if (typeof kind !== 'string' || !KINDS.includes(kind))
      return res.status(400).json({ error: 'Invalid kind.' });
    if (typeof personName !== 'string' || !personName.trim())
      return res.status(400).json({ error: 'A name is required.' });
    if (typeof note !== 'string' || note.trim().length < 10)
      return res
        .status(400)
        .json({ error: 'Please describe your contribution (min 10 chars).' });

    await pool.query(
      `insert into submissions
        (kind, person_id, person_name, payload, submitter_name, submitter_email, note)
       values ($1,$2,$3,$4,$5,$6,$7)`,
      [
        kind,
        (personId as string) || null,
        (personName as string).trim(),
        JSON.stringify(payload ?? {}),
        (submitterName as string) || null,
        (submitterEmail as string) || null,
        (note as string).trim(),
      ]
    );
    await audit(null, 'submission.create', { kind, personName });
    return res.status(201).json({ ok: true });
  }

  if (req.method === 'GET') {
    if (!requireAdmin(req))
      return res.status(401).json({ error: 'Unauthorized.' });
    const status = (req.query.status as string) || null;
    const { rows } = await pool.query(
      status
        ? 'select * from submissions where status = $1 order by created_at desc limit 500'
        : 'select * from submissions order by created_at desc limit 500',
      status ? [status] : []
    );
    return res.json({ submissions: rows });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
