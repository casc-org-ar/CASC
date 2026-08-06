-- Migration 0017 — Visibilidad on actividades
--
-- Activities get the same audience selector as blog_posts: an activity can
-- target the members panel ('socios'), the public site ('publico'), or both
-- ('ambos'). Default 'ambos' so every existing activity keeps showing in both
-- places (its current behaviour).

alter table actividades
  add column visibilidad text not null default 'ambos'
  check (visibilidad in ('socios', 'publico', 'ambos'));
