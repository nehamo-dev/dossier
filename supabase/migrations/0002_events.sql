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

alter table events enable row level security;

create policy "owner only" on events for all
  using (auth.jwt() ->> 'email' = 'neha.monga@gmail.com')
  with check (auth.jwt() ->> 'email' = 'neha.monga@gmail.com');
