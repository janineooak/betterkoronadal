import type { Legislation } from './provincialOfficials';

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
  /** Ordinances / measures authored, co-authored, sponsored, or supported. */
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
    bio: 'Ma. Ester M. Catorce is the City Vice Mayor of Koronadal and Presiding Officer of the Sangguniang Panlungsod. She succeeded to the vice mayoralty in March 2026. As a city councilor she principally authored several of the city’s disaster-preparedness ordinances.',
    legislation: [
      {
        title:
          'Ordinance No. 19, S. 2025 — School-Based Disaster Preparedness Program',
        role: 'authored',
        summary:
          'Establishes a localized school-based disaster preparedness program (CKSDPP) for the City of Koronadal.',
        status: 'Enacted',
        sources: [
          {
            label:
              'City Government of Koronadal — SP enacts landmark disaster-preparedness ordinances',
            href: 'https://koronadal.gov.ph/2025/11/25/sangguniang-panlungsod-enacts-landmark-disaster-preparedness-ordinances/',
          },
        ],
      },
      {
        title: 'Ordinance No. 22, S. 2025 — Incident Command System (ICS)',
        role: 'authored',
        summary:
          'Institutionalizes the city’s Incident Command System for disaster and emergency response.',
        status: 'Enacted',
        sources: [
          {
            label:
              'City Government of Koronadal — SP enacts landmark disaster-preparedness ordinances',
            href: 'https://koronadal.gov.ph/2025/11/25/sangguniang-panlungsod-enacts-landmark-disaster-preparedness-ordinances/',
          },
        ],
      },
      {
        title: 'Ordinance creating the City Arts and Culture Council',
        role: 'co-authored',
        summary:
          'Creates a City Arts and Culture Council. Jointly authored with SP Member John Rey P. Rodriguez.',
        status: 'Approved',
        sources: [
          {
            label:
              'City Government of Koronadal — 8th Sanggunian passes key ordinances in their final stretch',
            href: 'https://koronadal.gov.ph/2025/07/04/8th-sanggunian-passes-key-ordinances-in-their-final-stretch/',
          },
        ],
      },
    ],
  },
];

