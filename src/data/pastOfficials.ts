// Former (no longer in office) Koronadal city and South Cotabato provincial
// officials, plus their researched contributions and any documented court
// cases. Feeds the historical officials registry (see officialsRegistry.ts).
//
// Civic accuracy: every entry should be sourced and `verified` set honestly.
// Court cases use neutral language and accurate status; presumption of
// innocence applies. Most former local officials will have no documented
// court cases — empty is the expected, correct result.

import type {
  Legislation,
  CourtCase,
  OfficialSource,
} from './provincialOfficials';

export type GovBody = 'City' | 'Province' | 'Congress' | 'Other';

export interface PastTenure {
  body: GovBody;
  position: string;
  /** e.g. "2013–2022". */
  term?: string | null;
}

export interface PastOfficial {
  slug: string;
  name: string;
  photo?: string | null;
  bio?: string;
  tenures: PastTenure[];
  achievements?: string[];
  legislation?: Legislation[];
  notableNotes?: string[];
  concerns?: string[];
  courtCases?: CourtCase[];
  sources?: OfficialSource[];
  /** Whether we could verify they held the office. */
  verified?: boolean;
}

// Populated from June 2026 research (cross-checked against SC E-Library,
// Sandiganbayan, PNA, Rappler, Inquirer, MindaNews, Wikipedia). People who also
// hold a CURRENT office (e.g. Pingoy, Hernandez) are listed here only with their
// FORMER tenures — the registry merges them with their current record by name.
export const pastOfficials: PastOfficial[] = [
  {
    slug: 'fernando-q-miguel',
    name: 'Fernando Q. "Nanding" Miguel',
    tenures: [
      {
        body: 'City',
        position: 'Mayor of Koronadal',
        term: 'until 2010 (led the 2000 cityhood transition)',
      },
    ],
    bio: 'Fernando Q. Miguel led Koronadal through its transition from municipality to component city (RA 8803, 2000) and served as mayor until 2010, when he was succeeded by Peter B. Miguel.',
    achievements: [
      'Held office during the city’s charter transition under RA 8803 (2000).',
    ],
    courtCases: [
      {
        title:
          'Anti-graft conviction — private lawyer for the City Hall land deed',
        summary:
          'The Sandiganbayan found Miguel guilty of violating Sec. 3(e) of RA 3019 for engaging a private lawyer (paid about ₱419,000 by the city in 2004) to notarize the Deed of Sale for the new City Hall site, contrary to COA rules on hiring private counsel. He was sentenced to roughly six to eight years.',
        status: 'convicted',
        forum: 'Sandiganbayan (Crim. Case SB-08-CRM-0018)',
        sources: [
          {
            label:
              'SunStar — Ex-Koronadal mayor convicted for hiring private lawyer',
            href: 'https://www.sunstar.com.ph/more-articles/ex-koronadal-mayor-convicted-for-hiring-private-lawyer',
          },
          {
            label:
              'Politiko — Ex-Koronadal mayor faces six to eight years in jail',
            href: 'https://politiko.com.ph/2015/06/08/ex-koronadal-mayor-faces-six-to-eight-years-in-jail-find-out-why/headlines/',
          },
        ],
      },
      {
        title: 'Graft case — Koronadal public market consultancy',
        summary:
          'A separate graft matter arose from a 1995 public-market consultancy contract; the Ombudsman found probable cause in 1999 and the Supreme Court (G.R. No. 172035, 2012) ruled on his preventive suspension pendente lite. Media reported a conviction, but the final disposition of the merits could not be independently verified here.',
        status: 'pending',
        forum: 'Ombudsman / Sandiganbayan; SC G.R. No. 172035 (suspension)',
        sources: [
          {
            label: 'SC E-Library — G.R. No. 172035 (Miguel v. Sandiganbayan)',
            href: 'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/1/54950',
          },
        ],
      },
    ],
    sources: [
      {
        label: 'City Government of Koronadal — City History',
        href: 'https://koronadal.gov.ph/city-history/',
      },
    ],
    verified: true,
  },
  {
    slug: 'peter-miguel',
    name: 'Dr. Peter B. "Dok Peter" Miguel',
    tenures: [
      { body: 'City', position: 'City Mayor of Koronadal', term: '2010–2019' },
      {
        body: 'City',
        position: 'City Vice Mayor of Koronadal',
        term: '2019–2022',
      },
      {
        body: 'Congress',
        position: 'Representative, 2nd District of South Cotabato',
        term: '2022–2025',
      },
    ],
    bio: 'A physician, Peter B. Miguel served three terms as City Mayor of Koronadal (2010–2019), then City Vice Mayor (2019–2022), and won the 2nd District congressional seat in 2022. He lost his 2025 re-election bid to Ferdinand Hernandez.',
    achievements: [
      'Served three consecutive terms as City Mayor (2010–2019), pursuing infrastructure and health-focused programs.',
      'Known for healthcare advocacy, including medical missions and hospital-support initiatives.',
    ],
    notableNotes: [
      'As Vice Mayor he filed a quo warranto petition seeking to disqualify Mayor Eliordo Ogena; the Supreme Court ultimately ruled COMELEC had jurisdiction and denied the petition (G.R. No. 256053, 2024).',
    ],
    sources: [
      {
        label: 'Rappler — Peter Bascon Miguel profile',
        href: 'https://www.rappler.com/people/p11244599-peter-bascon-miguel/',
      },
      {
        label: 'House of Representatives — Peter B. Miguel',
        href: 'https://www.congress.gov.ph/house-members/',
      },
    ],
    verified: true,
  },
  {
    slug: 'eliordo-u-ogena',
    name: 'Atty. Eliordo U. "Bebot" Ogena',
    tenures: [
      {
        body: 'City',
        position: 'City Mayor of Koronadal',
        term: '2019–2026 (until his death)',
      },
      {
        body: 'City',
        position: 'City Vice Mayor of Koronadal',
        term: '2010–2019',
      },
      {
        body: 'Province',
        position: 'Vice Governor of South Cotabato',
        term: '2001–2010',
      },
    ],
    bio: 'Atty. Eliordo U. Ogena (1953–2026) was a lawyer and long-serving public official — Vice Governor of South Cotabato (2001–2010), City Vice Mayor of Koronadal (2010–2019), and City Mayor of Koronadal from 2019 until his death on March 9, 2026, at age 72.',
    achievements: [
      'As Vice Governor, helped shepherd passage of South Cotabato’s landmark open-pit mining ban.',
      'Won three terms as City Vice Mayor (2010–2019) and was elected and re-elected City Mayor (2019, 2022, 2025).',
    ],
    concerns: [
      'In 2016 the Supreme Court (AC No. 9807) found Ogena, as a lawyer, negligent in his notarial duties and suspended him from law practice for two years and permanently barred him from a notarial commission — the penalty later cited in the quo warranto challenge to his mayoralty.',
    ],
    courtCases: [
      {
        title:
          'Quo warranto challenge to his 2019–2022 mayoral qualification (Miguel v. Ogena)',
        summary:
          'Vice Mayor Peter Miguel petitioned to disqualify Ogena over the 2016 notarial penalty. The RTC first granted, then voided its own ruling for lack of jurisdiction; the Court of Appeals and Supreme Court (G.R. No. 256053, 2024) held COMELEC had exclusive jurisdiction. The petition was ultimately denied and Ogena remained in office.',
        status: 'dismissed',
        forum:
          'RTC Koronadal → Court of Appeals → Supreme Court (G.R. No. 256053)',
        sources: [
          {
            label: 'SC E-Library — G.R. No. 256053 (Miguel v. Ogena, 2024)',
            href: 'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/1/69761',
          },
          {
            label: 'PNA — Court ruling on Koronadal mayor qualification',
            href: 'https://www.pna.gov.ph/articles/1095763',
          },
        ],
      },
    ],
    sources: [
      {
        label: 'MindaNews — Koronadal City Mayor Eliordo Ogena passes away, 72',
        href: 'https://mindanews.com/top-stories/2026/03/koronadal-city-mayor-eliordo-ogena-passes-away-72/',
      },
    ],
    verified: true,
  },
  {
    slug: 'vicente-de-jesus',
    name: 'Vicente "Vic" R. De Jesus',
    tenures: [
      {
        body: 'Province',
        position: 'Vice Governor of South Cotabato',
        term: '2016–2022',
      },
      {
        body: 'City',
        position:
          'Mayor of Koronadal (around the 2000 cityhood transition; dates unverified)',
        term: 'circa 2000',
      },
      {
        body: 'Other',
        position: 'Head, Koronadal City Administrator’s Office (current)',
        term: 'current',
      },
    ],
    bio: 'Vicente R. De Jesus served two terms as Vice Governor of South Cotabato (2016–2022), presiding over the Sangguniang Panlalawigan, before being defeated by Arthur Pingoy Jr. in 2022. He is associated with Koronadal’s cityhood transition and currently heads the City Administrator’s Office. His mayoral term dates are inconsistent across sources.',
    achievements: [
      'Won two terms as Vice Governor of South Cotabato (2016, 2019).',
    ],
    sources: [
      {
        label: 'PeoPlaid — Vicente De Jesus biography',
        href: 'https://peoplaid.com/2020/01/02/vicente-de-jesus/',
      },
    ],
    verified: false,
  },
  {
    slug: 'ismael-sueno',
    name: 'Ismael "Mike" D. Sueño',
    tenures: [
      {
        body: 'Province',
        position: 'Governor of South Cotabato',
        term: '1986–1992 (OIC 1986; elected 1988)',
      },
      {
        body: 'City',
        position: 'Mayor of Koronadal (Marbel)',
        term: '1980–1986',
      },
      { body: 'City', position: 'Vice Mayor of Koronadal', term: '1975–1980' },
      {
        body: 'Other',
        position:
          'Secretary, Dept. of the Interior and Local Government (DILG)',
        term: '2016–2017',
      },
    ],
    bio: 'A Koronadal (Marbel) native, Sueño rose from vice mayor and mayor of his hometown to Officer-in-Charge then elected Governor of South Cotabato after the 1986 People Power Revolution. Decades later he was appointed DILG Secretary by President Duterte, serving 2016–2017.',
    achievements: [
      'As governor pursued reforestation and livelihood programs and imposed a total logging ban in the province.',
      'Confirmed as the 16th DILG Secretary by the Commission on Appointments in December 2016.',
    ],
    concerns: [
      'Dismissed as DILG Secretary by President Duterte on April 4, 2017 citing "loss of trust and confidence," reportedly linked to corruption allegations that were never publicly adjudicated in court.',
    ],
    sources: [
      {
        label: 'GMA News — Sueño fired from DILG post',
        href: 'https://www.gmanetwork.com/news/topstories/nation/605738/sueno-fired-from-dilg-post/story/',
      },
      {
        label: 'Wikipedia — Ismael Sueño',
        href: 'https://en.wikipedia.org/wiki/Ismael_Sueno',
      },
    ],
    verified: true,
  },
  {
    slug: 'hilario-de-pedro-iii',
    name: 'Hilario E. De Pedro III',
    tenures: [
      {
        body: 'Province',
        position: 'Governor of South Cotabato',
        term: '1992–2001',
      },
      {
        body: 'Congress',
        position: 'Representative, 2nd District of South Cotabato',
        term: '1987–1992',
      },
    ],
    bio: 'De Pedro served as 2nd District representative before three terms as Governor of South Cotabato (1992–2001). He died in January 2016 at age 66.',
    achievements: [
      'As a congressman, was a principal co-author of RA 7160 (the Local Government Code of 1991) and author of RA 7079 (the Campus Journalism Act of 1991).',
      'As governor, oversaw the 1992 separation of Sarangani as a new province and backed Koronadal’s push for cityhood.',
      'Served as interim National President of the League of Provinces of the Philippines (2001).',
    ],
    sources: [
      {
        label:
          'MindaNews — Former SouthCot Gov. Hilario de Pedro III passes away',
        href: 'https://mindanews.com/top-stories/2016/01/former-southcot-gov-hilario-de-pedro-iii-passes-away/',
      },
    ],
    verified: true,
  },
  {
    slug: 'daisy-avance-fuentes',
    name: 'Daisy P. Avance-Fuentes',
    tenures: [
      {
        body: 'Province',
        position: 'Governor of South Cotabato',
        term: '2001–2010; 2013–2019',
      },
      {
        body: 'Congress',
        position: 'Representative, 2nd District of South Cotabato',
        term: '1992–2001; 2010–2013',
      },
      {
        body: 'Congress',
        position: 'Deputy Speaker of the House of Representatives',
        term: '1992–2001',
      },
    ],
    bio: 'Avance-Fuentes was the first woman to serve as Deputy Speaker of the Philippine House of Representatives and South Cotabato’s longest-serving modern governor, holding the post across two non-consecutive stretches (2001–2010 and 2013–2019).',
    achievements: [
      'First woman to become Deputy Speaker of the House of Representatives.',
      'Received the 2016 Galing Pook / Jesse Robredo Leadership Award for good governance.',
      'Under her administration South Cotabato ranked among the most competitive provinces (4th in 2014, 3rd in 2015).',
    ],
    sources: [
      {
        label: 'Wikipedia — Daisy Avance Fuentes',
        href: 'https://en.wikipedia.org/wiki/Daisy_Avance_Fuentes',
      },
      {
        label: 'South Cotabato — Awards',
        href: 'https://southcotabato.gov.ph/awards/',
      },
    ],
    verified: true,
  },
  {
    slug: 'arthur-pingoy-jr',
    name: 'Arthur "Dodo" Y. Pingoy Jr.',
    tenures: [
      {
        body: 'Province',
        position: 'Governor of South Cotabato',
        term: '2010–2013',
      },
      {
        body: 'Congress',
        position: 'Representative, 2nd District of South Cotabato',
        term: '2001–2010',
      },
    ],
    bio: 'Before his current role as Vice Governor, the physician Arthur Pingoy Jr. served three terms as 2nd District representative (2001–2010) and one term as Governor of South Cotabato (2010–2013).',
    achievements: [
      'As governor (2010–2013), focused on healthcare and free hospitalization programs for indigent residents.',
    ],
    sources: [
      {
        label: 'PeoPlaid — Arthur Pingoy Jr.',
        href: 'https://peoplaid.com/2023/07/04/arthur-pingoy-jr/',
      },
    ],
    verified: true,
  },
  {
    slug: 'ferdinand-hernandez',
    name: 'Atty. Ferdinand "Dinand" L. Hernandez',
    tenures: [
      {
        body: 'Congress',
        position: 'Representative, 2nd District of South Cotabato',
        term: '2013–2022',
      },
      {
        body: 'Congress',
        position: 'Deputy Speaker of the House of Representatives',
        term: '2016–2022',
      },
    ],
    bio: 'Before returning to Congress in 2025, Hernandez represented South Cotabato’s 2nd District for three terms (2013–2022) and served as a Deputy Speaker. He lost the 2022 gubernatorial race to Gov. Reynaldo Tamayo Jr.',
    achievements: [
      'Served multiple terms as Deputy Speaker of the House (2016–2022).',
    ],
    sources: [
      {
        label: 'Wikipedia — Dinand Hernandez',
        href: 'https://en.wikipedia.org/wiki/Dinand_Hernandez',
      },
    ],
    verified: true,
  },
  {
    slug: 'darlene-antonino-custodio',
    name: 'Darlene R. Antonino-Custodio',
    tenures: [
      {
        body: 'Congress',
        position:
          'Representative, 1st District of South Cotabato (then incl. General Santos)',
        term: '2001–2010',
      },
      {
        body: 'Other',
        position: 'Mayor of General Santos City',
        term: '2010–2013',
      },
    ],
    bio: 'Antonino-Custodio represented South Cotabato’s 1st District — which then included General Santos City — for three terms, serving as House Deputy Minority Leader. She is best known for defeating boxing champion Manny Pacquiao in his first electoral bid in 2007.',
    achievements: [
      'Defeated Manny Pacquiao (his first run for office) by more than 30,000 votes in the 2007 congressional election.',
      'Served as House Deputy Minority Leader in the 13th Congress.',
    ],
    sources: [
      {
        label: 'Wikipedia — Darlene Antonino Custodio',
        href: 'https://en.wikipedia.org/wiki/Darlene_Antonino_Custodio',
      },
    ],
    verified: true,
  },
  {
    slug: 'pedro-acharon-jr',
    name: 'Pedro B. Acharon Jr.',
    tenures: [
      {
        body: 'Congress',
        position:
          'Representative, 1st District of South Cotabato (then incl. General Santos)',
        term: '2010–2019',
      },
      {
        body: 'Other',
        position: 'Mayor of General Santos City',
        term: '2001–2010',
      },
    ],
    bio: 'Acharon served as mayor of General Santos City (2001–2010) and then three terms as South Cotabato 1st District representative (2010–2019). He advocated for General Santos to become a separate congressional district.',
    achievements: [
      'Three-term representative of the 1st District (2010–2019); earlier three-term mayor of General Santos City.',
    ],
    courtCases: [
      {
        title:
          'Graft conviction — ₱2.5-million unliquidated "Tambayayong" festival funds',
        summary:
          'The Sandiganbayan found Acharon and two co-accused guilty of graft over ₱2.5 million in cash advances for a 2006 Los Angeles festival trip that were not properly liquidated; they were sentenced to up to nine years and perpetual disqualification (decision dated September 2020). He had earlier been placed under a 60-day preventive suspension (2016) during the trial.',
        status: 'convicted',
        forum: 'Sandiganbayan (SB-12-CRM-0273), 2020',
        sources: [
          {
            label: 'Inquirer — Ex-Cotabato lawmaker found guilty of graft',
            href: 'https://newsinfo.inquirer.net/1347462/ex-cotabato-congressman-found-guilty-of-graft-2',
          },
          {
            label: 'Sandiganbayan decision (People v. Acharon Jr. et al.)',
            href: 'https://sb.judiciary.gov.ph/wp-content/uploads/2024/06/I_Crim_SB-12-CRM-0273_People-vs-Acharon-Jr-et-al_09_04_2020.pdf',
          },
        ],
      },
      {
        title: 'U.S. junket travel-authority graft case — acquitted',
        summary:
          'In a separate case tied to the travel authorities for the same 2006 trip, the Sandiganbayan acquitted Acharon of graft in March 2017.',
        status: 'acquitted',
        forum: 'Sandiganbayan, 2017',
        sources: [
          {
            label:
              'Rappler — South Cotabato lawmaker acquitted over U.S. junket case',
            href: 'https://www.rappler.com/nation/165421-acharon-acquitted-sandiganbayan-graft/',
          },
        ],
      },
    ],
    sources: [
      {
        label: "Wikipedia — South Cotabato's 1st congressional district",
        href: "https://en.wikipedia.org/wiki/South_Cotabato's_1st_congressional_district",
      },
    ],
    verified: true,
  },
  {
    slug: 'shirlyn-banas-nograles',
    name: 'Shirlyn L. Bañas-Nograles',
    tenures: [
      {
        body: 'Congress',
        position:
          'Representative, 1st District of South Cotabato (then incl. General Santos)',
        term: '2019–2022',
      },
      {
        body: 'Other',
        position: 'Vice Mayor of General Santos City',
        term: '2010–2019',
      },
    ],
    bio: 'Bañas-Nograles served three terms as vice mayor of General Santos before winning the South Cotabato 1st District congressional seat in 2019. She did not seek a second term.',
    achievements: [
      'As vice mayor, implemented a legislative information tracking system and livestreamed council sessions.',
      'As congresswoman, sought to establish a College of Medicine and College of Law at MSU–General Santos.',
    ],
    courtCases: [
      {
        title: 'COMELEC qualification challenge to her 2019 election',
        summary:
          'Her 2019 proclamation was contested; the Supreme Court (G.R. No. 246328) ordered COMELEC to proclaim her as the duly-elected representative, resolving the dispute in her favor. This was an election-qualification matter, not a criminal or graft case.',
        status: 'dismissed',
        forum: 'COMELEC / Supreme Court (G.R. No. 246328)',
        sources: [
          {
            label: 'PNA — SC orders proclamation of Nograles',
            href: 'https://www.pna.gov.ph/index.php/articles/1080993',
          },
        ],
      },
    ],
    sources: [
      {
        label: 'Wikipedia — Shirlyn Bañas-Nograles',
        href: 'https://en.wikipedia.org/wiki/Shirlyn_Ba%C3%B1as-Nograles',
      },
    ],
    verified: true,
  },
  {
    slug: 'luwalhati-antonino',
    name: 'Luwalhati R. Antonino',
    tenures: [
      {
        body: 'Congress',
        position:
          'Representative, 1st District of South Cotabato (then incl. General Santos)',
        term: '1992–2001',
      },
    ],
    bio: 'Antonino represented South Cotabato’s 1st District for three terms (1992–2001), part of the politically prominent Antonino family of the General Santos / South Cotabato area. Biographical details are not fully verified.',
    sources: [
      {
        label: "Wikipedia — South Cotabato's 1st congressional district",
        href: "https://en.wikipedia.org/wiki/South_Cotabato's_1st_congressional_district",
      },
    ],
    verified: false,
  },
];
