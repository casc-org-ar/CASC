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
