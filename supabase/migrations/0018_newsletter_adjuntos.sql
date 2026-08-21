-- Migration 0018 — Extra attachments on newsletter editions
--
-- An edition often ships with more than the newsletter itself: the magazine,
-- an annexed report, a supplementary PDF. `adjunto_url` still holds the main
-- edition (PDF or campaign link) and is unchanged; this column holds the
-- optional extras.
--
-- jsonb (not text[]) because each extra needs a label besides its URL: the
-- socio has to know whether they are downloading "Revista N° 12" or an annex,
-- and a bare list of URLs cannot carry that. Shape: [{"titulo": …, "url": …}].
-- Read whole, never queried by element, so no join table.

alter table newsletters
  add column adjuntos jsonb;
