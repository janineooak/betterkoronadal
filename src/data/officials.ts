import type { Legislation } from './provincialOfficials';
import { cityOrdinances } from './cityOrdinances';

export interface Official {
  name: string;
  position: string;
  photo: string;
  /**
   * kebab-case slug. Present only for officials who have a profile sub-page
   * (i.e. those with documented legislation): /city-officials/:slug
   */
  slug?: string;
  /** Optional short biography for the profile page. */
  bio?: string;
  /**
   * Ordinances / measures authored, co-authored, sponsored, or supported.
   * Attached from `cityOrdinances` (keyed by slug) at module load — see bottom.
   */
  legislation?: Legislation[];
}

// Term these officials are serving.
export const cityTerm = '2025–2028';

export const executives: Official[] = [
  {
    name: 'Hon. Erlinda “Bing” Pabi-Araquil',
    position: 'City Mayor',
    photo: '/officials/araquil.png',
  },
  {
    name: 'Hon. Ma. Ester M. Catorce',
    position: 'City Vice Mayor · Presiding Officer',
    photo: '/officials/catorce.png',
    slug: 'ma-ester-catorce',
    bio: 'Ma. Ester M. Catorce is the City Vice Mayor of Koronadal and Presiding Officer of the Sangguniang Panlungsod. She succeeded to the vice mayoralty in March 2026. As a city councilor she principally authored several of the city’s disaster-preparedness, culture, and welfare ordinances.',
  },
];

export const councilors: Official[] = [
  {
    name: 'Hon. Maylene May S. Bascon-De Guzman',
    position: 'City Councilor',
    photo: '/officials/bascon-de-guzman.png',
    slug: 'maylene-bascon-de-guzman',
    bio: 'Maylene May S. Bascon-De Guzman is a City Councilor of Koronadal who has authored numerous ordinances establishing and organizing the city’s offices and welfare programs.',
  },
  {
    name: 'Hon. Edwin G. Abris',
    position: 'City Councilor',
    photo: '/officials/abris.png',
    slug: 'edwin-abris',
    bio: 'Edwin G. Abris is a City Councilor of Koronadal who has authored and sponsored ordinances on tourism, public transport, and social welfare.',
  },
  {
    name: 'Hon. Handel Dee R. Cadellino-Cubilo',
    position: 'City Councilor',
    photo: '/officials/cadellino-cubilo.png',
    slug: 'handel-cadellino-cubilo',
    bio: 'Handel Dee R. Cadellino-Cubilo is a City Councilor of Koronadal who has co-authored and sponsored several city ordinances on culture, sports, and indigenous peoples’ welfare.',
  },
  {
    name: 'Hon. Mark C. Lapidez',
    position: 'City Councilor',
    photo: '/officials/lapidez.png',
    slug: 'mark-lapidez',
    bio: 'Mark C. Lapidez is a City Councilor of Koronadal who has co-authored several city ordinances, including measures on culture, governance, and indigenous peoples’ welfare.',
  },
  {
    name: 'Hon. Charene Kristelle C. Jumilla-Pama',
    position: 'City Councilor',
    photo: '/officials/jumilla-pama.png',
    slug: 'charene-jumilla-pama',
    bio: 'Charene Kristelle C. Jumilla-Pama is a City Councilor of Koronadal and chairs the Sangguniang Panlungsod Committee on Commerce, Trade, and Industry.',
  },
  {
    name: 'Hon. Bernardo B. Hinay',
    position: 'City Councilor',
    photo: '/officials/hinay.png',
    slug: 'bernardo-hinay',
    bio: 'Bernardo B. Hinay is a City Councilor of Koronadal and a member of the Sangguniang Panlungsod Committee on Commerce, Trade, and Industry.',
  },
  {
    name: 'Hon. John Rey P. Rodriguez',
    position: 'City Councilor',
    photo: '/officials/rodriguez.png',
    slug: 'john-rey-rodriguez',
    bio: 'John Rey P. Rodriguez is a City Councilor of Koronadal who has authored and co-authored ordinances on culture, civil registry, and local economic enterprise.',
  },
  {
    name: 'Hon. Ellen Grace N. Subere-Albios',
    position: 'City Councilor',
    photo: '/officials/subere-albios.png',
    slug: 'ellen-grace-subere-albios',
    bio: 'Ellen Grace N. Subere-Albios is a City Councilor of Koronadal and one of the Sangguniang Panlungsod’s most prolific authors, with ordinances on livelihood, culture, tourism, and digital governance.',
  },
  {
    name: 'Hon. Margarita D. Subaldo',
    position: 'City Councilor',
    photo: '/officials/subaldo.png',
  },
  {
    name: 'Hon. Suellen C. Ogena',
    position: 'City Councilor',
    photo: '/officials/ogena.png',
  },
];

export const exOfficio: Official[] = [
  {
    name: 'Hon. Marvin Ian C. Gumbao',
    position: 'ABC President · Liga ng mga Barangay',
    photo: '/officials/gumbao.png',
    slug: 'marvin-gumbao',
    bio: 'Marvin Ian C. Gumbao is the Liga ng mga Barangay (ABC) President and an ex-officio member of the Sangguniang Panlungsod.',
  },
  {
    name: 'Hon. Delia P. Lawian',
    position: 'IP Mandatory Representative (IPMR)',
    photo: '/officials/lawian.png',
  },
  {
    name: 'Hon. Charles Ronn C. Trinidad',
    position: 'SK Federation President',
    photo: '/officials/trinidad.png',
    slug: 'charles-trinidad',
    bio: 'Charles Ronn C. Trinidad is the SK Federation President and an ex-officio member of the Sangguniang Panlungsod, where he has authored and co-authored several city ordinances.',
  },
];

// Flat list of every official, used by the city officials page and the site
// search index.
export const allOfficials: Official[] = [
  ...executives,
  ...councilors,
  ...exOfficio,
];

// Attach legislation (sourced from official ordinance PDFs + news releases) to
// each official by slug. Keeps the curated roster above free of bulky data.
for (const official of allOfficials) {
  if (official.slug && cityOrdinances[official.slug]) {
    official.legislation = cityOrdinances[official.slug];
  }
}

/** Look up a single city official by profile slug. */
export function getCityOfficial(slug: string): Official | undefined {
  return allOfficials.find(o => o.slug === slug);
}
