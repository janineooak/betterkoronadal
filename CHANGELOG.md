# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-07-29

### Added

- Meilisearch content search integration — `/search` route with a new `Search` page (`src/pages/Search.tsx`)
- `src/lib/meilisearch.ts` — Meilisearch client and `isMeilisearchEnabled` feature flag; the search route and nav links only render when Meilisearch is configured
- `scripts/index-content.mjs` and the `npm run index-content` script for indexing services and government content into Meilisearch
- `docs/meilisearch.md` — Meilisearch setup and indexing documentation
- Terraform configuration for AWS S3 static site deployment under `terraform/` (#3)
- `DEPLOYMENT-GUIDE.md` — deployment instructions for the static site
- `GovernmentActivitySection` now accepts optional `title` and `description` props, falling back to translations

### Changed

- Migrated from `react-router-dom` v7 to `react-router` v8 across all imports
- Upgraded core dependencies: Vite 8, TypeScript 6, ESLint 10, i18next 26, react-i18next 17, `@vitejs/plugin-react` 6, `js-yaml` 5, `lint-staged` 17, `globals` 17
- ESLint flat config updated for ESLint 10 and the new `eslint-plugin-react-hooks` v7
- Dropped the redundant `@types/js-yaml` dependency (types now ship with `js-yaml`)
- `.gitignore` expanded with Terraform ignores (state files, `.tfvars`, local overrides, CLI config)

### Documentation

- `README.md` and `STARTER-KIT-README.md` — installation guide switched to a fork-first workflow, with a "Keeping Your Fork Updated" upstream sync section and clarified contribution steps

## [0.2.0] - 2026-03-07

### Added

- `/government` and `/government/:category` routes with a new `Government` page
- Government section content system under `content/government/` (departments: executive, legislative)
- `src/pages/Government.tsx` — category listing page for government departments
- `src/data/government.yaml` — top-level government category definitions
- Expanded `Document` page to support government content alongside services
- Navigation updated: main nav Government item now links to `/government/departments`
- OG image template redesigned for improved open graph previews
- Companion JSON files for markdown pages — optional `{slug}.json` files supply `{PLACEHOLDER}` token values (official names, dates, etc.) interpolated at load time, with `VITE_<KEY>` env vars as fallback

### Changed

- `yamlLoader.ts` refactored to handle both service and government category indexes
- `markdownLoader.ts` refactored to resolve markdown files across content types; now also loads companion JSON and runs `interpolate()` for token substitution
- `Navbar` updated to support government section routing
- `Breadcrumbs` updated to reflect government section paths
- `Section` component adjusted for layout consistency
- `GovernmentActivitySection` on Home page now points to live government routes
- `Services` page layout and routing logic improved
- Locale strings updated in `public/locales/en/common.json` and `src/i18n/locales/en.json`

### Documentation

- `README.md` — project structure and content setup steps updated for government section
- `CLAUDE.md` — routing, content system, and companion JSON file behavior documented
- `CONTENT-MANAGEMENT.md` — added government department pages section, JSON data files explained, dynamic placeholder workflow included
- `CONTENT-GUIDE.md` — added department/office page template, content type, and "Dynamic Content with Placeholders" section

## [0.1.0] - 2026-03-06

### Added

- `@bettergov/kapwa` component library integrated as the primary UI primitive layer
- New font and theme setup via `src/fonts.css`
- `react-helmet-async` for SEO and document head management

### Changed

- Migrated styling pipeline to **Tailwind CSS v4** (Vite plugin, PostCSS config updated)
- Replaced local `Card` component (`src/components/ui/Card.tsx`) with Kapwa card primitives
- Replaced legacy `ListItem` component with Kapwa cards and banners across Services, Home, and Document pages
- Updated `src/index.css` to align with Tailwind v4 conventions
- Upgraded `App.tsx` and `main.tsx` for the new app shell and SEO setup

### Removed

- `src/components/ui/Card.tsx` — superseded by Kapwa primitives
- `src/components/ui/ListItem.tsx` — superseded by Kapwa cards and banners

[0.3.0]: https://github.com/iyanski/betterlocalgov/releases/tag/v0.3.0
[0.2.0]: https://github.com/iyanski/betterlocalgov/releases/tag/v0.2.0
[0.1.0]: https://github.com/iyanski/betterlocalgov/releases/tag/v0.1.0
