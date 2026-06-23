import { Pool } from 'pg';

// Lazily-created singleton pool. Returns null when no DATABASE_URL is set, so
// every endpoint can degrade gracefully (respond 503) instead of crashing —
// and the static site keeps working with no backend configured.
let pool: Pool | null = null;

export function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Railway/most hosted PG require SSL; set PGSSL=disable for local.
      ssl:
        process.env.PGSSL === 'disable' ? false : { rejectUnauthorized: false },
      max: 3,
    });
  }
  return pool;
}

export async function audit(
  actor: string | null,
  action: string,
  detail: unknown
) {
  const p = getPool();
  if (!p) return;
  try {
    await p.query(
      'insert into audit_log (actor, action, detail) values ($1,$2,$3)',
      [actor, action, JSON.stringify(detail ?? {})]
    );
  } catch {
    // auditing must never break the request
  }
}
