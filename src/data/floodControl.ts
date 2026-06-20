// DPWH flood-control projects in South Cotabato, narrowed to the City of
// Koronadal. The underlying data comes from the DPWH "Flood Control Projects
// Live" ArcGIS layer and is refreshed into src/data/generated/flood-control.json
// by scripts/refresh-data.mjs (run on a schedule — see the GitHub Actions
// workflow). This module just types and filters that committed JSON.
import raw from './generated/flood-control.json';

export interface FloodControlProject {
  name: string | null;
  municipality: string | null;
  contractor: string | null;
  cost: number | null;
  status: string | null;
  year: number | string | null;
}

interface FloodControlData {
  fetchedAt: string | null;
  source: string;
  sourceUrl: string;
  province: string;
  projects: FloodControlProject[];
}

const data = raw as FloodControlData;

export const FLOOD_CONTROL_SOURCE = data.sourceUrl;
export const FLOOD_CONTROL_FETCHED_AT = data.fetchedAt;

/** All South Cotabato projects, newest infra year first. */
export const floodControlProjects: FloodControlProject[] = [
  ...data.projects,
].sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));

/** Projects whose municipality names the City of Koronadal. */
export const koronadalFloodProjects: FloodControlProject[] =
  floodControlProjects.filter(p => /koronadal/i.test(p.municipality ?? ''));

/** Total peso value of the Koronadal projects. */
export const koronadalFloodTotalCost: number = koronadalFloodProjects.reduce(
  (sum, p) => sum + (p.cost ?? 0),
  0
);
