-- Migration 0011 — Data migration: noticias → blog_posts (visibilidad = 'socios')
--
-- ONE-TIME DATA migration (not a schema change). Copies the existing rows from
-- the deprecated `noticias` table into the unified `blog_posts` table so that
-- members keep seeing the news they see today. Migrated rows are flagged
-- `visibilidad = 'socios'` — they were members-only, never public.
--
-- Run this AFTER 0010 (which adds the `visibilidad` column) and only once.
-- It is idempotent: a second run inserts nothing, because it skips any noticia
-- whose generated slug already exists in blog_posts.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 0 — VERIFY BEFORE INSERTING (run these SELECTs first, review the output)
-- ─────────────────────────────────────────────────────────────────────────────
-- How many noticias exist:
--     select count(*) from noticias;
--
-- Preview the slugs that will be generated and whether they collide with an
-- existing blog_posts slug (collisions are SKIPPED by the insert below):
--     select
--       n.id,
--       n.titulo,
--       slugify(n.titulo) as slug_generado,
--       exists (select 1 from blog_posts b where b.slug = slugify(n.titulo)) as colisiona
--     from noticias n
--     order by n.fecha desc;
--
-- If `colisiona = true` for a row you DO want to migrate, give that noticia a
-- distinct title/slug first, or migrate it by hand. The insert below will not
-- overwrite an existing blog post.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1 — slugify() helper (mirrors src/.../blog/actions.ts slugify)
-- ─────────────────────────────────────────────────────────────────────────────
-- `slugify` depends on unaccent(). In Supabase, extensions live in the
-- `extensions` schema, so we install it there and qualify the call as
-- `extensions.unaccent(...)`. Running the extension install here makes this
-- migration self-contained (no separate manual step).
create extension if not exists unaccent with schema extensions;

-- lowercase, strip accents, drop non-alphanumerics (keep spaces/hyphens),
-- collapse whitespace to single hyphens.
create or replace function slugify(value text)
returns text
language sql
immutable
as $$
  select trim(both '-' from
    regexp_replace(
      regexp_replace(
        lower(extensions.unaccent(value)),
        '[^a-z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2 — INSERT (idempotent: skips slugs already present in blog_posts)
-- ─────────────────────────────────────────────────────────────────────────────
insert into blog_posts (
  titulo, slug, bajada, cuerpo, portada_url, imagenes, autor, tags,
  visibilidad, fecha, status, created_at, updated_at
)
select
  n.titulo,
  slugify(n.titulo)                       as slug,
  n.bajada,
  n.cuerpo,
  n.imagen_url                            as portada_url,
  '{}'::text[]                            as imagenes,
  'Equipo CASC'                           as autor,
  -- categoria (single free-text) → tags array; empty array when absent.
  case
    when n.categoria is not null and btrim(n.categoria) <> ''
      then array[btrim(n.categoria)]
    else '{}'::text[]
  end                                     as tags,
  'socios'                                as visibilidad,
  n.fecha,
  n.status,
  n.created_at,
  n.updated_at
from noticias n
where not exists (
  select 1 from blog_posts b where b.slug = slugify(n.titulo)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 3 — VERIFY AFTER INSERTING
-- ─────────────────────────────────────────────────────────────────────────────
-- Confirm the migrated rows landed as 'socios':
--     select count(*) from blog_posts where visibilidad = 'socios';
--
-- The `noticias` table is intentionally LEFT IN PLACE (deprecated). Do not drop
-- it until this migration is verified in production. Its cleanup (dropping the
-- table, its admin page and publicNoticias) is a separate, later change.
