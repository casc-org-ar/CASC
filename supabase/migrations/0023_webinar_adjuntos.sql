-- Migration 0023 — Several attachments per webinar
--
-- A webinar usually ships with more than one file: the deck, an annexed
-- report, the speaker's material. `material_adjunto_url` is a single text
-- column, so only one could ever be stored — an admin with two PDFs had no
-- way to publish the second.
--
-- Same shape and reasoning as newsletters (migration 0018): jsonb, not
-- text[], because each file needs a label besides its URL — the socio has to
-- know whether they are downloading "Presentación" or "Informe anexo", and a
-- bare list of URLs cannot carry that. Read whole, never queried by element,
-- so no join table. Shape: [{"titulo": …, "url": …}].

alter table webinars
  add column adjuntos jsonb;

-- Carry the existing single attachment into the list so nothing published so
-- far disappears from the detail page. `material_adjunto_url` is deliberately
-- LEFT IN PLACE and still read as a fallback: dropping a column in the same
-- migration that starts populating its replacement leaves no way back if the
-- backfill is wrong.
update webinars
   set adjuntos = jsonb_build_array(
         jsonb_build_object('titulo', 'Material adjunto',
                            'url', material_adjunto_url)
       )
 where material_adjunto_url is not null
   and length(trim(material_adjunto_url)) > 0;
