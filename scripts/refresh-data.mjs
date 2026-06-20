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
// Flood control — DPWH "Flood Control Projects Live" ArcGIS layer, narrowed to
// South Cotabato. The dashboard sits on a Web Map; we resolve its first
// operational FeatureServer layer, then page through the features.
// ---------------------------------------------------------------------------
async function resolveFloodLayerUrl() {
  // Web Map item backing the public DPWH dashboard.
  const WEBMAP_ITEM = '62c6ad03ac354a6f80778004241a7195';
  const data = await fetchJson(
    `https://www.arcgis.com/sharing/rest/content/items/${WEBMAP_ITEM}/data?f=json`
  );
  const layers = data.operationalLayers || [];
  const layer = layers.find(l => /FeatureServer/i.test(l.url || ''));
  if (!layer) throw new Error('no FeatureServer layer in web map');
  return layer.url.replace(/\/$/, '');
}

async function refreshFloodControl() {
  const layerUrl = await resolveFloodLayerUrl();
  const where = encodeURIComponent(`Province='${PROVINCE}'`);
  const projects = [];
  let offset = 0;
  // Page until ArcGIS reports no more records.
  for (;;) {
    const url =
      `${layerUrl}/query?where=${where}&outFields=*&f=json` +
      `&resultOffset=${offset}&resultRecordCount=1000&returnGeometry=false`;
    const data = await fetchJson(url);
    const feats = data.features || [];
    for (const f of feats) {
      const a = f.attributes || {};
      projects.push({
        name: a.ProjectDescription || a.ProjectName || a.Project || null,
        municipality: a.Municipality || a.City || null,
        contractor: a.Contractor || null,
        cost: Number(a.ContractCost || a.ABC || a.Cost) || null,
        status: a.ProjectStatus || a.Status || null,
        year: a.InfraYear || a.Year || null,
      });
    }
    if (feats.length < 1000 || data.exceededTransferLimit === false) break;
    offset += feats.length;
    if (offset > 50000) break; // safety
  }
  return writeOrKeep(
    'flood-control.json',
    {
      fetchedAt: nowIso(),
      source: 'DPWH Flood Control Projects (ArcGIS)',
      sourceUrl:
        'https://www.arcgis.com/apps/dashboards/f585444def084abaadda090952759e28',
      province: PROVINCE,
      projects,
    },
    'projects'
  );
}

// ---------------------------------------------------------------------------
// Procurements — PhilGEPS open opportunities for Koronadal.
//
// NOTE: notices.philgeps.gov.ph is an ASP.NET WebForms search (no public JSON
// API, CORS-blocked, viewstate/postback driven) and open.philgeps.gov.ph's
// /load/ endpoints are session-gated. This fetcher does a best-effort search
// scrape; if the upstream markup changes it will produce 0 rows and the last
// committed procurements.json is kept. Treat as advisory, link to the source.
// ---------------------------------------------------------------------------
async function refreshProcurements() {
  const SEARCH_PAGE =
    'https://notices.philgeps.gov.ph/GEPSNONPILOT/Tender/SplashOpportunitiesSearchUI.aspx?menuIndex=3';
  // Pull the search page to seed viewstate, then post a keyword search.
  const seed = await fetch(SEARCH_PAGE, {
    headers: { 'User-Agent': 'betterkoronadal-data-bot' },
  });
  const html = await seed.text();
  const field = name => {
    const m = html.match(
      new RegExp(`id="${name}"[^>]*value="([^"]*)"`)
    );
    return m ? m[1] : '';
  };
  const cookie = (seed.headers.get('set-cookie') || '').split(';')[0];
  const form = new URLSearchParams({
    __VIEWSTATE: field('__VIEWSTATE'),
    __VIEWSTATEGENERATOR: field('__VIEWSTATEGENERATOR'),
    __EVENTVALIDATION: field('__EVENTVALIDATION'),
    // Keyword search box — field id is best-effort and may need updating.
    ctl00$ContentPlaceHolder1$txtSearchKeyword: 'Koronadal',
    ctl00$ContentPlaceHolder1$btnSearch: 'Search',
  });
  const res = await fetch(SEARCH_PAGE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'betterkoronadal-data-bot',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: form.toString(),
  });
  const resultHtml = await res.text();

  // Parse result rows. PhilGEPS renders opportunities as table rows; the exact
  // selectors are version-specific, so this is intentionally tolerant.
  const notices = [];
  const rowRe =
    /SolicitationNumber=([^"&]+)[^>]*>([^<]+)<\/a>[\s\S]{0,400}?(?:Closing|Date)[^<]*<[^>]*>([^<]+)</gi;
  let m;
  while ((m = rowRe.exec(resultHtml)) && notices.length < 100) {
    const title = m[2].trim();
    if (!/koronadal/i.test(title)) continue;
    notices.push({
      refId: m[1].trim(),
      title,
      closingDate: m[3].trim(),
      url: SEARCH_PAGE,
    });
  }
  return writeOrKeep(
    'procurements.json',
    {
      fetchedAt: nowIso(),
      source: 'PhilGEPS Open Opportunities',
      sourceUrl: SEARCH_PAGE,
      city: CITY,
      notices,
    },
    'notices'
  );
}

// ---------------------------------------------------------------------------
const SOURCES = {
  forex: refreshForex,
  'flood-control': refreshFloodControl,
  procurements: refreshProcurements,
};

// Forex is fetched client-side at runtime by ForexWidget (BSP is CORS-enabled),
// so it is NOT part of the default/scheduled run — it would only commit a
// throwaway forex.json. Run it explicitly (`node scripts/refresh-data.mjs forex`)
// if you ever want a server-rendered/cached copy.
const DEFAULT_SOURCES = ['flood-control', 'procurements'];

async function main() {
  const only = process.argv[2];
  const names = only ? [only] : DEFAULT_SOURCES;
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
