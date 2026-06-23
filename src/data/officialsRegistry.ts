// Historical officials registry — an aggregation LAYER on top of the existing
// datasets. It merges current city officials (officials.ts), current provincial
// officials (provincialOfficials.ts), and former officials (pastOfficials.ts)
// into one record PER PERSON, with a timeline of tenures and their combined
// contributions and court cases. Powers the /officials cheatsheet + the unified
// historical profile at /officials/:id.

import type {
  Legislation,
  CourtCase,
  OfficialSource,
} from './provincialOfficials';
import { provincialOfficials, provincialTerm } from './provincialOfficials';
import { allOfficials, cityTerm } from './officials';
import { pastOfficials, type GovBody } from './pastOfficials';

export type TenureStatus = 'current' | 'past' | 'future';

export interface Tenure {
  body: GovBody;
  position: string;
  term?: string | null;
  status: TenureStatus;
}

export interface RegistryPerson {
  id: string;
  name: string;
  photo?: string | null;
  bio?: string;
  tenures: Tenure[];
  achievements: string[];
  legislation: Legislation[];
  notableNotes: string[];
  concerns: string[];
  courtCases: CourtCase[];
  sources: OfficialSource[];
  /** Overall status: current if any current tenure, else future, else past. */
  status: TenureStatus;
}

const SUFFIX = new Set([
  'jr',
  'sr',
  'ii',
  'iii',
  'iv',
  'md',
  'dpa',
  'mdmg',
  'cpa',
  'atty',
  'phd',
]);

function nameTokens(name: string): string[] {
  return name
    .replace(/[“”"'].*?[“”"']/g, ' ') // drop quoted nickname
    .replace(/\bHon\.?\b/gi, ' ')
    .split(/\s+/)
    .map(t => t.replace(/[.,]/g, ''))
    .filter(Boolean)
    .filter(t => t.length > 1 && !SUFFIX.has(t.toLowerCase()));
}

/** Identity key for merging the same person across datasets (first + last). */
function idKey(name: string): string {
  const t = nameTokens(name);
  if (!t.length) return name.toLowerCase();
  return `${t[0]} ${t[t.length - 1]}`.toLowerCase();
}

function slugify(name: string): string {
  return nameTokens(name)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

function dedupe<T>(arr: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>();
  return arr.filter(x => {
    const k = key(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

interface UpsertInput {
  slug?: string;
  name: string;
  photo?: string | null;
  bio?: string;
  tenure: Tenure;
  achievements?: string[];
  legislation?: Legislation[];
  notableNotes?: string[];
  concerns?: string[];
  courtCases?: CourtCase[];
  sources?: OfficialSource[];
}

function buildRegistry(): RegistryPerson[] {
  const map = new Map<string, RegistryPerson>();

  const upsert = (o: UpsertInput) => {
    const key = idKey(o.name);
    let p = map.get(key);
    if (!p) {
      p = {
        id: o.slug || slugify(o.name),
        name: o.name,
        photo: o.photo ?? null,
        bio: o.bio,
        tenures: [],
        achievements: [],
        legislation: [],
        notableNotes: [],
        concerns: [],
        courtCases: [],
        sources: [],
        status: 'past',
      };
      map.set(key, p);
    }
    if (!p.photo && o.photo) p.photo = o.photo;
    if (o.bio && (!p.bio || o.bio.length > p.bio.length)) p.bio = o.bio;
    p.tenures.push(o.tenure);
    p.achievements.push(...(o.achievements ?? []));
    p.legislation.push(...(o.legislation ?? []));
    p.notableNotes.push(...(o.notableNotes ?? []));
    p.concerns.push(...(o.concerns ?? []));
    p.courtCases.push(...(o.courtCases ?? []));
    p.sources.push(...(o.sources ?? []));
  };

  // Current provincial officials (governor / vice-gov / board / reps).
  for (const o of provincialOfficials) {
    const body: GovBody = /Representative/i.test(o.position)
      ? 'Congress'
      : 'Province';
    upsert({
      slug: o.slug,
      name: o.name,
      photo: o.photo,
      bio: o.bio,
      tenure: {
        body,
        position: o.district ? `${o.position} (${o.district})` : o.position,
        term: provincialTerm,
        status: 'current',
      },
      achievements: o.achievements,
      legislation: o.legislation,
      notableNotes: o.notableNotes,
      concerns: o.concerns,
      courtCases: o.courtCases,
      sources: o.sources,
    });
  }

  // Current city officials (mayor / vice mayor / council / ex-officio).
  for (const o of allOfficials) {
    upsert({
      slug: o.slug,
      name: o.name,
      photo: o.photo,
      bio: o.bio,
      tenure: {
        body: 'City',
        position: o.position,
        term: cityTerm,
        status: 'current',
      },
      legislation: o.legislation,
    });
  }

  // Former officials (research + OCR-derived past councilors).
  for (const o of pastOfficials) {
    o.tenures.forEach((ten, i) => {
      upsert({
        slug: o.slug,
        name: o.name,
        photo: o.photo,
        bio: o.bio,
        tenure: { ...ten, status: 'past' },
        // Attach contributions once (with the first tenure) to avoid dupes.
        ...(i === 0
          ? {
              achievements: o.achievements,
              legislation: o.legislation,
              notableNotes: o.notableNotes,
              concerns: o.concerns,
              courtCases: o.courtCases,
              sources: o.sources,
            }
          : {}),
      });
    });
  }

  return [...map.values()]
    .map(p => {
      const hasCurrent = p.tenures.some(t => t.status === 'current');
      const hasFuture = p.tenures.some(t => t.status === 'future');
      return {
        ...p,
        status: (hasCurrent
          ? 'current'
          : hasFuture
            ? 'future'
            : 'past') as TenureStatus,
        legislation: dedupe(p.legislation, l => l.title),
        courtCases: dedupe(p.courtCases, c => c.title),
        sources: dedupe(p.sources, s => s.href),
        achievements: [...new Set(p.achievements)],
        notableNotes: [...new Set(p.notableNotes)],
        concerns: [...new Set(p.concerns)],
        tenures: [...p.tenures].sort(
          (a, b) =>
            (a.status === 'current' ? 0 : 1) - (b.status === 'current' ? 0 : 1)
        ),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const registryPeople: RegistryPerson[] = buildRegistry();

export function getRegistryPerson(id: string): RegistryPerson | undefined {
  return registryPeople.find(p => p.id === id);
}

/** Distinct government bodies present, for the cheatsheet filter. */
export const registryBodies: GovBody[] = [
  'City',
  'Province',
  'Congress',
  'Other',
];
