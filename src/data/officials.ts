export interface Official {
  name: string;
  position: string;
  photo: string;
}

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
  },
  {
    name: 'Hon. Bernardo B. Hinay',
    position: 'City Councilor',
    photo: '/officials/hinay.png',
  },
  {
    name: 'Hon. John Rey P. Rodriguez',
    position: 'City Councilor',
    photo: '/officials/rodriguez.png',
  },
  {
    name: 'Hon. Ellen Grace N. Subere-Albios',
    position: 'City Councilor',
    photo: '/officials/subere-albios.png',
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
