-- Migration 0021 — Sortable event date for actividades
--
-- `actividades.fecha` is free text the admin types, so the listing could not be
-- ordered by it: the stored values mix formats ("8 de mayo", "13 de agosto
-- 2026", "28 de mayo de 2026"). The listing therefore ordered by `created_at`
-- (publication time) while each card DISPLAYS the event date — sorting on one
-- field and showing another, which reads as broken.
--
-- `fecha_evento` adds the real, sortable date. `fecha` stays as the display
-- string so wording the team chose ("Del 8 al 10 de mayo") is not lost.

alter table actividades
  add column fecha_evento date;

-- ---------------------------------------------------------------------------
-- Backfill: parse the Spanish free-text dates already stored, so ordering works
-- immediately instead of waiting for someone to re-edit all eight activities.
--
-- Handles "8 de mayo", "13 de agosto 2026" and "28 de mayo de 2026": day,
-- month name, and an optional year that defaults to the publication year.
-- Rows that do not match (empty or unparseable) keep NULL and fall back to
-- publication order.
-- ---------------------------------------------------------------------------
update actividades
   set fecha_evento = make_date(
         coalesce(
           nullif(substring(fecha from '(\d{4})'), '')::int,
           extract(year from created_at)::int
         ),
         case lower(substring(lower(fecha) from '(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)'))
           when 'enero' then 1
           when 'febrero' then 2
           when 'marzo' then 3
           when 'abril' then 4
           when 'mayo' then 5
           when 'junio' then 6
           when 'julio' then 7
           when 'agosto' then 8
           when 'septiembre' then 9
           when 'setiembre' then 9
           when 'octubre' then 10
           when 'noviembre' then 11
           when 'diciembre' then 12
         end,
         substring(fecha from '^\D*(\d{1,2})')::int
       )
 where fecha is not null
   and substring(fecha from '^\D*(\d{1,2})') is not null
   and lower(fecha) ~ '(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)';

-- Index matching how the listing reads: published activities, newest event first.
create index actividades_fecha_evento
  on actividades (fecha_evento desc nulls last)
  where status = 'publicado';
