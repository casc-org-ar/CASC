-- Migration 0020 — Editor-selected highlights via a `destacado` column
--
-- The socio panel highlighted whatever item happened to be newest (`all[0]` in
-- the home feed): the choice was computed, never made. So the team could not
-- promote an article that mattered, and only ever ONE could be highlighted.
--
-- `destacado` lets an admin mark an article from the panel. Several can be
-- marked at once, which is what the Cámara asked for; the home feed reads the
-- flag instead of assuming the newest item.
--
-- Default false, so every existing article keeps its current behaviour and the
-- feed simply has no highlights until someone picks one.

alter table blog_posts
  add column destacado boolean not null default false;

-- Partial index: the feed queries "published highlights, newest first", and
-- highlights are a small subset of the table. Indexing only the flagged rows
-- keeps it small while covering exactly that read.
create index blog_destacado_fecha
  on blog_posts (fecha desc)
  where destacado and status = 'publicado';
