// Statistics data for the City of Koronadal (Marbel).
//
// Every figure here is sourced and dated. Re-verify against the cited primary
// source when a new census, CMCI edition, or BLGF Statement of Receipts and
// Expenditures (SRE) is released. Do NOT add unsourced numbers — this is a
// government information portal and accuracy is the whole point.
//
// Sources:
//   - PSA Census of Population (philatlas.com mirror, Wikipedia "Koronadal")
//   - DTI Cities and Municipalities Competitiveness Index (cmci.dti.gov.ph)
//   - Bureau of Local Government Finance — SRE (blgf.gov.ph; philatlas history)

// ---------------------------------------------------------------------------
// Demographics
// ---------------------------------------------------------------------------

export interface CensusPoint {
  year: number;
  population: number;
}

/** Total city population by PSA census year. */
export const censusHistory: CensusPoint[] = [
  { year: 2000, population: 133786 },
  { year: 2007, population: 149622 },
  { year: 2010, population: 158273 },
  { year: 2015, population: 174942 },
  { year: 2020, population: 195398 },
  { year: 2024, population: 201844 },
];

export interface GrowthRate {
  period: string;
  /** Average annual population growth rate, in percent. */
  rate: number;
}

/** PSA-reported average annual growth rate per intercensal period. */
export const growthRates: GrowthRate[] = [
  { period: '2000–2007', rate: 1.55 },
  { period: '2007–2010', rate: 2.07 },
  { period: '2010–2015', rate: 1.92 },
  { period: '2015–2020', rate: 2.35 },
  { period: '2020–2024', rate: 0.78 },
];

export interface BarangayPopulation {
  name: string;
  population: number;
}

/**
 * Population of each of Koronadal's 27 barangays, 2020 PSA Census.
 * The figures sum to exactly 195,398 (the official 2020 city total).
 * Per-barangay 2024 figures have not been published.
 */
export const barangayPopulations: BarangayPopulation[] = [
  { name: 'Assumption', population: 2291 },
  { name: 'Avanceña', population: 4618 },
  { name: 'Cacub', population: 2725 },
  { name: 'Caloocan', population: 5159 },
  { name: 'Carpenter Hill', population: 7652 },
  { name: 'Concepcion', population: 5818 },
  { name: 'Esperanza', population: 1942 },
  { name: 'General Paulino Santos', population: 23242 },
  { name: 'Mabini', population: 4057 },
  { name: 'Magsaysay', population: 3266 },
  { name: 'Mambucal', population: 1269 },
  { name: 'Morales', population: 9133 },
  { name: 'Namnama', population: 4245 },
  { name: 'New Pangasinan', population: 4321 },
  { name: 'Paraiso', population: 6631 },
  { name: 'Rotonda', population: 4369 },
  { name: 'San Isidro', population: 8421 },
  { name: 'San Jose', population: 8750 },
  { name: 'San Roque', population: 4476 },
  { name: 'Santa Cruz', population: 18724 },
  { name: 'Santo Niño', population: 16062 },
  { name: 'Sarabia', population: 9420 },
  { name: 'Zone I', population: 4125 },
  { name: 'Zone II', population: 3999 },
  { name: 'Zone III', population: 13013 },
  { name: 'Zone IV', population: 7856 },
  { name: 'Zulueta', population: 9814 },
];

export const demographics = {
  /** Latest census total. */
  population2024: 201844,
  population2020: 195398,
  /** Latest annual growth rate (2020–2024). */
  annualGrowth: 0.78,
  barangayCount: 27,
  /** Households, 2024 PSA census. */
  households2024: 50814,
  /** Land area in km². */
  landArea: 277.0,
  /** Population density, residents per km² (2024). */
  density2024: Math.round(201844 / 277),
  /** Share of South Cotabato's 1,010,009 residents (2024). */
  provinceShare: 20.0,
};

// ---------------------------------------------------------------------------
// Competitiveness — DTI CMCI (2024 edition, latest)
// ---------------------------------------------------------------------------

export interface CmciPillar {
  name: string;
  /** 2024 pillar score (each pillar weighted 20%). */
  score2024: number;
  /** 2023 pillar score, for the trend chart. */
  score2023: number;
  /** National rank among component cities, 2024. */
  rank: number;
}

export const cmci = {
  edition: 2024,
  overallScore: 41.16,
  rank: 31,
  totalRanked: 116,
  classification: 'Component City',
  previousRank: 32, // 2023
  pillars: [
    {
      name: 'Economic Dynamism',
      score2024: 4.4822,
      score2023: 3.9368,
      rank: 48,
    },
    {
      name: 'Government Efficiency',
      score2024: 11.193,
      score2023: 9.8797,
      rank: 22,
    },
    {
      name: 'Infrastructure',
      score2024: 4.6127,
      score2023: 4.7643,
      rank: 46,
    },
    { name: 'Resiliency', score2024: 12.696, score2023: 12.787, rank: 9 },
    { name: 'Innovation', score2024: 8.1714, score2023: 7.4584, rank: 38 },
  ] as CmciPillar[],
  /** Sub-indicators where Koronadal ranked 1st nationally (2024). */
  topStrengths: [
    'Compliance to National Directives',
    'Presence of an Investment Promotion Unit',
    'Getting Business Permits',
  ],
};

// ---------------------------------------------------------------------------
// Municipal Income — BLGF Statement of Receipts and Expenditures
// ---------------------------------------------------------------------------

export interface IncomePoint {
  year: number;
  /** Amount in pesos. */
  amount: number;
  /** Reporting basis, since older years use "annual regular income". */
  basis: 'Annual regular income' | 'Total revenue';
}

/**
 * Annual income across available BLGF years. Note the basis differs: figures
 * through 2016 are "annual regular income"; the 2024 figure is total revenue
 * per the BLGF SRE. They are not strictly comparable but show the long trend.
 */
export const incomeHistory: IncomePoint[] = [
  { year: 2009, amount: 433000000, basis: 'Annual regular income' },
  { year: 2015, amount: 662544545, basis: 'Annual regular income' },
  { year: 2016, amount: 720036615, basis: 'Annual regular income' },
  { year: 2024, amount: 1557000000, basis: 'Total revenue' },
];

export const income = {
  fiscalYear: 2024,
  /** Total revenue, FY 2024 (BLGF SRE), in pesos. */
  totalRevenue: 1557000000,
  incomeClass: '1st-class city',
  /** Revenue per resident, FY2024 ÷ 2024 population. */
  perCapita: Math.round(1557000000 / 201844),
};
