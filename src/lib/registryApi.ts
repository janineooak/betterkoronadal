// Client for the Bantay Opisyal admin backend. Every call degrades gracefully:
// when no backend is deployed, reads return null/empty and the UI falls back to
// the static, code-curated registry.
import { registryPeople, type RegistryPerson } from '../data/officialsRegistry';
import type { CourtCase } from '../data/provincialOfficials';

export interface PublishedEntry {
  person_id: string;
  name: string;
  data: Partial<RegistryPerson>;
}
export interface SensitiveRow {
  person_id: string;
  kind: 'court_case' | 'concern';
  data: unknown;
}
export interface PublishedData {
  entries: PublishedEntry[];
  sensitive: SensitiveRow[];
}

export interface ContributionInput {
  kind:
    | 'new_person'
    | 'edit'
    | 'court_case'
    | 'concern'
    | 'correction'
    | 'other';
  personName: string;
  personId?: string;
  note: string;
  payload?: Record<string, unknown>;
  submitterName?: string;
  submitterEmail?: string;
}

const TOKEN_KEY = 'bo_admin_token';
export const getToken = () =>
  typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
export const setToken = (t: string | null) => {
  if (typeof localStorage === 'undefined') return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
};

async function authed(path: string, init: RequestInit = {}) {
  const token = getToken();
  return fetch(path, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });
}

// --- public ---------------------------------------------------------------

export async function fetchPublished(): Promise<PublishedData | null> {
  try {
    const r = await fetch('/api/registry');
    if (!r.ok) return null;
    return (await r.json()) as PublishedData;
  } catch {
    return null;
  }
}

export async function submitContribution(
  input: ContributionInput
): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok)
      return { ok: false, error: (j as { error?: string }).error || 'Failed.' };
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error — is the backend deployed?' };
  }
}

// --- admin ----------------------------------------------------------------

export async function adminLogin(username: string, password: string) {
  const r = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok)
    throw new Error((j as { error?: string }).error || 'Login failed.');
  setToken((j as { token: string }).token);
  return j as { token: string; username: string };
}

export async function adminListSubmissions() {
  const r = await authed('/api/submissions?status=pending');
  if (!r.ok) throw new Error('Failed to load submissions.');
  return (await r.json()).submissions as Submission[];
}

export async function adminReview(
  submissionId: string,
  action: 'approve' | 'reject',
  reviewNote?: string
) {
  const r = await authed('/api/admin/review', {
    method: 'POST',
    body: JSON.stringify({ submissionId, action, reviewNote }),
  });
  if (!r.ok)
    throw new Error((await r.json().catch(() => ({}))).error || 'Failed.');
  return r.json();
}

export async function adminListEntries() {
  const r = await authed('/api/admin/entries');
  if (!r.ok) throw new Error('Failed to load entries.');
  return (await r.json()) as {
    entries: EntryRow[];
    sensitive: SensitiveItem[];
  };
}

export async function adminReviewSensitive(
  id: string,
  action: 'publish' | 'reject'
) {
  const r = await authed('/api/admin/sensitive', {
    method: 'POST',
    body: JSON.stringify({ id, action }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j as { error?: string }).error || 'Failed.');
  return j;
}

export interface Submission {
  id: string;
  created_at: string;
  kind: string;
  person_id: string | null;
  person_name: string;
  payload: Record<string, unknown>;
  submitter_name: string | null;
  submitter_email: string | null;
  note: string | null;
  status: string;
}
export interface EntryRow {
  person_id: string;
  name: string;
  data: Partial<RegistryPerson>;
  updated_at: string;
  updated_by: string | null;
}
export interface SensitiveItem {
  id: string;
  person_id: string;
  kind: 'court_case' | 'concern';
  data: unknown;
  state: string;
  first_reviewer: string | null;
  second_reviewer: string | null;
}

// --- merge ----------------------------------------------------------------

const uniq = (a: string[]) => [...new Set(a)];
function mergeBy<T>(
  base: T[],
  add: T[] | undefined,
  key: (x: T) => string
): T[] {
  if (!add?.length) return base;
  const seen = new Set(base.map(key));
  return [...base, ...add.filter(x => !seen.has(key(x)))];
}

/** Merge admin-published entries + approved sensitive items over the static base. */
export function mergeRegistry(
  base: RegistryPerson[],
  published: PublishedData | null
): RegistryPerson[] {
  if (!published) return base;
  const byId = new Map<string, RegistryPerson>(
    base.map(p => [p.id, structuredClone(p)])
  );

  for (const e of published.entries ?? []) {
    const d = e.data || {};
    const existing = byId.get(e.person_id);
    if (existing) {
      byId.set(e.person_id, {
        ...existing,
        bio: d.bio ?? existing.bio,
        photo: d.photo ?? existing.photo,
        status: d.status ?? existing.status,
        tenures: mergeBy(
          existing.tenures,
          d.tenures,
          t => `${t.body}|${t.position}|${t.term ?? ''}`
        ),
        achievements: uniq([
          ...existing.achievements,
          ...(d.achievements ?? []),
        ]),
        legislation: mergeBy(existing.legislation, d.legislation, l => l.title),
        notableNotes: uniq([
          ...existing.notableNotes,
          ...(d.notableNotes ?? []),
        ]),
        sources: mergeBy(existing.sources, d.sources, s => s.href),
      });
    } else {
      byId.set(e.person_id, {
        id: e.person_id,
        name: e.name,
        photo: d.photo ?? null,
        bio: d.bio,
        tenures: d.tenures ?? [],
        achievements: d.achievements ?? [],
        legislation: d.legislation ?? [],
        notableNotes: d.notableNotes ?? [],
        concerns: [],
        courtCases: [],
        sources: d.sources ?? [],
        status: d.status ?? 'past',
      });
    }
  }

  for (const s of published.sensitive ?? []) {
    const person = byId.get(s.person_id);
    if (!person) continue;
    if (s.kind === 'court_case') {
      person.courtCases = mergeBy(
        person.courtCases,
        [s.data as CourtCase],
        c => c.title
      );
    } else {
      const text =
        typeof s.data === 'string'
          ? s.data
          : ((s.data as { text?: string })?.text ?? '');
      if (text) person.concerns = uniq([...person.concerns, text]);
    }
  }

  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export { registryPeople };
