-- Migration 0007 — Solicitudes de asociación & Consultas de contacto
--
-- The two inbound-message entities written by the PUBLIC site and managed only
-- from the admin panel. They were in the domain model and the mock DataLayer
-- but had no table yet (0001-0003 covered 8 of 10 entities). This closes the
-- gap so the Supabase DataLayer can back them.
--
-- Access shape (same spirit as candidatos, less sensitive):
--   - anon (public forms): may INSERT only. No SELECT.
--   - admin: full access (read + manage `gestion`).
--   - socio: no access — these are internal to the CASC team.
--
-- Unlike content entities, these carry `gestion` (handling state), not a
-- publication `status`.

create type gestion_status as enum ('nueva', 'en-proceso', 'resuelta');

-- ---------------------------------------------------------------------------
-- solicitudes: membership requests from the public "Cómo asociarse" form.
-- ---------------------------------------------------------------------------
create table solicitudes (
  id         uuid primary key default gen_random_uuid(),
  sector     text not null,
  empresa    text not null,
  contacto   text not null,
  cargo      text,
  telefono   text,
  email      text not null,
  mensaje    text,
  gestion    gestion_status not null default 'nueva',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger solicitudes_set_updated_at
  before update on solicitudes for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- consultas: general enquiries from the public contact form.
-- ---------------------------------------------------------------------------
create table consultas (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  empresa    text,
  email      text not null,
  mensaje    text not null,
  gestion    gestion_status not null default 'nueva',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger consultas_set_updated_at
  before update on consultas for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: enable + policies. Fail-closed; public may only INSERT.
-- (Helpers is_admin() defined in 0004.)
-- ---------------------------------------------------------------------------
alter table solicitudes enable row level security;
alter table consultas   enable row level security;

create policy solicitudes_public_insert on solicitudes
  for insert to anon, authenticated with check (true);
create policy solicitudes_admin_all on solicitudes
  for all using (is_admin()) with check (is_admin());

create policy consultas_public_insert on consultas
  for insert to anon, authenticated with check (true);
create policy consultas_admin_all on consultas
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Indexes: admin lists both newest-first, filtered by gestion state.
-- ---------------------------------------------------------------------------
create index solicitudes_gestion_created on solicitudes (gestion, created_at desc);
create index consultas_gestion_created   on consultas   (gestion, created_at desc);
