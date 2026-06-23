import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool, audit } from '../_lib/db';
import { requireAdmin } from '../_lib/auth';

// POST /api/admin/review  { submissionId, action: 'approve'|'reject', reviewNote? }
// Approving a NON-sensitive submission publishes it immediately (merges into the
// live registry). Approving a court-case/concern submission creates a sensitive
// item in `pending_second` — it needs a second admin to publish (two-step).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = requireAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized.' });
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed.' });

  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Backend not configured.' });

  const { submissionId, action, reviewNote } = (req.body ?? {}) as Record<
    string,
    string
  >;
  if (!submissionId || (action !== 'approve' && action !== 'reject'))
    return res.status(400).json({ error: 'Invalid request.' });

  const { rows } = await pool.query('select * from submissions where id = $1', [
    submissionId,
  ]);
  const sub = rows[0];
  if (!sub) return res.status(404).json({ error: 'Submission not found.' });
  if (sub.status !== 'pending')
    return res.status(409).json({ error: 'Already reviewed.' });

  if (action === 'reject') {
    await pool.query(
      "update submissions set status='rejected', reviewed_at=now(), reviewed_by=$2, review_note=$3 where id=$1",
      [submissionId, admin.u, reviewNote || null]
    );
    await audit(admin.u, 'submission.reject', { submissionId });
    return res.json({ ok: true, status: 'rejected' });
  }

  // approve
  const payload = sub.payload || {};
  if (sub.kind === 'court_case' || sub.kind === 'concern') {
    await pool.query(
      `insert into sensitive_items (person_id, kind, data, state, first_reviewer, first_at)
       values ($1,$2,$3,'pending_second',$4, now())`,
      [
        sub.person_id || payload.personId || null,
        sub.kind,
        JSON.stringify(payload.item ?? payload),
        admin.u,
      ]
    );
    await audit(admin.u, 'submission.approve.sensitive', { submissionId });
  } else {
    // new_person / edit / correction / other -> publish entry (non-sensitive)
    const personId = sub.person_id || payload.personId;
    if (!personId)
      return res
        .status(400)
        .json({ error: 'Submission has no target person id.' });
    await pool.query(
      `insert into published_entries (person_id, name, data, updated_at, updated_by)
       values ($1,$2,$3, now(), $4)
       on conflict (person_id) do update
         set name = excluded.name,
             data = published_entries.data || excluded.data,
             updated_at = now(), updated_by = excluded.updated_by`,
      [
        personId,
        sub.person_name,
        JSON.stringify(payload.data ?? payload),
        admin.u,
      ]
    );
    await audit(admin.u, 'submission.approve.publish', { submissionId });
  }

  await pool.query(
    "update submissions set status='approved', reviewed_at=now(), reviewed_by=$2, review_note=$3 where id=$1",
    [submissionId, admin.u, reviewNote || null]
  );
  return res.json({ ok: true, status: 'approved' });
}
