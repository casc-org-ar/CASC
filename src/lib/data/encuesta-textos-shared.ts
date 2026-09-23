import {
  ENCUESTA_TEXTOS_ORIGINALES,
  type EncuestaTextos,
} from "@/lib/types/domain";

/**
 * The wording a stored answer was given.
 *
 * Answers carry a snapshot of the texts their author read. Ones stored before
 * the wording became editable (migration 0026) have none, and those were
 * answered against the original texts — so that is what they resolve to.
 *
 * This is what keeps the panel and the CSV honest after an edit: a question
 * reworded today must not be shown over an answer written under the old one.
 *
 * Lives apart from `encuesta-textos.ts` because that module is `server-only`
 * (it reads the data layer) and this runs in the admin panel, a client
 * component. It needs nothing but the answer it is handed.
 */
export function textosDeRespuesta(
  textos: EncuestaTextos | undefined,
): EncuestaTextos {
  if (!textos) return ENCUESTA_TEXTOS_ORIGINALES;
  // Merged over the originals so a snapshot written by an older version, or
  // missing a field added since, still renders a real question instead of an
  // empty label.
  return { ...ENCUESTA_TEXTOS_ORIGINALES, ...textos };
}
