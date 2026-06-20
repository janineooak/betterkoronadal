// PhilGEPS open procurement opportunities for the City of Koronadal.
//
// notices.philgeps.gov.ph is an ASP.NET WebForms search (no public JSON API,
// CORS-blocked) and open.philgeps.gov.ph's data endpoints are session-gated, so
// these notices cannot be fetched from the browser. They are pulled by
// scripts/refresh-data.mjs on a schedule and committed to
// src/data/generated/procurements.json. When that best-effort fetch yields
// nothing, `notices` is empty and the page falls back to a link to PhilGEPS.
import raw from './generated/procurements.json';

export interface ProcurementNotice {
  refId: string;
  title: string;
  agency?: string;
  category?: string;
  abc?: number | null;
  closingDate?: string;
  url: string;
}

interface ProcurementData {
  fetchedAt: string | null;
  source: string;
  sourceUrl: string;
  city: string;
  notices: ProcurementNotice[];
}

const data = raw as ProcurementData;

export const PROCUREMENT_SOURCE = data.sourceUrl;
export const PROCUREMENT_FETCHED_AT = data.fetchedAt;
export const procurementNotices: ProcurementNotice[] = data.notices;
