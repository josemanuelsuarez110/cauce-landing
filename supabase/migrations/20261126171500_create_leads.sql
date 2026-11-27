create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) between 3 and 254),
  interest text not null check (interest in ('ahorro', 'transferencias', 'inversion')),
  privacy_notice_version text not null check (char_length(privacy_notice_version) between 1 and 32),
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index leads_created_at_idx on public.leads (created_at);

alter table public.leads enable row level security;
alter table public.leads force row level security;

revoke all on table public.leads from anon, authenticated, service_role;
grant usage on schema public to service_role;
grant insert on table public.leads to service_role;
