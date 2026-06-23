// South Cotabato provincial officials — profile directory data.
//
// This powers /provincial-officials (a directory of cards) and
// /provincial-officials/:slug (a full profile sub-page each).
//
// IMPORTANT (civic accuracy): every entry should be backed by `sources`, and
// `verified` should reflect whether we could confirm the person currently
// holds this seat. Re-verify after every election or succession. To add
// declared candidates for a future election, you can reuse this same shape —
// just set `verified: false` and note the election in `bio`/`notableNotes`.

export interface OfficialSource {
  label: string;
  href: string;
}

export interface CourtCase {
  /** Short title of the case or matter. */
  title: string;
  /** What the case is about, in neutral language. */
  summary: string;
  /** Where it stands: 'alleged' | 'filed' | 'pending' | 'dismissed' | 'acquitted' | 'convicted' | 'settled'. */
  status: CaseStatus;
  /** Court / body and year, if known. */
  forum?: string | null;
  /** Citations — REQUIRED for any case to be shown. */
  sources: OfficialSource[];
}

export type CaseStatus =
  | 'alleged'
  | 'filed'
  | 'pending'
  | 'dismissed'
  | 'acquitted'
  | 'convicted'
  | 'settled';

export interface Legislation {
  /** Bill/law title or number, e.g. "RA 11804" or "House Bill 1234". */
  title: string;
  /** This official's role in the measure. */
  role: LegislationRole;
  /** Short, neutral description of what the measure does. */
  summary?: string;
  /** Where it stands, e.g. "Enacted (RA 11804)" or "Pending, 20th Congress". */
  status?: string | null;
  /** Citations — REQUIRED for any measure to be shown. */
  sources: OfficialSource[];
}

export type LegislationRole =
  | 'authored'
  | 'co-authored'
  | 'sponsored'
  | 'supported';

export interface ProvincialOfficial {
  /** kebab-case, used in the URL: /provincial-officials/:slug */
  slug: string;
  /** Full name, nickname in quotes per Filipino political convention. */
  name: string;
  /** Title, e.g. "Governor" or "Provincial Board Member". */
  position: string;
  /** District where relevant (e.g. "1st District"), otherwise null. */
  district?: string | null;
  /** Party / coalition affiliation, if known. */
  party?: string | null;
  /** Optional portrait path under /public. Falls back to an initials avatar. */
  photo?: string | null;
  /** 1–3 sentence biography. */
  bio: string;
  /** Concrete, sourced achievements or programs. */
  achievements: string[];
  /** Laws / measures authored, co-authored, sponsored, or supported. */
  legislation?: Legislation[];
  /** Interesting facts, firsts, well-documented context. */
  notableNotes: string[];
  /**
   * Negative / critical notes: documented controversies, criticism, adverse
   * findings. Each MUST be backed by a citation in `sources`. State as
   * documented fact only; frame anything unproven as an allegation.
   */
  concerns: string[];
  /**
   * Court cases / legal matters. Only include with citations. Use neutral
   * language and an accurate `status`; presumption of innocence applies until
   * a final ruling.
   */
  courtCases: CourtCase[];
  /** Citations backing the profile. */
  sources: OfficialSource[];
  /** True if we could confirm this person currently holds this seat. */
  verified: boolean;
  /** Display grouping key; controls the section a card appears under. */
  group: OfficialGroup;
}

export type OfficialGroup =
  | 'executive'
  | 'congressional'
  | 'board-1st'
  | 'board-2nd';

// Ordered groups for the directory page. `title` keys resolve via i18n with an
// English fallback baked in here for safety.
export const officialGroups: { key: OfficialGroup; title: string }[] = [
  { key: 'executive', title: 'Provincial Executives' },
  { key: 'congressional', title: 'Congressional Representatives' },
  { key: 'board-1st', title: 'Provincial Board — 1st District' },
  { key: 'board-2nd', title: 'Provincial Board — 2nd District' },
];

// The term these officials are serving.
export const provincialTerm = '2025–2028';

