-- Migration 0001 — Foundations & socios
--
-- Enums, the shared updated_at trigger, and the socios table (linked to Clerk).
-- RLS policies live in migration 0004 so security is reviewed as one unit.

-- ---------------------------------------------------------------------------
-- Enums. Using enums (not free-text) means the database rejects invalid
-- values outright — a fail-closed guardrail beyond the app layer.
-- ---------------------------------------------------------------------------
create type publication_status as enum ('borrador', 'publicado');
create type user_role          as enum ('admin', 'socio');
create type member_state       as enum ('activo', 'inactivo');
create type invitation_status  as enum ('pendiente', 'enviada', 'aceptada');
create type disponibilidad     as enum ('full-time', 'part-time', 'ambas');

-- ---------------------------------------------------------------------------
-- Shared trigger: keep updated_at accurate on every UPDATE, server-side.
-- Never trust the app to set it.
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- socios: member profiles. Auth (login, password, session) is owned by Clerk;
-- this table owns the profile data. `clerk_user_id` links a row to its Clerk
-- user and is what RLS uses to decide what a member may see. It is nullable
-- until the member accepts their invitation and a Clerk user exists.
-- ---------------------------------------------------------------------------
create table socios (
  id                    uuid primary key default gen_random_uuid(),
  clerk_user_id         text unique,
  nombre                text not null,
  shopping              text not null,
  email                 text not null,
  cargo                 text,
  estado                member_state      not null default 'activo',
  role                  user_role         not null default 'socio',
  invitacion_status     invitation_status not null default 'pendiente',
  invitacion_enviada_at timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger socios_set_updated_at
  before update on socios
  for each row execute function set_updated_at();

-- Email is how members are identified before Clerk links them; keep it unique
-- (case-insensitive) so the same person isn't invited twice.
create unique index socios_email_unique on socios (lower(email));

comment on table socios is
  'Member profiles. Auth is Clerk; clerk_user_id links each row to its Clerk user.';
