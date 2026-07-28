-- Migration 0009 — Public (anonymous) read of published content
--
-- The public website (no login) renders published content: news, blog posts and
-- hotel benefits. The 0004 policies only granted SELECT to members (is_member),
-- so anonymous readers could see nothing. This adds a narrow policy: anon may
-- read ONLY rows with status = 'publicado', never drafts, and only on the tables
-- the public site actually shows.
--
-- Scope is deliberately minimal:
--   - blog_posts, noticias, hoteles: public may read PUBLISHED rows.
--   - webinars, informes, newsletters: members-only (NOT added here) — they live
--     behind the socio login, never on the public site.
--   - candidatos, socios, solicitudes, consultas: never public.
--
-- These are additive SELECT policies. Postgres RLS is permissive by default, so
-- a row is visible if ANY policy allows it: members keep their access, and anon
-- additionally gets published-only.

create policy blog_public_read_published on blog_posts
  for select to anon
  using (status = 'publicado');

create policy noticias_public_read_published on noticias
  for select to anon
  using (status = 'publicado');

create policy hoteles_public_read_published on hoteles
  for select to anon
  using (status = 'publicado');
