import {
  serviceCategories,
  governmentCategories,
  getCategorySubcategories,
} from '../data/yamlLoader';

export interface SearchEntry {
  title: string;
  description?: string;
  url: string;
  section: 'Services' | 'Government' | 'Page' | 'Data';
  category?: string;
  /**
   * Extra searchable text that is NOT shown in the result card — names,
   * numbers, place names contained inside a data page. Lets a search for a
   * specific barangay, contractor, or official surface the page that lists it.
   */
  keywords?: string;
}

const standalonePages: SearchEntry[] = [
  {
    title: 'About the City of Koronadal',
    description:
      'City profile, history, vision, and the 27 barangays of Koronadal (Marbel).',
    url: '/about',
    section: 'Page',
  },
  {
    title: 'Contact the City Government',
    description:
      'City Hall address, trunkline, email, Facebook, and office hours.',
    url: '/contact',
    section: 'Page',
  },
  {
    title: 'History of Koronadal',
    description:
      'How Marbel became the municipality, provincial capital, and component city of Koronadal.',
    url: '/history',
    section: 'Page',
  },
  {
    title: 'Tourism in Koronadal',
    description: 'Festivals, landmarks, and places to visit in Koronadal City.',
    url: '/tourism',
    section: 'Page',
  },
  {
    title: "Citizen's Charter",
    description:
      'Frontline services, requirements, fees, and processing times across city offices.',
    url: '/citizens-charter',
    section: 'Page',
  },
  {
    title: 'Transparency',
    description:
      'Budgets, financial reports, and other transparency documents of the city government.',
    url: '/transparency',
    section: 'Page',
  },
  {
    title: 'News & Announcements',
    description: 'Latest updates from the City Government of Koronadal.',
    url: '/government/news',
    section: 'Page',
  },
  {
    title: 'City Officials',
    description:
      'The Mayor, Vice Mayor, and members of the Sangguniang Panlungsod (City Council).',
    url: '/government/city-officials',
    section: 'Government',
  },
  {
    title: 'Emergency Hotlines',
    description:
      'Korona-911, the city trunkline, barangay BHERT teams, and national emergency numbers.',
    url: '/hotlines',
    section: 'Data',
  },
  {
    title: 'Barangays of Koronadal',
    description:
      'Directory of the 27 barangays with each Punong Barangay, Kagawads, and SK Chairperson.',
    url: '/barangays',
    section: 'Data',
  },
  {
    title: 'Procurement Opportunities',
    description:
      'Open government bid notices and procurement opportunities for Koronadal, sourced from PhilGEPS.',
    url: '/procurements',
    section: 'Data',
  },
  {
    title: 'Flood Control Projects',
    description:
      'DPWH flood-control infrastructure projects in Koronadal, with contractor, contract cost, and year.',
    url: '/flood-control',
    section: 'Data',
  },
  {
    title: 'Regional LGU Directory',
    description:
      'Cities and municipalities of Region XII (SOCCSKSARGEN) with their mayors and vice mayors.',
    url: '/regional-directory',
    section: 'Data',
  },
  {
    title: 'Population & Demographics',
    description:
      'Koronadal population, growth rate, density, and per-barangay population from the PSA census.',
    url: '/statistics',
    section: 'Data',
    keywords:
      'census psa population density growth rate demographics statistics',
  },
  {
    title: 'Business Competitiveness',
    description:
      "Koronadal's CMCI scores for economic dynamism, government efficiency, infrastructure, and resiliency.",
    url: '/statistics/competitiveness',
    section: 'Data',
    keywords:
      'cmci competitiveness economic dynamism infrastructure resiliency ranking',
  },
  {
    title: 'City Income & Finances',
    description:
      "Koronadal's annual revenue, income classification, and historical income figures.",
    url: '/statistics/municipal-income',
    section: 'Data',
    keywords:
      'income revenue budget finance per capita classification municipal',
  },
];

/**
 * Builds keyword blobs (hidden searchable text) for the data pages by loading
 * the underlying datasets. Loaded with dynamic import() so these data modules
 * stay out of the initial bundle and are only fetched when a visitor actually
 * opens the search page. Returns a map of page url -> keyword string.
 */
