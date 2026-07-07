// DPWH flood-control projects for the City of Koronadal. The data is pulled
// from BetterGov's bisto.ph API (api.dpwh.bettergov.ph) by
// scripts/refresh-data.mjs and committed to
// src/data/generated/flood-control.json. The fetcher already narrows to
// Koronadal within Region XII, so every row here is a Koronadal project.
import raw from './generated/flood-control.json';

export interface FloodControlProject {
  contractId: string | null;
  name: string | null;
  category: string | null;
  status: string | null;
  cost: number | null;
  progress: number | null;
  contractor: string | null;
  district: string | null;
  region: string | null;
  year: number | string | null;
  startDate: string | null;
  completionDate: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface FloodControlData {
  fetchedAt: string | null;
  source: string;
  sourceUrl: string;
  apiUrl?: string;
  city?: string;
  province: string;
  projects: FloodControlProject[];
}

const data = raw as unknown as FloodControlData;

export const FLOOD_CONTROL_SOURCE = data.sourceUrl;
export const FLOOD_CONTROL_FETCHED_AT = data.fetchedAt;

/** All Koronadal flood-control projects, newest infra year first. */
export const floodControlProjects: FloodControlProject[] = [
  ...data.projects,
].sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));

/**
 * Projects for the City of Koronadal. The upstream feed is already scoped to
 * Koronadal, so this is the full list (kept as a named export for callers).
 */
export const koronadalFloodProjects: FloodControlProject[] =
  floodControlProjects;

/** Total peso value of the Koronadal projects. */
export const koronadalFloodTotalCost: number = koronadalFloodProjects.reduce(
  (sum, p) => sum + (p.cost ?? 0),
  0
);
