-- Dossier v1 schema — real project only.
-- This is a single-user app: RLS locks every row to one known email rather
-- than a user_id column, per the build plan's auth model.
--
-- Run this in the Supabase SQL Editor for the REAL project.
-- Never run this against a demo project, and never run it via curl/service
-- key — there is no service role key in this environment on purpose.

create table if not exists organizations (
  id text primary key,
  name text not null,
  type text not null check (type in ('employer', 'community', 'conference', 'podcast', 'other')),
  domain text,
  website text,
  linkedin_url text,
  description text,
  relationship_strength text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists people (
  id text primary key,
  name text not null,
  first_name text,
  last_name text,
  email text,
  secondary_emails text[],
  title text,
  linkedin_url text,
  location text,
  avatar_url text,
  notes text,
  relationship_strength text,
  relationship_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Many-to-many by design: a person can be linked to more than one org.
create table if not exists org_person_links (
  id text primary key,
  person_id text not null references people(id) on delete cascade,
  organization_id text not null references organizations(id) on delete cascade,
  role text,
  start_date date,
  end_date date,
  link_type text check (link_type in ('worked_together', 'community_member', 'speaker', 'attendee', 'other')),
  confidence text check (confidence in ('confirmed', 'inferred', 'suggested')),
  evidence_source_id text
);

create table if not exists interactions (
  id text primary key,
  person_id text not null references people(id) on delete cascade,
  organization_id text references organizations(id),
  interaction_type text,
  date date not null,
  title text,
  description text,
  meaningfulness_tier smallint check (meaningfulness_tier in (1, 2, 3)),
  source_id text,
  location text,
  confidence text check (confidence in ('confirmed', 'inferred', 'suggested'))
);

create table if not exists sources (
  id text primary key,
  source_type text not null check (source_type in ('gmail', 'calendar', 'granola', 'manual')),
  external_id text,
  external_url text,
  source_date timestamptz,
  ingestion_run_id text
);

create table if not exists ingestion_runs (
  id text primary key,
  source text not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  records_discovered int default 0,
  records_created int default 0,
  records_updated int default 0,
  duplicates int default 0,
  review_required int default 0,
  status text
);

alter table organizations enable row level security;
alter table people enable row level security;
alter table org_person_links enable row level security;
alter table interactions enable row level security;
alter table sources enable row level security;
alter table ingestion_runs enable row level security;

create policy "owner only" on organizations for all
  using (auth.jwt() ->> 'email' = 'neha.monga@gmail.com')
  with check (auth.jwt() ->> 'email' = 'neha.monga@gmail.com');

create policy "owner only" on people for all
  using (auth.jwt() ->> 'email' = 'neha.monga@gmail.com')
  with check (auth.jwt() ->> 'email' = 'neha.monga@gmail.com');

create policy "owner only" on org_person_links for all
  using (auth.jwt() ->> 'email' = 'neha.monga@gmail.com')
  with check (auth.jwt() ->> 'email' = 'neha.monga@gmail.com');

create policy "owner only" on interactions for all
  using (auth.jwt() ->> 'email' = 'neha.monga@gmail.com')
  with check (auth.jwt() ->> 'email' = 'neha.monga@gmail.com');

create policy "owner only" on sources for all
  using (auth.jwt() ->> 'email' = 'neha.monga@gmail.com')
  with check (auth.jwt() ->> 'email' = 'neha.monga@gmail.com');

create policy "owner only" on ingestion_runs for all
  using (auth.jwt() ->> 'email' = 'neha.monga@gmail.com')
  with check (auth.jwt() ->> 'email' = 'neha.monga@gmail.com');