async function buildDataKeywords(): Promise<Record<string, string>> {
  const keywords: Record<string, string> = {};

  const safe = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch {
      // A failed dataset just means that page is searchable by its
      // title/description only — never block the rest of the index.
    }
  };

  await Promise.all([
    safe(async () => {
      const { barangays } = await import('../data/barangays');
      keywords['/barangays'] = barangays
        .map(
          b =>
            `${b.name} ${b.punongBarangay} ${b.skChairperson} ${b.kagawads.join(' ')}`
        )
        .join(' ');
    }),
    safe(async () => {
      const { koronadalFloodProjects } = await import('../data/floodControl');
      keywords['/flood-control'] = koronadalFloodProjects
        .map(p => `${p.name} ${p.contractor ?? ''}`)
        .join(' ');
    }),
    safe(async () => {
      const { procurementNotices } = await import('../data/procurements');
      keywords['/procurements'] = procurementNotices
        .map(n => `${n.title} ${n.agency ?? ''}`)
        .join(' ');
    }),
    safe(async () => {
      const { lguProvinces } = await import('../data/lguDirectory');
      keywords['/regional-directory'] = lguProvinces
        .flatMap(prov =>
          prov.entries.map(
            e => `${e.name} ${e.mayor?.name ?? ''} ${e.viceMayor?.name ?? ''}`
          )
        )
        .join(' ');
    }),
    safe(async () => {
      const { cityHotlines, barangayHotlines, nationalHotlines } =
        await import('../data/hotlines');
      keywords['/hotlines'] = [
        ...cityHotlines,
        ...barangayHotlines,
        ...nationalHotlines,
      ]
        .map(h => `${h.name} ${h.numbers.join(' ')}`)
        .join(' ');
    }),
    safe(async () => {
      const { allOfficials } = await import('../data/officials');
      keywords['/government/city-officials'] = allOfficials
        .map(
          o =>
            `${o.name} ${o.position} ${(o.legislation ?? [])
              .map(l => `${l.title} ${l.summary ?? ''}`)
              .join(' ')}`
        )
        .join(' ');
    }),
    safe(async () => {
      const { barangayPopulations } = await import('../data/statistics');
      keywords['/statistics'] =
        (keywords['/statistics'] ?? '') +
        ' ' +
        barangayPopulations.map(b => b.name).join(' ');
    }),
  ]);

  return keywords;
}

/**
 * Builds one search entry per official profile page (city + provincial). The
 * hidden keyword blob includes each official's legislation (ordinance titles
 * and summaries) so a search for a specific ordinance — e.g. "Tourism Code" or
 * "E-Governance" — surfaces the officials who authored it and links straight to
 * their profile. Only officials with a profile slug are included.
 */
async function buildOfficialProfileEntries(): Promise<SearchEntry[]> {
  const out: SearchEntry[] = [];
  const legText = (
    legislation?: { title: string; summary?: string | null }[]
  ) =>
    (legislation ?? [])
      .map(l => `${l.title} ${l.summary ?? ''}`)
      .join(' ')
      .trim();

  const safe = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch {
      // A failed dataset just means those profiles aren't individually
      // searchable — never block the rest of the index.
    }
  };

  await Promise.all([
    safe(async () => {
      const { allOfficials } = await import('../data/officials');
      for (const o of allOfficials) {
        if (!o.slug) continue;
        out.push({
          title: o.name.replace(/^Hon\.\s*/, ''),
          description: o.position,
          url: `/city-officials/${o.slug}`,
          section: 'Government',
          category: 'City Official',
          keywords: `${o.name} ${o.position} ${legText(o.legislation)}`.trim(),
        });
      }
    }),
    safe(async () => {
      const { provincialOfficials } =
        await import('../data/provincialOfficials');
      for (const o of provincialOfficials) {
        out.push({
          title: o.name,
          description: o.district
            ? `${o.position} · ${o.district}`
            : o.position,
          url: `/provincial-officials/${o.slug}`,
          section: 'Government',
          category: 'Provincial Official',
          keywords:
            `${o.name} ${o.position} ${o.party ?? ''} ${o.achievements.join(
              ' '
            )} ${legText(o.legislation)}`.trim(),
        });
      }
    }),
  ]);

  return out;
}

