create table if not exists public.visitor_events (
  id bigserial primary key,
  visitor_id uuid not null,
  seen_at timestamptz not null default now()
);

create index if not exists visitor_events_seen_at_idx
  on public.visitor_events (seen_at desc);

create index if not exists visitor_events_visitor_seen_at_idx
  on public.visitor_events (visitor_id, seen_at desc);

alter table public.visitor_events enable row level security;

drop policy if exists "visitor_events_insert_public" on public.visitor_events;
create policy "visitor_events_insert_public"
  on public.visitor_events
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "visitor_events_select_public" on public.visitor_events;
create policy "visitor_events_select_public"
  on public.visitor_events
  for select
  to anon, authenticated
  using (true);
