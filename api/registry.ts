import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool } from './_lib/db';

// GET /api/registry — public. Returns admin-published additions/edits plus
// APPROVED sensitive items (court cases / concerns). The client merges these
// over the static, code-curated registry. Returns empty arrays (200) when the
// backend is not configured, so the site stays fully functional without a DB.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed.' });

  const pool = getPool();
  if (!pool) return res.json({ entries: [], sensitive: [] });

  try {
    const [entries, sensitive] = await Promise.all([
      pool.query('select person_id, name, data from published_entries'),
      pool.query(
        "select person_id, kind, data from sensitive_items where state = 'approved'"
      ),
    ]);
    // Cache at the edge for a minute; this is public, low-churn data.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.json({ entries: entries.rows, sensitive: sensitive.rows });
  } catch {
    return res.json({ entries: [], sensitive: [] });
  }
}