export const councilors: Official[] = [
  {
    name: 'Hon. Maylene May S. Bascon-De Guzman',
    position: 'City Councilor',
    photo: '/officials/bascon-de-guzman.png',
  },
  {
    name: 'Hon. Edwin G. Abris',
    position: 'City Councilor',
    photo: '/officials/abris.png',
  },
  {
    name: 'Hon. Handel Dee R. Cadellino-Cubilo',
    position: 'City Councilor',
    photo: '/officials/cadellino-cubilo.png',
  },
  {
    name: 'Hon. Mark C. Lapidez',
    position: 'City Councilor',
    photo: '/officials/lapidez.png',
  },
  {
    name: 'Hon. Charene Kristelle C. Jumilla-Pama',
    position: 'City Councilor',
    photo: '/officials/jumilla-pama.png',
    slug: 'charene-jumilla-pama',
    bio: 'Charene Kristelle C. Jumilla-Pama is a City Councilor of Koronadal and chairs the Sangguniang Panlungsod Committee on Commerce, Trade, and Industry.',
    legislation: [
      {
        title: 'Local Economic Enterprise (LEE) Code of the City of Koronadal',
        role: 'sponsored',
        summary:
          'Codifies the operation of the city’s local economic enterprises. Advanced by the Committee on Commerce, Trade, and Industry, which she chairs.',
        status: 'Approved on third and final reading (March 25, 2025)',
        sources: [
          {
            label:
              'City Government of Koronadal — SP-Koronadal approves landmark Local Economic Enterprise Code',
            href: 'https://koronadal.gov.ph/2025/03/25/sp-koronadal-approves-landmark-local-economic-enterprise-code/',
          },
        ],
      },
    ],
  },
  {
    name: 'Hon. Bernardo B. Hinay',
    position: 'City Councilor',
    photo: '/officials/hinay.png',
    slug: 'bernardo-hinay',
    bio: 'Bernardo B. Hinay is a City Councilor of Koronadal and a member of the Sangguniang Panlungsod Committee on Commerce, Trade, and Industry.',
    legislation: [
      {
        title: 'Local Economic Enterprise (LEE) Code of the City of Koronadal',
        role: 'co-authored',
        summary:
          'Member of the Committee on Commerce, Trade, and Industry that crafted and advanced the LEE Code.',
        status: 'Approved on third and final reading (March 25, 2025)',
        sources: [
          {
            label:
              'City Government of Koronadal — SP-Koronadal approves landmark Local Economic Enterprise Code',
            href: 'https://koronadal.gov.ph/2025/03/25/sp-koronadal-approves-landmark-local-economic-enterprise-code/',
          },
        ],
      },
    ],
  },
  {
    name: 'Hon. John Rey P. Rodriguez',
    position: 'City Councilor',
    photo: '/officials/rodriguez.png',
    slug: 'john-rey-rodriguez',
    bio: 'John Rey P. Rodriguez is a City Councilor of Koronadal who has co-authored ordinances on culture and local economic enterprise.',
    legislation: [
      {
        title: 'Ordinance creating the City Arts and Culture Council',
        role: 'co-authored',
        summary:
          'Creates a City Arts and Culture Council. Jointly authored with Vice Mayor Ma. Ester M. Catorce.',
        status: 'Approved',
        sources: [
          {
            label:
              'City Government of Koronadal — 8th Sanggunian passes key ordinances in their final stretch',
            href: 'https://koronadal.gov.ph/2025/07/04/8th-sanggunian-passes-key-ordinances-in-their-final-stretch/',
          },
        ],
      },
      {
        title: 'Local Economic Enterprise (LEE) Code of the City of Koronadal',
        role: 'co-authored',
        summary:
          'Member of the Committee on Commerce, Trade, and Industry that crafted and advanced the LEE Code.',
        status: 'Approved on third and final reading (March 25, 2025)',
        sources: [
          {
            label:
              'City Government of Koronadal — SP-Koronadal approves landmark Local Economic Enterprise Code',
            href: 'https://koronadal.gov.ph/2025/03/25/sp-koronadal-approves-landmark-local-economic-enterprise-code/',
          },
        ],
      },
    ],
  },
  {
    name: 'Hon. Ellen Grace N. Subere-Albios',
    position: 'City Councilor',
    photo: '/officials/subere-albios.png',
    slug: 'ellen-grace-subere-albios',
    bio: 'Ellen Grace N. Subere-Albios is a City Councilor of Koronadal who has authored ordinances on livelihood and local culture.',
    legislation: [
      {
        title: 'Comprehensive Livelihood Program Code of the City of Koronadal',
        role: 'authored',
        summary:
          'Institutionalizes a comprehensive livelihood program for the city.',
        status: 'Enacted',
        sources: [
          {
            label:
              'City Government of Koronadal — City institutionalizes Comprehensive Livelihood Program Code',
            href: 'https://koronadal.gov.ph/2026/01/29/city-of-koronadal-institutionalizes-comprehensive-livelihood-program-code/',
          },
        ],
      },
      {
        title: 'Ordinance institutionalizing the Hinugyaw Festival',
        role: 'authored',
        summary:
          'Institutionalizes the “Siyudad ng Koronadal Hinugyaw Festival” as the city’s official festival.',
        status: 'Enacted',
        sources: [
          {
            label:
              'City Government of Koronadal — 8th Sanggunian passes key ordinances in their final stretch',
            href: 'https://koronadal.gov.ph/2025/07/04/8th-sanggunian-passes-key-ordinances-in-their-final-stretch/',
          },
        ],
      },
    ],
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
  },
];

// Flat list of every official, used by the city officials page and the site
// search index.
export const allOfficials: Official[] = [
  ...executives,
  ...councilors,
  ...exOfficio,
];

/** Look up a single city official by profile slug. */
export function getCityOfficial(slug: string): Official | undefined {
  return allOfficials.find(o => o.slug === slug);
}