// Verified against reputable sources (Inquirer, MindaNews, Rappler, Wikipedia,
// House of Representatives, official provincial site) — June 2026 research pass.
// NOTE: South Cotabato was reapportioned into THREE congressional districts by
// RA 11804 effective 2025; Koronadal City is now in the 2nd District. The 3rd
// District (rep. and board members) is not yet listed pending verification.
export const provincialOfficials: ProvincialOfficial[] = [
  {
    slug: 'reynaldo-tamayo-jr',
    name: 'Reynaldo "Rey" S. Tamayo Jr.',
    position: 'Governor',
    district: null,
    party: 'Partido Federal ng Pilipinas (PFP)',
    photo: null,
    bio: 'Reynaldo Tamayo Jr. (b. February 9, 1980) has been Governor of South Cotabato since 2019, after serving as Mayor of Tupi from 2010 to 2019. He won a landslide re-election on May 12, 2025 for his third gubernatorial term, defeating Shine Miguel (Aksyon Demokratiko). He is the son of former congressman Reynaldo Tamayo Sr.',
    achievements: [
      'Won the 2025 gubernatorial race with about 346,611 votes (~69.7%), roughly 200,000 votes ahead of his closest rival.',
      'Led South Cotabato to earn the Seal of Good Local Governance (SGLG) in 2023 and 2024.',
      'Championed flagship provincial programs including a Free Education Program, a Free Hospitalization Program, and a Consolidated Rice Farming and Mechanization Program.',
      'Serves as National President of the League of Provinces of the Philippines (LPP) and National Chairman of the Union of Local Authorities of the Philippines (ULAP).',
    ],
    notableNotes: [
      'National President of Partido Federal ng Pilipinas (PFP), the party of President Ferdinand "Bongbong" Marcos Jr.; the Supreme Court affirmed his presidency of the party.',
      'Reportedly became governor at age 39, the youngest in the province’s history.',
    ],
    concerns: [],
    courtCases: [
      {
        title: 'PFP party-leadership dispute',
        summary:
          'A rival faction within the ruling Partido Federal ng Pilipinas contested Tamayo’s party presidency — an internal party-leadership matter, not a criminal or graft case. The Supreme Court ruled in his favor, affirming the COMELEC’s recognition of him as PFP National President under the party’s 2022 constitution.',
        status: 'dismissed',
        forum: 'Supreme Court (affirming COMELEC), Aug 2025',
        sources: [
          {
            label: 'GMA News — SC affirms Tamayo presidency of PFP',
            href: 'https://www.gmanetwork.com/news/topstories/nation/952323/sc-reynaldo-tamayo-marcos-partido-federal-ng-pilipinas/story/',
          },
          {
            label:
              'South Cotabato — SC affirms recognition of Gov. Tamayo as PFP President',
            href: 'https://southcotabato.gov.ph/supreme-court-affirms-recognition-of-gov-tamayo-as-pfp-president/',
          },
        ],
      },
      {
        title: '2025 gubernatorial election protest (Miguel v. Tamayo)',
        summary:
          'Defeated candidate Shine Miguel filed an election protest alleging fraud and irregularities in the May 2025 election. The COMELEC First Division summarily dismissed the protest in May 2026 for failing to comply with mandatory requirements under the COMELEC rules. Tamayo was the respondent (winner), not the protestant.',
        status: 'dismissed',
        forum: 'COMELEC First Division, May 2026',
        sources: [
          {
            label:
              'Politiko Mindanao — Comelec junks poll protest vs Gov. Tamayo',
            href: 'https://mindanao.politiko.com.ph/governor-reynaldo-tamayo-jr-election-protest-dismissed-comelec/',
          },
          {
            label:
              'South Cotabato — Gov. Tamayo wins legal battle against election protest',
            href: 'https://southcotabato.gov.ph/gov-tamayo-wins-legal-battle-against-election-protest/',
          },
        ],
      },
    ],
    sources: [
      {
        label:
          'Inquirer — Admin party head wins reelection as South Cotabato governor',
        href: 'https://www.inquirer.net/443233/admin-party-head-wins-reelection-as-south-cotabato-governor/',
      },
      {
        label: 'MindaNews — Gov. Tamayo, other winners proclaimed',
        href: 'https://mindanews.com/top-stories/2025/05/gov-tamayo-other-winners-in-south-cotabato-proclaimed/',
      },
      {
        label: 'Wikipedia — Reynaldo Tamayo Jr.',
        href: 'https://en.wikipedia.org/wiki/Reynaldo_Tamayo_Jr.',
      },
    ],
    verified: true,
    group: 'executive',
  },
  {
    slug: 'arthur-pingoy-jr',
    name: 'Arthur "Dodo" Y. Pingoy Jr.',
    position: 'Vice Governor',
    district: null,
    party: 'Partido Federal ng Pilipinas (PFP)',
    photo: null,
    bio: 'Arthur Pingoy Jr. is the Vice Governor of South Cotabato, first elected in 2022 as Governor Tamayo’s running mate and re-elected unopposed in the May 12, 2025 elections for a second term. As Vice Governor he presides over the Sangguniang Panlalawigan (Provincial Board).',
    achievements: [
      'Re-elected Vice Governor unopposed in 2025, receiving about 331,376 votes.',
      'Presides over the Sangguniang Panlalawigan, which approved a P3.89-billion 2026 provincial budget and a P77.25-million supplemental budget for 2025 priority projects.',
    ],
    legislation: [
      {
        title: 'Republic Act No. 9850',
        role: 'authored',
        summary:
          'Declares Arnis as the national martial art and sport of the Philippines (from his House Bill No. 6516). Authored during his term as 2nd District Representative.',
        status: 'Enacted (RA 9850, 2009)',
        sources: [
          {
            label: 'RA 9850 (Supreme Court E-Library)',
            href: 'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/2/17260',
          },
          {
            label: 'House Bill No. 6516, 14th Congress (Senate LRB)',
            href: 'https://issuances-library.senate.gov.ph/bills/house-bill-no-6516-14th-congress-republic',
          },
        ],
      },
      {
        title: 'Republic Act No. 9711',
        role: 'co-authored',
        summary:
          'The Food and Drug Administration (FDA) Act of 2009, which strengthened and renamed the former Bureau of Food and Drugs as the FDA.',
        status: 'Enacted (RA 9711, 2009)',
        sources: [
          {
            label: 'Pingoy author profile (Senate LRB)',
            href: 'https://issuances-library.senate.gov.ph/congress-author/pingoy-arthur-dodo-jr-y-md',
          },
          {
            label: 'RA 9711 (Chan Robles)',
            href: 'https://www.chanrobles.com/republicacts/republicactno9711_pdf.php',
          },
        ],
      },
      {
        title: 'Republic Act No. 9502',
        role: 'co-authored',
        summary:
          'The Universally Accessible Cheaper and Quality Medicines Act of 2008 (principal authorship credited to others).',
        status: 'Enacted (RA 9502, 2008)',
        sources: [
          {
            label: 'Pingoy author profile (Senate LRB)',
            href: 'https://issuances-library.senate.gov.ph/congress-author/pingoy-arthur-dodo-jr-y-md',
          },
          {
            label: 'RA 9502 (LawPhil)',
            href: 'https://lawphil.net/statutes/repacts/ra2008/ra_9502_2008.html',
          },
        ],
      },
    ],
    notableNotes: [
      'Ran unopposed in 2025, reflecting PFP’s dominance in the province.',
    ],
    concerns: [
      'As 2nd District Representative of South Cotabato (2007–2010), Pingoy was named in the Priority Development Assistance Fund (PDAF / "pork barrel") scam linked to Janet Lim Napoles, with allegations that part of his 2007–2008 PDAF was coursed through Napoles-linked NGOs. He denied wrongdoing and was acquitted by the Sandiganbayan in 2023.',
    ],
    courtCases: [
      {
        title:
          'People v. Arthur Yusay Pingoy Jr., et al. (PDAF / pork barrel scam)',
        summary:
          'The Ombudsman charged Pingoy in 2016 with graft (RA 3019 Sec. 3(e)), malversation, and bribery over alleged misuse of about P20.91 million of his 2007–2008 PDAF via Napoles-linked NGOs. He pleaded not guilty. On October 20, 2023, the Sandiganbayan Special Second Division acquitted him for insufficient evidence that he received kickbacks.',
        status: 'acquitted',
        forum: 'Sandiganbayan Special Second Division, 2023 (charged 2016)',
        sources: [
          {
            label:
              'Office of the Ombudsman — charges vs ex-Rep. Pingoy, Napoles for PDAF scam',
            href: 'https://www.ombudsman.gov.ph/ombudsman-charges-ex-rep-pingoy-napoles-for-pdaf-scam/',
          },
          {
            label: 'Sandiganbayan decision (SB-16-CRM-0254 to 0263)',
            href: 'https://sb.judiciary.gov.ph/wp-content/uploads/2024/04/J_Crim_SB-16-CRM-0254-to-0263_People-vs-Arthur-Yusay-Pingoy-Jr-et-al_10_20_2023-compressed.pdf',
          },
        ],
      },
    ],
    sources: [
      {
        label: 'Inquirer — South Cotabato gov gets reelected',
        href: 'https://newsinfo.inquirer.net/1596280/south-cotabato-gov-gets-reelected',
      },
      {
        label: 'South Cotabato Provincial Government — Provincial Officials',
        href: 'https://southcotabato.gov.ph/provincial-officials/',
      },
    ],
    verified: true,
    group: 'executive',
  },
  {
    slug: 'isidro-lumayag',
    name: 'Isidro "Ed" D. Lumayag',
    position: 'Representative, 1st District',
    district: '1st District (Polomolok, Tampakan, Tupi)',
    party: 'Partido Federal ng Pilipinas (PFP)',
    photo: null,
    bio: 'Isidro D. Lumayag represents South Cotabato’s 1st Congressional District in the 20th Congress (2025–2028). First elected to the House in 2022 under PFP, he won re-election in the May 12, 2025 elections. His district covers Polomolok, Tampakan, and Tupi.',
    achievements: [
      'Won re-election as 1st District Representative in the May 12, 2025 polls.',
      'Authored district-focused legislation, including bills to relocate the South Cotabato 1st District Engineering Office to Tupi, create Barangay Pagalungan in Polomolok, and convert certain provincial roads into national roads.',
    ],
    legislation: [
      {
        title:
          'House Bill — DPWH South Cotabato 1st District Engineering Office relocation',
        role: 'authored',
        summary:
          'Transfers the DPWH South Cotabato 1st District Engineering Office from Lagao, General Santos City to Tupi, South Cotabato, and appropriates funds.',
        status:
          'Passed the House in 2023 (19th Congress); pending in the Senate',
        sources: [
          {
            label: 'Lumayag member page (House of Representatives)',
            href: 'https://www.congress.gov.ph/house-members/',
          },
          {
            label: 'Engineering district office subject index (Senate LRB)',
            href: 'https://issuances-library.senate.gov.ph/subject/engineering-district-office',
          },
        ],
      },
      {
        title: 'House Bill No. 4611 — road conversion (1st District)',
        role: 'authored',
        summary:
          'Converts several provincial roads in the 1st District (including Banga-Tupi-Malungon and Polomolok-Miasong-Malungon) into national roads.',
        status: 'Filed, 19th Congress (pending)',
        sources: [
          {
            label: 'House Bill No. 4611, 19th Congress (Senate LRB)',
            href: 'https://ldr.senate.gov.ph/bills/house-bill-no-4611-19th-congress',
          },
        ],
      },
      {
        title: 'House Bill No. 4610 — creation of Barangay Pagalungan',
        role: 'authored',
        summary:
          'Officially creates Barangay Pagalungan in the Municipality of Polomolok, South Cotabato.',
        status: 'Filed, 19th Congress (pending)',
        sources: [
          {
            label: 'House Bill No. 4610, 19th Congress (Senate LRB)',
            href: 'https://ldr.senate.gov.ph/bills/house-bill-no-4610-19th-congress',
          },
        ],
      },
      {
        title: 'House Bill No. 4487 — TESDA district office (1st District)',
        role: 'authored',
        summary:
          'Creates a TESDA district office for the 1st Legislative District of South Cotabato, to be established in Polomolok, and appropriates funds.',
        status: 'Filed, 19th Congress (pending)',
        sources: [
          {
            label: 'Lumayag authored bills (House of Representatives)',
            href: 'https://www.congress.gov.ph/house-members/',
          },
        ],
      },
    ],
    notableNotes: [
      'His district was reconfigured by RA 11804: General Santos City became a separate lone district and the province was split into three districts effective 2025.',
    ],
    concerns: [],
    courtCases: [],
    sources: [
      {
        label: "Wikipedia — South Cotabato's 1st congressional district",
        href: 'https://en.wikipedia.org/wiki/South_Cotabato%27s_1st_congressional_district',
      },
      {
        label: 'House of Representatives — Member profile',
        href: 'https://www.congress.gov.ph/house-members/',
      },
    ],
    verified: true,
    group: 'congressional',
  },
  {
    slug: 'ferdinand-hernandez',
    name: 'Ferdinand "Dinand" L. Hernandez',
    position: 'Representative, 2nd District',
    district: '2nd District (Koronadal City, Banga, Tantangan)',
    party: 'Partido Federal ng Pilipinas (PFP)',
    photo: null,
    bio: 'Ferdinand "Dinand" L. Hernandez is a lawyer and the Representative for South Cotabato’s 2nd Congressional District, which includes Koronadal City. He previously held this seat for three consecutive terms (2013–2022), ran for governor in 2022 (losing to Tamayo), and reclaimed the seat in the May 12, 2025 elections.',
    achievements: [
      'Reclaimed the 2nd District congressional seat in the 2025 elections after a three-year hiatus.',
      'Elected Senior Deputy Speaker of the House of Representatives on November 19, 2025.',
      'Previously served as a Deputy Speaker of the House (2019–2022).',
    ],
    legislation: [
      {
        title: 'Republic Act No. 11804',
        role: 'authored',
        summary:
          'Reapportions South Cotabato into three legislative districts and separates General Santos City into its own lone district (from his House Bill No. 10021).',
        status: 'Enacted (RA 11804, 2022)',
        sources: [
          {
            label: 'RA 11804 (Supreme Court E-Library)',
            href: 'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/2/95251',
          },
          {
            label: 'Legislative districts of South Cotabato (Wikipedia)',
            href: 'https://en.wikipedia.org/wiki/Legislative_districts_of_South_Cotabato',
          },
        ],
      },
      {
        title: 'Republic Act No. 11102',
        role: 'authored',
        summary:
          'Establishes the SOCCSKSARGEN General Hospital in Surallah, South Cotabato, and appropriates funds for it.',
        status: 'Enacted (RA 11102, 2018)',
        sources: [
          {
            label: 'RA 11102 (Supreme Court E-Library)',
            href: 'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/2/85260',
          },
          {
            label: 'RA 11102 (LawPhil)',
            href: 'https://lawphil.net/statutes/repacts/ra2018/ra_11102_2018.html',
          },
        ],
      },
      {
        title: 'Republic Act No. 11150',
        role: 'authored',
        summary:
          'Establishes the South Cotabato State College in Surallah by integrating the Surallah National Agricultural School, and appropriates funds for it.',
        status: 'Enacted (RA 11150, 2018)',
        sources: [
          {
            label: 'RA 11150 (LawPhil)',
            href: 'https://lawphil.net/statutes/repacts/ra2018/ra_11150_2018.html',
          },
        ],
      },
    ],
    notableNotes: [
      'Represents the district that contains Koronadal City, the provincial capital.',
      'A licensed lawyer and among the most senior figures in House leadership for the 20th Congress.',
    ],
    concerns: [
      'In 2019 social-media posts, blogger-lawyer Berteni Causing accused Hernandez of misusing funds intended for Marawi siege victims. The accusation was never adjudicated as true in any court; Hernandez denied it and instead filed a cyber libel complaint against Causing. It remains an unproven allegation.',
    ],
    courtCases: [
      {
        title:
          'Causing v. People (cyber libel arising from allegations against Rep. Hernandez)',
        summary:
          'Hernandez was the private complainant (not the accused) in a cyber libel case he filed in December 2020 against blogger Berteni Causing over 2019 posts. The Supreme Court (G.R. No. 258524) addressed the prescription question, holding cyber libel prescribes one year from discovery. The underlying allegation against Hernandez was never proven and he disputes it.',
        status: 'pending',
        forum:
          'Supreme Court (G.R. No. 258524); originating from Quezon City RTC',
        sources: [
          {
            label:
              'Rappler — SC decision, Causing v. People (cyber libel prescription)',
            href: 'https://www.rappler.com/philippines/supreme-court-decision-cyber-libel-causing-versus-people/',
          },
          {
            label:
              'Supreme Court — Cyber libel prescribes one year from discovery',
            href: 'https://sc.judiciary.gov.ph/sc-affirms-cyber-libel-prescribes-one-year-from-discovery/',
          },
        ],
      },
    ],
    sources: [
      {
        label: 'Rappler — Ferdinand Hernandez elected senior deputy speaker',
        href: 'https://www.rappler.com/philippines/south-cotabato-ferdinand-hernandez-elected-senior-deputy-speaker-november-2025/',
      },
      {
        label: 'Wikipedia — Dinand Hernandez',
        href: 'https://en.wikipedia.org/wiki/Dinand_Hernandez',
      },
    ],
    verified: true,
    group: 'congressional',
  },
  {
    slug: 'rubi-hatulan',
    name: 'Rubi Hatulan',
    position: 'Provincial Board Member',
    district: '1st District (Polomolok, Tampakan, Tupi)',
    party: 'Partido Federal ng Pilipinas (PFP)',
    photo: null,
    bio: 'Rubi Hatulan was elected as a Sangguniang Panlalawigan (Provincial Board) member for the 1st District of South Cotabato in the May 12, 2025 elections, taking oath on June 30, 2025.',
    achievements: [
      'Topped the 1st District provincial board race with about 70,779 votes (~21.5%) in 2025.',
    ],
    notableNotes: [
      'Part of the PFP slate that swept all elected provincial board seats in 2025.',
    ],
    concerns: [],
    courtCases: [],
    sources: [
      {
        label: 'Wikipedia — 2025 Philippine local elections in Soccsksargen',
        href: 'https://en.wikipedia.org/wiki/2025_Philippine_local_elections_in_Soccsksargen',
      },
      {
        label: 'South Cotabato News — Officials Take Oath of Office',
        href: 'https://www.southcotabatonews.com/2025/07/south-cotabato-officials-take-oath-of.html',
      },
    ],
    verified: true,
    group: 'board-1st',
  },
  {
    slug: 'bebot-escobillo',
    name: 'Noel "Bebot" J. Escobillo',
    position: 'Provincial Board Member',
    district: '1st District (Polomolok, Tampakan, Tupi)',
    party: 'Partido Federal ng Pilipinas (PFP)',
    photo: null,
    bio: 'Noel "Bebot" Escobillo is an incumbent Sangguniang Panlalawigan member for the 1st District of South Cotabato, re-elected in the May 12, 2025 elections and sworn in on June 30, 2025.',
    achievements: [
      'Re-elected to the 1st District provincial board with about 68,731 votes (~20.8%) in 2025.',
    ],
    notableNotes: [],
    concerns: [],
    courtCases: [],
    sources: [
      {
        label: 'Wikipedia — 2025 Philippine local elections in Soccsksargen',
        href: 'https://en.wikipedia.org/wiki/2025_Philippine_local_elections_in_Soccsksargen',
      },
    ],
    verified: true,
    group: 'board-1st',
  },
  {
    slug: 'nilda-almencion',
    name: 'Nilda Almencion',
    position: 'Provincial Board Member',
    district: '1st District (Polomolok, Tampakan, Tupi)',
    party: 'Partido Federal ng Pilipinas (PFP)',
    photo: null,
    bio: 'Nilda Almencion is an incumbent Sangguniang Panlalawigan member for the 1st District of South Cotabato, re-elected in the May 12, 2025 elections and sworn in on June 30, 2025.',
    achievements: [
      'Re-elected to the 1st District provincial board with about 67,270 votes (~20.4%) in 2025.',
    ],
    legislation: [
      {
        title: 'South Cotabato supplemental budget ordinance (P295-M)',
        role: 'sponsored',
        summary:
          'Sponsored a supplemental budget ordinance allocating about P295 million for personnel wage increases and development programs, approved unanimously by the Sangguniang Panlalawigan.',
        status: 'Approved by the South Cotabato Provincial Board',
        sources: [
          {
            label:
              'South Cotabato approves P295-M supplemental budget (Provincial Government)',
            href: 'https://southcotabato.gov.ph/south-cotabato-approves-%E2%82%B1295-m-supplemental-budget-for-wage-increase-and-development-programs/',
          },
        ],
      },
    ],
    notableNotes: [],
    concerns: [],
    courtCases: [],
    sources: [
      {
        label: 'Wikipedia — 2025 Philippine local elections in Soccsksargen',
        href: 'https://en.wikipedia.org/wiki/2025_Philippine_local_elections_in_Soccsksargen',
      },
    ],
    verified: true,
    group: 'board-1st',
  },
  {
    slug: 'annabelle-pingoy',
    name: 'Annabelle Pingoy',
    position: 'Provincial Board Member',
    district: '2nd District (Koronadal City, Banga, Tantangan)',
    party: 'Partido Federal ng Pilipinas (PFP)',
    photo: null,
    bio: 'Annabelle Pingoy was elected as a Sangguniang Panlalawigan member for the 2nd District of South Cotabato (which includes Koronadal City) in the May 12, 2025 elections, taking oath on June 30, 2025.',
    achievements: [
      'Topped the 2nd District provincial board race with about 111,803 votes (~29.1%) in 2025.',
    ],
    legislation: [
      {
        title:
          'Resolution on revised wage rates for Job Order (JO) and Contract of Service (COS) personnel',
        role: 'sponsored',
        summary:
          'As Chairperson of the Committee on Civil Service, led the provincial board deliberations on revised wage rates for JO/COS personnel and the creation of new COS positions.',
        status: 'Reported pending final reading (~2026)',
        sources: [
          {
            label:
              'South Cotabato — Resolution seeking salary increase for JO and COS personnel',
            href: 'https://southcotabato.gov.ph/resolution-seeking-salary-increase-for-job-order-and-contract-of-service-personnel-in-south-cotabato-expected-to-be-approved-on-june-1-and-take-effectively-on-july-1/',
          },
        ],
      },
    ],
    notableNotes: [
      'Before joining the provincial board, she served as a Koronadal City Councilor, where she co-authored the city’s Enhanced I-Governance Ordinance.',
    ],
    concerns: [],
    courtCases: [],
    sources: [
      {
        label: 'Wikipedia — 2025 Philippine local elections in Soccsksargen',
        href: 'https://en.wikipedia.org/wiki/2025_Philippine_local_elections_in_Soccsksargen',
      },
      {
        label: 'MindaNews — Gov. Tamayo, other winners proclaimed',
        href: 'https://mindanews.com/top-stories/2025/05/gov-tamayo-other-winners-in-south-cotabato-proclaimed/',
      },
    ],
    verified: true,
    group: 'board-2nd',
  },
  {
    slug: 'junette-hurtado',
    name: 'Junette Hurtado',
    position: 'Provincial Board Member',
    district: '2nd District (Koronadal City, Banga, Tantangan)',
    party: 'Partido Federal ng Pilipinas (PFP)',
    photo: null,
    bio: 'Junette Hurtado is an incumbent Sangguniang Panlalawigan member for the 2nd District of South Cotabato, re-elected in the May 12, 2025 elections and sworn in on June 30, 2025.',
    achievements: [
      'Re-elected to the 2nd District provincial board with about 107,429 votes (~28.0%) in 2025.',
    ],
    notableNotes: [],
    concerns: [],
    courtCases: [],
    sources: [
      {
        label: 'Wikipedia — 2025 Philippine local elections in Soccsksargen',
        href: 'https://en.wikipedia.org/wiki/2025_Philippine_local_elections_in_Soccsksargen',
      },
    ],
    verified: true,
    group: 'board-2nd',
  },
  {
    slug: 'cecile-inday-diel',
    name: 'Cecile "Inday" Diel',
    position: 'Provincial Board Member',
    district: '2nd District (Koronadal City, Banga, Tantangan)',
    party: 'Partido Federal ng Pilipinas (PFP)',
    photo: null,
    bio: 'Cecile "Inday" Diel is an incumbent Sangguniang Panlalawigan member for the 2nd District of South Cotabato, re-elected in the May 12, 2025 elections and sworn in on June 30, 2025.',
    achievements: [
      'Re-elected to the 2nd District provincial board with about 92,376 votes (~24.1%) in 2025.',
    ],
    notableNotes: [],
    concerns: [],
    courtCases: [],
    sources: [
      {
        label: 'Wikipedia — 2025 Philippine local elections in Soccsksargen',
        href: 'https://en.wikipedia.org/wiki/2025_Philippine_local_elections_in_Soccsksargen',
      },
      {
        label: 'South Cotabato News — Officials Take Oath of Office',
        href: 'https://www.southcotabatonews.com/2025/07/south-cotabato-officials-take-oath-of.html',
      },
    ],
    verified: true,
    group: 'board-2nd',
  },
];

/** Look up a single official by slug. */
export function getProvincialOfficial(
  slug: string
): ProvincialOfficial | undefined {
  return provincialOfficials.find(o => o.slug === slug);
}

/** Officials belonging to a display group, in source order. */
export function officialsInGroup(group: OfficialGroup): ProvincialOfficial[] {
  return provincialOfficials.filter(o => o.group === group);
}
