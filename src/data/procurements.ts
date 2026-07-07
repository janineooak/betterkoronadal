// PhilGEPS awarded contracts for the City of Koronadal.
//
// Sourced from BetterGov's PHILGEPS Awards Data Explorer
// (philgeps.bettergov.ph) by scripts/refresh-data.mjs and committed to
// src/data/generated/procurements.json. These are *awarded* contracts naming
// Koronadal (not open bid opportunities). When the fetch yields nothing the
// list is empty and the page falls back to a link to PhilGEPS.
import raw from './generated/procurements.json';

interface ProcurementAward {
  refId: string;
  title: string | null;
  organization: string | null;
  awardee: string | null;
  category: string | null;
  area: string | null;
  amount: number | null;
  awardDate: string | null;
  status: string | null;
  url: string;
}

interface ProcurementData {
  fetchedAt: string | null;
  source: string;
  sourceUrl: string;
  apiUrl?: string;
  city: string;
  awards: ProcurementAward[];
}

// Backwards-compatible notice shape consumed by the /procurements page and the
// search index. `abc` now carries the awarded contract amount; `closingDate` is
// left unset because awards have an award date, not a closing date.
export interface ProcurementNotice {
  refId: string;
  title: string;
  agency?: string;
  awardee?: string;
  category?: string;
  abc?: number | null;
  closingDate?: string;
  awardDate?: string;
  url: string;
}

const data = raw as unknown as ProcurementData;

export const PROCUREMENT_SOURCE = data.sourceUrl;
export const PROCUREMENT_FETCHED_AT = data.fetchedAt;

export const procurementNotices: ProcurementNotice[] = data.awards.map(a => ({
  refId: a.refId,
  title: a.title ?? '',
  agency: a.organization ?? undefined,
  awardee: a.awardee ?? undefined,
  category: a.category ?? undefined,
  abc: a.amount,
  awardDate: a.awardDate ?? undefined,
  url: a.url,
}));
