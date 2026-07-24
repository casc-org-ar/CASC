-- =========================================================================
-- CASC — Esquema completo de base de datos (Fase 1)
-- Pegar TODO este archivo en el SQL Editor de Supabase y ejecutar (Run).
-- Envuelto en una transacción: si algo falla, no queda nada a medias.
-- =========================================================================

begin;

-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- supabase/migrations/0001_foundations_and_socios.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- supabase/migrations/0002_content_tables.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- Migration 0002 — Content tables
--
-- The six content entities managed from the admin and shown (published-only)
-- to socios: webinars, informes, noticias, newsletters, blog, hoteles.
-- All share id / created_at / updated_at / status, each with its own updated_at
-- trigger. Columns mirror the domain types 1:1 (camelCase → snake_case).
-- RLS in 0004, indexes in 0005.

-- Text arrays (blog.imagenes/tags, hoteles.beneficios) use native text[] rather
-- than a join table: they are small, read whole, and never queried by element.

create table webinars (
  id                    uuid primary key default gen_random_uuid(),
  titulo                text not null,
  descripcion           text not null,
  fecha                 date not null,
  video_url             text not null,
  portada_url           text,
  categoria             text not null,
  material_adjunto_url  text,
  status                publication_status not null default 'borrador',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create trigger webinars_set_updated_at
  before update on webinars for each row execute function set_updated_at();

create table informes (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  descripcion text not null,
  categoria   text not null,
  archivo_url text not null,
  portada_url text,
  fecha       date not null,
  status      publication_status not null default 'borrador',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger informes_set_updated_at
  before update on informes for each row execute function set_updated_at();

create table noticias (
  id         uuid primary key default gen_random_uuid(),
  titulo     text not null,
  bajada     text not null,
  cuerpo     text not null,
  imagen_url text,
  categoria  text,
  fecha      date not null,
  status     publication_status not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger noticias_set_updated_at
  before update on noticias for each row execute function set_updated_at();

create table newsletters (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  edicion     text not null,
  contenido   text,
  fecha       date not null,
  adjunto_url text,
  status      publication_status not null default 'borrador',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger newsletters_set_updated_at
  before update on newsletters for each row execute function set_updated_at();

create table blog_posts (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  slug        text not null unique,
  bajada      text not null,
  cuerpo      text not null,
  portada_url text,
  imagenes    text[] not null default '{}',
  autor       text not null,
  tags        text[] not null default '{}',
  fecha       date not null,
  status      publication_status not null default 'borrador',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger blog_posts_set_updated_at
  before update on blog_posts for each row execute function set_updated_at();

create table hoteles (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  estrellas  smallint check (estrellas between 1 and 5),
  ciudad     text not null,
  direccion  text,
  telefono   text,
  web        text,
  logo_url   text,
  descuento  text not null,
  beneficios text[] not null default '{}',
  reservas   text,
  nota       text,
  status     publication_status not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger hoteles_set_updated_at
  before update on hoteles for each row execute function set_updated_at();

-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- supabase/migrations/0003_candidatos.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- Migration 0003 — Candidatos (Bolsa de Trabajo)
--
-- The most sensitive table: personal data of third parties (name, email, phone,
-- CV) submitted through the PUBLIC landing. Access rules (0004) are strict:
--   - public (anon): may INSERT only — never SELECT.
--   - socio: may SELECT published candidates only.
--   - admin: full access (moderation).
--
-- `consentimiento` records explicit data-storage consent (ley 25.326) and is
-- enforced NOT NULL + true at the DB level: a row cannot exist without consent.

create table candidatos (
  id                uuid primary key default gen_random_uuid(),
  -- Datos básicos
  nombre            text not null,
  email             text not null,
  telefono          text,
  -- Perfil profesional
  puesto_buscado    text not null,
  area_interes      text not null,
  skills            text[] not null default '{}',
  anios_experiencia smallint check (anios_experiencia between 0 and 60),
  nivel_educativo   text,
  disponibilidad    disponibilidad,
  -- Ubicación
  ciudad            text,
  provincia         text,
  -- CV (stored file reference; the file itself lives in storage)
  cv_url            text not null,
  cv_nombre         text,
  -- Legal: consent is mandatory. The CHECK guarantees no row without it.
  consentimiento    boolean not null default false check (consentimiento = true),
  -- Moderación: 'borrador' = pending review, 'publicado' = visible to socios.
  status            publication_status not null default 'borrador',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create trigger candidatos_set_updated_at
  before update on candidatos for each row execute function set_updated_at();

comment on table candidatos is
  'Job candidates from the public landing. Sensitive personal data — see RLS in 0004. Public may INSERT only.';
comment on column candidatos.consentimiento is
  'Ley 25.326 consent. Enforced true by CHECK: no candidate row exists without it.';

-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- supabase/migrations/0004_rls_policies.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- Migration 0004 — Row Level Security (RLS)
--
-- THE security boundary of the platform. Defense in depth: even if the app
-- layer has a bug, the database itself refuses unauthorized access.
--
-- Model (matches the app's access patterns):
--   - anon (public site): can INSERT candidatos only. No SELECT anywhere.
--   - socio (authenticated member): SELECT published content + published
--     candidatos. No writes.
--   - admin: full access to everything.
--
-- Role source: Clerk issues a JWT whose claims Supabase exposes via auth.jwt().
-- We read the role from the token, NOT from any client-supplied value.
--
-- Fail-closed: enabling RLS denies everything by default; policies only open
-- the minimum. The service_role key (server-only) bypasses RLS for trusted
-- server code — never expose it to the browser.

-- ---------------------------------------------------------------------------
-- Helpers: read identity/role from the verified Clerk JWT.
-- ---------------------------------------------------------------------------

-- The Clerk user id from the token subject ('sub').
create or replace function clerk_user_id()
returns text
language sql stable
as $$
  select nullif(auth.jwt() ->> 'sub', '')::text;
$$;

-- The role claim carried in the token. Adjust the claim path if the Clerk
-- JWT template names it differently (e.g. metadata.role).
create or replace function current_app_role()
returns text
language sql stable
as $$
  select coalesce(
    auth.jwt() ->> 'role',
    auth.jwt() -> 'metadata' ->> 'role'
  );
$$;

create or replace function is_admin()
returns boolean
language sql stable
as $$
  select current_app_role() = 'admin';
$$;

-- Authenticated as a platform member (admin or socio).
create or replace function is_member()
returns boolean
language sql stable
as $$
  select current_app_role() in ('admin', 'socio');
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS on every table. From here nothing is readable/writable until a
-- policy explicitly allows it.
-- ---------------------------------------------------------------------------
alter table socios       enable row level security;
alter table webinars     enable row level security;
alter table informes     enable row level security;
alter table noticias     enable row level security;
alter table newsletters  enable row level security;
alter table blog_posts   enable row level security;
alter table hoteles      enable row level security;
alter table candidatos   enable row level security;

-- ---------------------------------------------------------------------------
-- Content tables (webinars, informes, noticias, newsletters, blog, hoteles):
--   - socios & admins read PUBLISHED rows.
--   - admins additionally read drafts and do all writes.
-- Implemented per-table (Postgres policies are not parameterizable) but the
-- shape is identical everywhere.
-- ---------------------------------------------------------------------------

-- webinars
create policy webinars_select_published on webinars
  for select using (status = 'publicado' and is_member());
create policy webinars_admin_all on webinars
  for all using (is_admin()) with check (is_admin());

-- informes
create policy informes_select_published on informes
  for select using (status = 'publicado' and is_member());
create policy informes_admin_all on informes
  for all using (is_admin()) with check (is_admin());

-- noticias
create policy noticias_select_published on noticias
  for select using (status = 'publicado' and is_member());
create policy noticias_admin_all on noticias
  for all using (is_admin()) with check (is_admin());

-- newsletters
create policy newsletters_select_published on newsletters
  for select using (status = 'publicado' and is_member());
create policy newsletters_admin_all on newsletters
  for all using (is_admin()) with check (is_admin());

-- blog_posts
create policy blog_select_published on blog_posts
  for select using (status = 'publicado' and is_member());
create policy blog_admin_all on blog_posts
  for all using (is_admin()) with check (is_admin());

-- hoteles
create policy hoteles_select_published on hoteles
  for select using (status = 'publicado' and is_member());
create policy hoteles_admin_all on hoteles
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- socios: a member may read/update ONLY their own row; admins manage all.
-- ---------------------------------------------------------------------------
create policy socios_select_self on socios
  for select using (clerk_user_id() = socios.clerk_user_id);
create policy socios_update_self on socios
  for update using (clerk_user_id() = socios.clerk_user_id)
  with check (clerk_user_id() = socios.clerk_user_id);
create policy socios_admin_all on socios
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- candidatos (most sensitive):
--   - anon may INSERT only (public CV submission), and only with consent.
--   - socios read PUBLISHED candidates.
--   - admins do everything (moderation).
-- No SELECT is granted to anon anywhere — the public never lists candidates.
-- ---------------------------------------------------------------------------
create policy candidatos_public_insert on candidatos
  for insert
  to anon, authenticated
  with check (consentimiento = true and status = 'borrador');

create policy candidatos_select_published on candidatos
  for select using (status = 'publicado' and is_member());

create policy candidatos_admin_all on candidatos
  for all using (is_admin()) with check (is_admin());

-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- supabase/migrations/0005_indexes.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- Migration 0005 — Indexes
--
-- Only indexes the queries actually run (every index costs write performance).
-- Observed access patterns (from the app):
--   - Content: filter by status='publicado', order by fecha DESC.
--   - Candidatos: filter by status, order by created_at DESC; filter by
--     area_interes and by skills (array contains).
--   - Socios: lookup by clerk_user_id (unique index already exists) and by
--     shopping (admin grouping).
--
-- No speculative indexes. Add more only when EXPLAIN ANALYZE shows a real need
-- (skill: measure before optimizing).

-- Content: composite (status, fecha DESC) serves the socio published-by-date
-- listing and the admin ordering in one index.
create index webinars_status_fecha    on webinars    (status, fecha desc);
create index informes_status_fecha    on informes    (status, fecha desc);
create index noticias_status_fecha    on noticias    (status, fecha desc);
create index newsletters_status_fecha on newsletters (status, fecha desc);
create index blog_status_fecha        on blog_posts  (status, fecha desc);

-- Hoteles list by name (no fecha), filtered by status.
create index hoteles_status_nombre on hoteles (status, nombre);

-- Candidatos: recruiter listing (published, newest first) + moderation.
create index candidatos_status_created on candidatos (status, created_at desc);
-- Filter by area.
create index candidatos_area on candidatos (area_interes);
-- Filter by skill: GIN index on the text[] for `skills @> array[...]` lookups.
create index candidatos_skills_gin on candidatos using gin (skills);

-- Socios: admin grouping/filtering by shopping center.
create index socios_shopping on socios (shopping);

commit;
