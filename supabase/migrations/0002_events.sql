-- Networking events, sourced from Calendar entries colored "Banana"
-- (colorId 5) — the user's own convention for marking networking activity.
-- Deliberately lightweight: most attendees here aren't in people/
-- organizations yet, so no FK to those tables — just a standalone log.

create table if not exists events (
  id text primary key,
  title text not null,
  event_date date not null,
  location text,
  external_id text,
  created_at timestamptz not null default now()
);

-- Safe to re-run even if you ran an earlier version of this file before
-- description/attendees existed — "if not exists" no-ops on a re-run.
alter table events add column if not exists description text;
alter table events add column if not exists attendees text; -- comma-joined display names/emails, self excluded

alter table events enable row level security;

drop policy if exists "owner only" on events;
create policy "owner only" on events for all
  using (auth.jwt() ->> 'email' = 'neha.monga@gmail.com')
  with check (auth.jwt() ->> 'email' = 'neha.monga@gmail.com');
