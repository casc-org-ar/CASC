-- Migration 0010 — Unify blog + noticias via a `visibilidad` column
--
-- Editorial content used to live in two tables: `blog_posts` (public site) and
-- `noticias` (members panel). The admin had to load the same article twice to
-- reach both audiences. We unify on `blog_posts` (the richer table) and add a
-- `visibilidad` column so a single article can target the members panel, the
-- public site, or both.
--
-- Values:
--   'publico' — shown only on the public site (/noticias, home).
--   'socios'  — shown only in the members panel (/socio/noticias).
--   'ambos'   — shown in both.
--
-- Default is 'publico' so every existing blog post keeps its current behaviour
-- (it was public-only). The `noticias` table stays in place, deprecated, until
-- its rows are migrated and verified in production (see the data-migration
-- script that copies them into blog_posts as 'socios').

alter table blog_posts
  add column visibilidad text not null default 'publico'
  check (visibilidad in ('socios', 'publico', 'ambos'));
