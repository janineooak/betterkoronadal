# Product Requirements Document — BetterKoronadal.org

## 1. Overview

**BetterKoronadal.org** is an open, modern, citizen-first web portal for the
**City Government of Koronadal** (also known as **Marbel**) — a component city in
South Cotabato, the provincial capital, and the regional center of SOCCSKSARGEN
(Region XII), Philippines.

It is a community-built ("better government") reimagining of the official LGU
website: faster, multilingual, mobile-first, and easy to navigate. Built on the
`@bettergov/kapwa` design system (React 19 + TypeScript + Vite + Tailwind).

- **Tagline / motto:** "One People, One Big Dream, One Koronadal!"
- **City nickname:** "Hub of the South"
- **Etymology:** Blaan _koron_ (cogon grass) + _nadal_ (wide plain) — a wide grassy plain.

## 2. Purpose & Goals

- Give residents a single, trustworthy place to find **city services**,
  **government offices/officials**, news, and contact info.
- Be dramatically more usable than typical LGU sites: clean, fast, accessible,
  multilingual (English now; designed for local languages — Hiligaynon, Cebuano,
  Filipino).
- Be content-driven and low-maintenance — staff edit YAML/Markdown, not code.

## 3. Target Audience

- **Koronadal residents** (~202,000 people, 27 barangays) seeking services and info.
- **Local businesses & visitors** ("Hub of the South" — commercial/agri center).
- **City staff / departments** who maintain content.
- Skews mobile, mixed digital literacy → clarity and trust matter most.

## 4. Core Features

1. **Home** — hero banner, services overview, government activity highlights.
2. **Services** — categorized listings → individual service pages (Markdown).
3. **Government** — department/office directory, officials, executive profiles.
4. **Document viewer** — renders Markdown content pages, multilingual routes.
5. **i18n** — i18next, language switcher, fallback to English.
6. **Content system** — YAML + Markdown, no CMS; placeholder interpolation for
   officials' names (e.g. current Mayor Hon. Erlinda "Bing" Pabi-Araquil).

## 5. Brand Identity & Visual Language (for logo design)

### Personality

Trustworthy, modern, open, civic, optimistic, community-rooted, efficient.
Government legitimacy **without** the dated, cluttered feel of typical PH LGU seals.
Think "civic-tech startup meets official city portal."

### Existing color palette (from the app theme)

| Role          | Color         | Hex                   |
| ------------- | ------------- | --------------------- |
| **Primary**   | Civic blue    | `#0066eb`             |
| **Secondary** | Vivid orange  | `#ff4d00`             |
| **Accent**    | Gold / yellow | `#f58900`             |
| Success       | Green         | `#00af5f`             |
| Neutrals      | Cool grays    | `#212529` → `#f8f9fa` |

Blue conveys trust/government; orange + gold add warmth, energy, and a sunny
SOCCSKSARGEN/agri-plains feel.

### Typography

Sans-serif, clean and friendly: **Inter / Figtree**. Logo wordmark should pair
well with a geometric humanist sans.

### Visual motifs to draw from

- **Cogon grass / wide plain** (the literal meaning of "Koronadal") — blades of
  grass, a flat horizon, open field.
- **Sun / sunrise** — "Hub of the South," optimism, SOCCSKSARGEN sun imagery.
- **Unity** — "One People, One Big Dream, One Koronadal" — a single unified mark,
  convergence, togetherness.
- **Modern civic minimalism** — simple geometric shapes, app-icon friendly.
- Optional nod to Koronadal's existing identity (it is a planned city, capital,
  agricultural and commercial hub).

### Logo requirements

- Works as a small **favicon / app icon** (16px, 32px, 180px) and as a header
  wordmark+mark lockup.
- Legible in **monochrome** and on both light and dark backgrounds.
- Flat, modern, vector-friendly; avoid photorealism, gradients-heavy seals, or
  fine detail that breaks at small sizes.
- Should read as official-yet-approachable, distinct from the formal city seal.

## 6. Non-Goals

- Not the legally official seal (this is a community portal).
- No heavy ornamentation, no clip-art, no overly literal government iconography
  (gavels, eagles, ornate ribbons).

---

### Suggested logo-prompt seed (ready to adapt)

> A modern, minimalist logo for **BetterKoronadal.org**, a citizen-first web
> portal for the City of Koronadal ("Marbel"), Philippines — capital of South
> Cotabato, "Hub of the South." Combine a simple geometric mark suggesting
> **cogon grass on a wide plain** and/or a **rising sun**, conveying unity
> ("One People, One Big Dream, One Koronadal"). Flat vector style, civic and
> trustworthy yet friendly and tech-forward. Primary civic blue `#0066eb` with
> warm orange `#ff4d00` and gold `#f58900` accents. Clean humanist sans-serif
> wordmark (Inter/Figtree feel). Must scale to a small app icon, work in
> monochrome, and read clearly on light and dark backgrounds. No ornate seals,
> no photorealism, no clutter.
