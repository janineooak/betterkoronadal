import {
  serviceCategories,
  governmentCategories,
  getCategorySubcategories,
} from '../data/yamlLoader';

export interface SearchEntry {
  title: string;
  description?: string;
  url: string;
  section: 'Services' | 'Government' | 'Page';
  category?: string;
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
    title: 'Emergency Hotlines',
    description:
      'Korona-911, the city trunkline, and national emergency numbers.',
    url: '/hotlines',
    section: 'Page',
  },
  {
    title: 'Barangays of Koronadal',
    description:
      'Directory of the 27 barangays with each Punong Barangay, Kagawads, and SK Chairperson.',
    url: '/barangays',
    section: 'Page',
  },
  {
    title: 'Procurement Opportunities',
    description:
      'Open government bid notices and procurement opportunities for Koronadal, sourced from PhilGEPS.',
    url: '/procurements',
    section: 'Page',
  },
  {
    title: 'Flood Control Projects',
    description:
      'DPWH flood-control infrastructure projects in Koronadal, with contractor, contract cost, and year.',
    url: '/flood-control',
    section: 'Page',
  },
  {
    title: 'Regional LGU Directory',
    description:
      'Cities and municipalities of Region XII (SOCCSKSARGEN) with their mayors and vice mayors.',
    url: '/regional-directory',
    section: 'Page',
  },
];

/**
 * Builds a flat, searchable list of every navigable page: each service and
 * government category landing page, every page listed under them, and the
 * standalone pages. Reuses the cached category index loader.
 */
export async function buildSearchEntries(): Promise<SearchEntry[]> {
  const entries: SearchEntry[] = [...standalonePages];

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

/** Tokenized, weighted scoring: title matches rank above description/category. */
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

  const scored = entries
    .map(entry => {
      const title = entry.title.toLowerCase();
      const description = (entry.description ?? '').toLowerCase();
      const category = (entry.category ?? '').toLowerCase();

      let score = 0;
      for (const token of tokens) {
        if (title.includes(token)) score += 3;
        else if (category.includes(token)) score += 2;
        else if (description.includes(token)) score += 1;
        else return null; // every token must match somewhere
      }
      return { entry, score };
    })
    .filter((r): r is { entry: SearchEntry; score: number } => r !== null);

  scored.sort((a, b) => b.score - a.score);
  return scored.map(r => r.entry);
}
