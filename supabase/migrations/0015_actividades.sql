-- Migration 0015 — Actividades (activities / events)
--
-- Activities were hardcoded in the app (home-content.ts). This makes them an
-- admin-managed, publicly-readable entity like blog_posts/noticias: the CASC
-- team creates them from the panel, and they show on the public home carousel
-- and the /actividades section, each with its own /actividades/[slug] page.

create table actividades (
  id              uuid primary key default gen_random_uuid(),
  titulo          text not null,
  slug            text not null unique,
  descripcion     text not null,
  imagen          text,
  cuerpo          text,
  fecha           text,   -- free-text display date ("28 de mayo de 2026")
  lugar           text,
  inscripcion_url text,
  status          publication_status not null default 'borrador',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger actividades_set_updated_at
  before update on actividades for each row execute function set_updated_at();

-- Index mirrors the 0005 convention (status + newest first).
create index actividades_status_fecha on actividades (status, created_at desc);

-- ---------------------------------------------------------------------------
-- RLS: admins write; members read published; anon (public site) read published.
-- Same shape as blog_posts/noticias/hoteles (publicly-facing content).
-- ---------------------------------------------------------------------------
alter table actividades enable row level security;

create policy actividades_select_published on actividades
  for select using (status = 'publicado' and is_member());

create policy actividades_admin_all on actividades
  for all using (is_admin()) with check (is_admin());

create policy actividades_public_read_published on actividades
  for select to anon
  using (status = 'publicado');