/**
 * Builds a flat, searchable list of every navigable page: each service and
 * government category landing page, every page listed under them, the
 * standalone pages, the data pages enriched with the names/numbers they
 * contain, and one entry per official profile (with their legislation).
 */
export async function buildSearchEntries(): Promise<SearchEntry[]> {
  const [dataKeywords, officialEntries] = await Promise.all([
    buildDataKeywords(),
    buildOfficialProfileEntries(),
  ]);

  const entries: SearchEntry[] = standalonePages.map(entry => {
    const extra = dataKeywords[entry.url];
    if (!extra) return entry;
    return {
      ...entry,
      keywords: `${entry.keywords ?? ''} ${extra}`.trim(),
    };
  });

  entries.push(...officialEntries);

  const collect = async (
    categories: typeof serviceCategories.categories,
    section: 'Services' | 'Government',
    base: string
  ) => {
    for (const cat of categories) {
      entries.push({
        title: cat.category,
        description: cat.description,
        url: `${base}/${cat.slug}`,
        section,
        category: cat.category,
      });
      const index = await getCategorySubcategories(cat.slug);
      for (const page of index.pages) {
        if (!page.slug) continue;
        entries.push({
          title: page.name,
          description: page.description,
          url: `${base}/${cat.slug}/${page.slug}`,
          section,
          category: cat.category,
        });
      }
    }
  };

  await collect(serviceCategories.categories, 'Services', '/services');
  await collect(governmentCategories.categories, 'Government', '/government');

  return entries;
}

// --- Fuzzy matching ---------------------------------------------------------

/** Levenshtein distance, bounded: returns `max + 1` once it provably exceeds max. */
function boundedLevenshtein(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  if (a === b) return 0;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > max) return max + 1;
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

/** Are the characters of `token` present in `word` in order? (subsequence) */
function isSubsequence(token: string, word: string): boolean {
  let i = 0;
  for (let j = 0; j < word.length && i < token.length; j++) {
    if (word[j] === token[i]) i++;
  }
  return i === token.length;
}

/**
 * Quality in [0,1] of how well a single token matches a field of text.
 * Exact substring is best; otherwise we look word-by-word for prefix matches,
 * small edit-distance typos, and loose subsequence matches.
 */
function tokenFieldQuality(token: string, field: string): number {
  if (!field) return 0;
  if (field.includes(token)) return 1;

  const maxDist = token.length <= 4 ? 1 : 2;
  let best = 0;
  for (const word of field.split(/\s+/)) {
    if (!word) continue;
    if (word.startsWith(token)) {
      best = Math.max(best, 0.9);
      continue;
    }
    if (token.length >= 3) {
      const dist = boundedLevenshtein(token, word, maxDist);
      if (dist <= maxDist) {
        best = Math.max(best, 0.75 - (dist - 1) * 0.15);
        continue;
      }
      if (isSubsequence(token, word)) {
        best = Math.max(best, 0.45);
      }
    }
  }
  return best;
}

/**
 * Typo-tolerant, weighted, tokenized scoring. Every query token must match
 * somewhere (AND semantics); title hits outrank category/keyword/description
 * hits. Tolerates small typos ("bilding permit" → "building permit").
 */
export function searchEntries(
  entries: SearchEntry[],
  query: string
): SearchEntry[] {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean);
  if (tokens.length === 0) return [];

  const fieldWeights: Array<[keyof SearchEntry, number]> = [
    ['title', 3],
    ['category', 2.5],
    ['keywords', 2],
    ['description', 1],
  ];

  const scored = entries
    .map(entry => {
      let score = 0;
      for (const token of tokens) {
        let tokenBest = 0;
        for (const [field, weight] of fieldWeights) {
          const value = (entry[field] as string | undefined)?.toLowerCase();
          if (!value) continue;
          tokenBest = Math.max(
            tokenBest,
            weight * tokenFieldQuality(token, value)
          );
        }
        if (tokenBest === 0) return null; // token matched nothing — drop entry
        score += tokenBest;
      }
      return { entry, score };
    })
    .filter((r): r is { entry: SearchEntry; score: number } => r !== null);

  scored.sort((a, b) => b.score - a.score);
  return scored.map(r => r.entry);
}
