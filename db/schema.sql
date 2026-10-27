-- Bantay Opisyal — admin backend schema (PostgreSQL, e.g. Railway).
-- Run once against your database:  psql "$DATABASE_URL" -f db/schema.sql
--
-- Model (hybrid): the curated registry lives in code (src/data/*) and is the
-- base. This database adds:
--   * submissions       — citizen suggestions awaiting moderation
--   * published_entries — admin-curated additions/edits that merge in live
--                         (NON-sensitive fields only)
--   * sensitive_items   — court cases & concerns, which require a TWO-STEP
--                         review before they ever surface publicly
--   * audit_log         — who did what

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

create table if not exists submissions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  kind          text not null check (kind in
                  ('new_person','edit','court_case','concern','correction','other')),
  person_id     text,                       -- target registry id (for edits)
  person_name   text not null,
  payload       jsonb not null default '{}',-- proposed content
  submitter_name  text,
  submitter_email text,
  note          text,
  status        text not null default 'pending'
                  check (status in ('pending','approved','rejected')),
  reviewed_at   timestamptz,
  reviewed_by   text,
  review_note   text
);
create index if not exists submissions_status_idx on submissions (status, created_at desc);

create table if not exists published_entries (
  person_id   text primary key,
  name        text not null,
  data        jsonb not null default '{}',  -- partial RegistryPerson (no court cases/concerns)
  updated_at  timestamptz not null default now(),
  updated_by  text
);

create table if not exists sensitive_items (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  person_id       text not null,
  kind            text not null check (kind in ('court_case','concern')),
  data            jsonb not null,
  -- two-step state machine: pending_second needs a (preferably different)
  -- second admin to publish; only 'approved' items are served publicly.
  state           text not null default 'pending_second'
                    check (state in ('pending_second','approved','rejected')),
  first_reviewer  text,
  first_at        timestamptz,
  second_reviewer text,
  second_at       timestamptz
);
create index if not exists sensitive_state_idx on sensitive_items (state);

create table if not exists audit_log (
  id        bigserial primary key,
  at        timestamptz not null default now(),
  actor     text,
  action    text not null,
  detail    jsonb
);

-- Admin accounts. Replaces the plaintext ADMIN_USERS env var (which still
-- works as a fallback/bootstrap). Passwords are scrypt-hashed; an admin
-- invited by email may have no password yet and can sign in with a code.
create table if not exists admin_users (
  username            text primary key,
  email               text not null unique,
  password_hash       text,
  -- Tokens issued before this are rejected (bumped on password change/reset).
  sessions_valid_after timestamptz not null default 'epoch',
  created_at          timestamptz not null default now(),
  created_by          text,
  last_login_at       timestamptz,
  disabled            boolean not null default false
);

-- One-time email codes for passwordless sign-in and password resets.
-- Only a keyed hash of the code is stored.
create table if not exists admin_codes (
  id          uuid primary key default gen_random_uuid(),
  username    text not null references admin_users(username) on delete cascade,
  purpose     text not null check (purpose in ('login','reset')),
  code_hash   text not null,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  attempts    int not null default 0,
  used_at     timestamptz
);
create index if not exists admin_codes_lookup_idx
  on admin_codes (username, purpose, created_at desc);
