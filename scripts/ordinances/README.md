# Ordinance authorship pipeline

Extracts **who authored / co-authored / sponsored** each City of Koronadal
ordinance from the official (scanned, image-only) PDFs on `koronadal.gov.ph`,
and generates [`src/data/cityOrdinances.ts`](../../src/data/cityOrdinances.ts) —
the data that powers the **Legislation** sections of the city official profiles
(`/city-officials/:slug`).

The published ordinance PDFs are **scanned images with no text layer**, so plain
text extraction fails. This pipeline OCRs the first one or two pages of each PDF
(where the `Author / Co-Authors / Sponsors` block sits) using macOS's built-in
**Vision** framework, then parses and maps the names to current officials.

## Prerequisites

- **macOS** with the Swift toolchain (`swiftc`) — uses the Vision OCR framework.
- **Python 3** with `pypdf` and `Pillow` (`pip install pypdf Pillow`).
- `curl` (for downloading the index + PDFs).

## Files

| File                                        | Purpose                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| `ocr.swift`                                 | Tiny CLI that OCRs one image via Vision. Compile: `swiftc -O ocr.swift -o ocr` |
| `ord_index.json`                            | Cached list of every ordinance PDF (url, title, date) from the WP media API    |
| `batch_ocr.py`                              | Downloads + OCRs + parses the **2025** ordinances → `ord_authors.json`         |
| `batch_prev.py`                             | Same for **2021–2024** → `ord_authors_prev.json`                               |
| `gen_all.py`                                | Merges both datasets + curated entries → writes `src/data/cityOrdinances.ts`   |
| `ord_authors.json`, `ord_authors_prev.json` | Cached OCR/parse output (so you can re-run `gen_all.py` without re-OCRing)     |
| `per_official.json`                         | Intermediate 2025 author→official mapping (debug)                              |

The compiled `ocr` binary and any downloaded `*.pdf` / `*.png` scratch files are
git-ignored — rebuild/redownload as needed.

## How to run (from this directory)

```bash
cd scripts/ordinances
swiftc -O ocr.swift -o ocr                 # 1. build the OCR helper

# 2. (optional) refresh the PDF index from the live site:
curl -sS "https://koronadal.gov.ph/wp-json/wp/v2/media?search=ordinance&per_page=100&page=1&_fields=source_url,title,date" -o media_p1.json
curl -sS "https://koronadal.gov.ph/wp-json/wp/v2/media?search=ordinance&per_page=100&page=2&_fields=source_url,title,date" -o media_p2.json
# then dedupe .pdf entries from media_p*.json into ord_index.json (see ord_index.json for shape)

python3 batch_ocr.py      # 3a. OCR + parse 2025 ordinances  -> ord_authors.json
python3 batch_prev.py     # 3b. OCR + parse 2021-2024        -> ord_authors_prev.json
python3 gen_all.py        # 4. generate ../../src/data/cityOrdinances.ts
```

Then format/verify in the repo root: `npx prettier --write src/data/cityOrdinances.ts && npm run build`.

New slugs produced by `gen_all.py` must also exist in
[`src/data/officials.ts`](../../src/data/officials.ts) (each profile official
needs a `slug` + `bio`); legislation is attached to officials by slug at module
load.

## Method & safeguards (important for accuracy)

- **Whole-council measures are dropped.** Any author/co-author/sponsor block with
  more than 6 names (e.g. appropriation/consensus ordinances) is skipped — those
  aren't meaningful individual legislative attributions.
- **Filtered to current officials only.** Names are matched against the current
  roster by distinctive surname tokens (OCR-typo tolerant). Former members who
  appear in the PDFs are intentionally not credited.
- **No fabrication.** Ordinances whose subject couldn't be read are skipped rather
  than labeled with a guess. Every generated entry links to its source PDF.
- Titles are derived from the OCR'd "AN ORDINANCE …" subject line and lightly
  title-cased; minor OCR artifacts may remain — the linked PDF is authoritative.

## Coverage / known limits

- The official site only publishes ordinance PDFs back to **2021**. Pre-2021
  ordinances are not online (not on the site, not in the Internet Archive) and
  must be obtained from the Sangguniang Panlungsod Secretariat / an FOI request.
- A handful of ordinances have no readable subject on pages 1–2 and are omitted.
