#!/usr/bin/env node
//
// refresh-data.mjs — pulls live external data into the repo as JSON so a STATIC
// site can show it. There is no backend: this script runs on a schedule (GitHub
// Actions, see .github/workflows/refresh-data.yml), writes files under
// src/data/generated/, and the resulting commit triggers a redeploy.
//
// Each source is fetched independently and defensively: a failure in one logs a
// warning and keeps the previously-committed file, so one broken upstream never
// blanks the others or fails the whole job.
//
// Run locally with:  node scripts/refresh-data.mjs
// Filter to one source:  node scripts/refresh-data.mjs forex
//
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'src', 'data', 'generated');

// Koronadal lives in South Cotabato, Region XII (SOCCSKSARGEN). These are the
// filters every source is narrowed to.
const CITY = 'KORONADAL';
const PROVINCE = 'SOUTH COTABATO';

const nowIso = () => new Date().toISOString();

async function fetchJson(url, init) {
  const res = await fetch(url, {
    ...init,
    headers: { Accept: 'application/json', ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

// Write only if we actually produced rows; otherwise keep the last-good file.
async function writeOrKeep(name, payload, rowKey) {
  await mkdir(OUT_DIR, { recursive: true });
  const file = join(OUT_DIR, name);
  const rows = payload[rowKey];
  if (!Array.isArray(rows) || rows.length === 0) {
    console.warn(`  ! ${name}: 0 rows produced — keeping existing file`);
    return false;
  }
  await writeFile(file, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`  ✓ ${name}: ${rows.length} rows`);
  return true;
}

// ---------------------------------------------------------------------------
// Forex — Bangko Sentral ng Pilipinas (BSP) reference exchange rates.
// Same upstream BetterGov uses; it is a public SharePoint OData list.
// ---------------------------------------------------------------------------
async function refreshForex() {
  const BSP_URL =
    "https://www.bsp.gov.ph/_api/web/lists/getByTitle('Exchange Rate')/items" +
    "?$select=*&$filter=Group eq '1'&$orderby=Ordering asc";
  const data = await fetchJson(BSP_URL);
  const rates = (data.value || [])
    .filter(r => r.Title)
    .map(r => ({
      country: r.Title,
      currency: r.Unit,
      symbol: r.Symbol,
      phpEquivalent: Number(r.PHPequivalent) || null,
      usdEquivalent: Number(r.USDequivalent) || null,
      publishedDate: r.PublishedDate || null,
    }));
  return writeOrKeep(
    'forex.json',
    {
      fetchedAt: nowIso(),
      source: 'Bangko Sentral ng Pilipinas (BSP)',
      sourceUrl: 'https://www.bsp.gov.ph/SitePages/Statistics/ExchangeRate.aspx',
      rates,
    },
    'rates'
  );
}

// ---------------------------------------------------------------------------
// Flood control — DPWH flood-control projects via BetterGov's bisto.ph, which
// is backed by a public JSON API (api.dpwh.bettergov.ph). We search for
// Koronadal within Region XII and keep the "Flood Control and Drainage"
// category. Rows carry budget, contractor, progress, status and coordinates.
// ---------------------------------------------------------------------------
async function refreshFloodControl() {
  const API = 'https://api.dpwh.bettergov.ph/projects';
  const PAGE_SIZE = 100;
  const projects = [];
  for (let page = 1; ; page++) {
    const url =
      `${API}?search=${encodeURIComponent(CITY)}` +
      `&region=${encodeURIComponent('Region XII')}` +
      `&page=${page}&limit=${PAGE_SIZE}`;
    const data = await fetchJson(url);
    const rows = data.data?.data || [];
    for (const r of rows) {
      // Keep flood-control work only; the same API also returns buildings.
      if (!/flood/i.test(r.category || '')) continue;
      projects.push({
        contractId: r.contractId || null,
        name: r.description || null,
        category: r.category || null,
        status: r.status || null,
        cost: Number(r.budget) || null,
        progress: Number(r.progress) ?? null,
        contractor: r.contractor || null,
        district: r.location?.province || null, // e.g. "South Cotabato 2nd DEO"
        region: r.location?.region || null,
        year: r.infraYear || null,
        startDate: r.startDate || null,
        completionDate: r.completionDate || null,
        latitude: r.latitude ?? null,
        longitude: r.longitude ?? null,
      });
    }
    const totalPages = data.data?.pagination?.totalPages ?? page;
    if (rows.length < PAGE_SIZE || page >= totalPages) break;
    if (page > 50) break; // safety
  }
  return writeOrKeep(
    'flood-control.json',
    {
      fetchedAt: nowIso(),
      source: 'DPWH Flood Control (BetterGov / bisto.ph)',
      sourceUrl:
        'https://bisto.ph/?search=koronadal&region=Region+XII&province=South+Cotabato+1st+DEO',
      apiUrl: API,
      city: CITY,
      province: PROVINCE,
      projects,
    },
    'projects'
  );
}

// ---------------------------------------------------------------------------
// Political dynasties — BetterGov "Dynasty" explorer (visualizations.bettergov.ph).
// Election winners for Koronadal City across years, each with a dynasty flag
// (`fat` = belongs to a political-family cluster). Public JSON API, no auth.
// ---------------------------------------------------------------------------
async function refreshDynasty() {
  const API = 'https://visualizations.bettergov.ph/api/dynasty';
  const data = await fetchJson(`${API}?search=${encodeURIComponent(CITY)}&limit=500`);
  const officials = (data.data || [])
    // The keyword can match nearby areas; keep Koronadal City proper.
    .filter(r => /koronadal/i.test(r.municipality_city || ''))
    .map(r => ({
      name: [r.first_name, r.last_name].filter(Boolean).join(' '),
      position: r.position || null,
      party: r.party && r.party !== 'UNKNOWN' ? r.party : null,
      city: r.municipality_city || null,
      province: r.province || null,
      year: r.year ?? null,
      isDynasty: Number(r.fat) === 1,
    }));
  return writeOrKeep(
    'dynasty.json',
    {
      fetchedAt: nowIso(),
      source: 'BetterGov Political Dynasties Explorer',
      sourceUrl: 'https://visualizations.bettergov.ph/dynasty',
      apiUrl: API,
      city: CITY,
      officials,
    },
    'officials'
  );
}

// ---------------------------------------------------------------------------
// Congress — bills and resolutions mentioning Koronadal, via BetterGov's
// Open Congress API (open-congress-api.bettergov.ph). Public JSON REST API.
// ---------------------------------------------------------------------------
async function refreshCongress() {
  const API = 'https://open-congress-api.bettergov.ph/api/search/documents';
  const data = await fetchJson(`${API}?q=${encodeURIComponent(CITY)}&limit=100`);
  const bills = (data.data || []).map(r => ({
    id: r.name || null, // e.g. "HBN-11382"
    type: r.subtype || r.type || null,
    congress: r.congress ?? null,
    title: r.title || null,
    longTitle: r.long_title || null,
    dateFiled: r.date_filed || null,
    scope: r.scope || null,
    subjects: Array.isArray(r.subjects) ? r.subjects : [],
    authors: (r.authors || [])
      .map(a => [a.first_name, a.last_name].filter(Boolean).join(' '))
      .filter(Boolean),
    url: r.senate_website_permalink || null,
  }));
  return writeOrKeep(
    'congress.json',
    {
      fetchedAt: nowIso(),
      source: 'BetterGov Open Congress API',
      sourceUrl: 'https://open-congress-api.bettergov.ph/',
      apiUrl: API,
      city: CITY,
      bills,
    },
    'bills'
  );
}

// ---------------------------------------------------------------------------
// National budget (GAA) — line items naming Koronadal, via BetterGov's
// Transparency dashboard, which is backed by a public Meilisearch instance
// (search2.bettergov.ph). The bearer token below is the public *search-only*
// key shipped in the transparency.bettergov.ph frontend (not a secret); if the
// upstream rotates it this source will 401 and the last-good file is kept.
// ---------------------------------------------------------------------------
async function refreshBudget() {
  const SEARCH = 'https://search2.bettergov.ph/indexes/gaa/search';
  const KEY =
    '307c9f43a066a443cc37d62b45fa47fde2b39f765139dd964ea151daed65f55c';
  const LIMIT = 100;
  const MAX_RECORDS = 500;
  const items = [];
  for (let offset = 0; items.length < MAX_RECORDS; offset += LIMIT) {
    const data = await fetchJson(SEARCH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({ q: CITY, limit: LIMIT, offset }),
    });
    const hits = data.hits || [];
    for (const h of hits) {
      items.push({
        id: h.id ?? null,
        description: h.dsc || null,
        department: h.uacs_dpt_dsc || null,
        agency: h.uacs_agy_dsc && h.uacs_agy_dsc !== 'nan' ? h.uacs_agy_dsc : null,
        // GAA figures are expressed in THOUSANDS of pesos (₱1,000 units).
        amountThousands: Number(h.amt) || null,
        year: h.year ?? null,
      });
    }
    if (hits.length < LIMIT || offset + LIMIT >= (data.estimatedTotalHits || 0))
      break;
  }
  return writeOrKeep(
    'budget.json',
    {
      fetchedAt: nowIso(),
      source: 'BetterGov Transparency — General Appropriations Act (GAA)',
      sourceUrl: 'https://transparency.bettergov.ph/budget/search?q=koronadal',
      apiUrl: SEARCH,
      city: CITY,
      items,
    },
    'items'
  );
}

// ---------------------------------------------------------------------------
// Procurements — PhilGEPS awarded contracts for Koronadal, via BetterGov's
// "PHILGEPS Awards Data Explorer" (https://philgeps.bettergov.ph/).
//
// This is a real public JSON API (a proxy in front of an Azure backend), so no
// scraping: we POST a keyword-filtered "chip-search" and page through results.
// Note this returns *awarded* contracts (2013–present), not open bid notices —
// the raw PhilGEPS opportunity search has no usable public API.
// ---------------------------------------------------------------------------
async function refreshProcurements() {
  const API_BASE = 'https://philgeps.bettergov.ph/api/v1';
  const EXPLORER_URL = 'https://philgeps.bettergov.ph/';
  const PAGE_SIZE = 100;
  const MAX_RECORDS = 500; // most-recent awards mentioning Koronadal

  // Filter chips: keyword "Koronadal" scopes to notices/titles naming the city.
  const baseBody = {
    contractors: [],
    areas: [],
    organizations: [],
    business_categories: [],
    keywords: [CITY],
    time_ranges: [],
    sortBy: 'award_date',
    sortDirection: 'desc',
    include_flood_control: true,
  };

  const awards = [];
  for (let page = 1; awards.length < MAX_RECORDS; page++) {
    const data = await fetchJson(`${API_BASE}/contracts/chip-search/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...baseBody, page, page_size: PAGE_SIZE }),
    });
    const rows = data.data || [];
    for (const r of rows) {
      awards.push({
        refId: r.reference_id || r.contract_no || String(r.id),
        title: r.award_title || r.notice_title || null,
        organization: r.organization_name || null,
        awardee: r.awardee_name || null,
        category: r.business_category || null,
        area: r.area_of_delivery || null,
        amount: Number(r.award_amount || r.contract_amount) || null,
        awardDate: (r.award_date || '').slice(0, 10) || null,
        status: r.award_status || null,
        url: EXPLORER_URL,
      });
    }
    const totalPages = data.pagination?.total_pages ?? page;
    if (rows.length < PAGE_SIZE || page >= totalPages) break;
  }

  return writeOrKeep(
    'procurements.json',
    {
      fetchedAt: nowIso(),
      source: 'PhilGEPS Awards (BetterGov Data Explorer)',
      sourceUrl: EXPLORER_URL,
      apiUrl: `${API_BASE}/contracts/chip-search/`,
      city: CITY,
      awards,
    },
    'awards'
  );
}

// ---------------------------------------------------------------------------
const SOURCES = {
  forex: refreshForex,
  'flood-control': refreshFloodControl,
  procurements: refreshProcurements,
  dynasty: refreshDynasty,
  congress: refreshCongress,
  budget: refreshBudget,
};

async function main() {
  const only = process.argv[2];
  const names = only ? [only] : Object.keys(SOURCES);
  let failures = 0;
  for (const name of names) {
    const fn = SOURCES[name];
    if (!fn) {
      console.error(`Unknown source "${name}". Options: ${Object.keys(SOURCES).join(', ')}`);
      process.exitCode = 1;
      return;
    }
    console.log(`Refreshing ${name}...`);
    try {
      await fn();
    } catch (err) {
      failures++;
      console.warn(`  ! ${name} failed: ${err.message} — keeping existing file`);
    }
  }
  // Don't fail CI for a flaky upstream; surface it in logs instead.
  console.log(`Done. ${failures} source(s) failed.`);
}

main();
