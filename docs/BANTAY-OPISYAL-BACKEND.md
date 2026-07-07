# Bantay Opisyal — admin backend

The officials registry ("Bantay Opisyal") works as a **static feature by
default** — all data lives in code (`src/data/officialsRegistry.ts` and the
datasets it aggregates). The backend is **optional** and adds two things:

1. **Citizen contributions** — a public form at `/officials/contribute` that
   files moderated submissions.
2. **An admin dashboard** at `/admin` to review submissions, run the two-person
   review for court cases/concerns, and see published additions.

With no env vars set, the form shows a friendly "backend not configured" error
and the registry serves the static data unchanged.

## Architecture

- **Database:** PostgreSQL (e.g. Railway). Schema in [`db/schema.sql`](../db/schema.sql).
- **API:** Vercel serverless functions in [`api/`](../api) (Node + `pg`). They
  degrade gracefully (HTTP 503 / empty results) when `DATABASE_URL` is unset.
- **Auth:** stateless HMAC-signed tokens; admins configured via env. No external
  auth service.
- **Hybrid data model:** the code-curated registry is the base. The DB holds
  - `published_entries` — admin-curated additions/edits that merge in **live**
    (non-sensitive fields), and
  - `sensitive_items` — court cases & concerns, which require **two-person
    review** (`pending_second → approved`) before they ever appear publicly.
    The client (`src/lib/registryApi.ts` + `useRegistry`) fetches `/api/registry`
    and merges published data over the static base at runtime.

## One-time setup

1. **Create a Postgres database** (Railway → New → Database → PostgreSQL) and
   copy its connection string.
2. **Load the schema:**
   ```bash
   psql "postgresql://…railway…" -f db/schema.sql
   ```
3. **Set Vercel env vars** (Project → Settings → Environment Variables) — see
   [`.env.example`](../.env.example):
   - `DATABASE_URL` — the Railway connection string
   - `ADMIN_SECRET` — a long random string
   - `ADMIN_USERS` — `name:password` pairs, comma-separated (≥2 enables enforced
     two-person review of sensitive items)
4. **Redeploy.** The form and `/admin` go live; without these vars the site is
   unchanged.

## API surface

| Method           | Path                              | Auth   | Purpose                                      |
| ---------------- | --------------------------------- | ------ | -------------------------------------------- |
| POST             | `/api/submissions`                | public | File a contribution (moderated)              |
| GET              | `/api/registry`                   | public | Published entries + approved sensitive items |
| POST             | `/api/admin/login`                | —      | Get an admin token                           |
| GET              | `/api/submissions?status=pending` | admin  | List submissions                             |
| POST             | `/api/admin/review`               | admin  | Approve/reject a submission                  |
| GET / PUT / POST | `/api/admin/entries`              | admin  | List / upsert entry / add sensitive item     |
| POST             | `/api/admin/sensitive`            | admin  | Second-review publish/reject                 |

## Safeguards

- Nothing publishes without moderation. Court cases & concerns need a **second
  admin** to publish (the publisher must differ from the first reviewer when ≥2
  admins exist).
- `/admin` is `noindex`. Tokens expire after 8 hours.
- Keep the curated base in code as the source of truth + git audit trail; the DB
  layers approved community input on top.

## Local development

Use `vercel dev` (so `/api/*` functions run locally) with a local `.env`, or
point `DATABASE_URL` at a dev database. Plain `npm run dev` serves the SPA only
(no `/api`), which is fine — the registry falls back to static data.
