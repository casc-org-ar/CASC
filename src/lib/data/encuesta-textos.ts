import "server-only";
import { getDataLayer } from "@/lib/data";
import {
  ENCUESTA_SLUG_ACTUAL,
  ENCUESTA_TEXTOS_ORIGINALES,
  type EncuestaTextos,
} from "@/lib/types/domain";

/**
 * The survey's wording as it stands right now.
 *
 * Reads what CASC saved from the panel, falling back to the original texts
 * when they have never edited it — which is every install until the first
 * save, so the fallback is the normal path, not an error case.
 *
 * Merged field by field rather than returned whole: a stored document written
 * by an older version of the panel could be missing a key added since, and a
 * missing question would render as an empty label with no hint of why. Taking
 * the original as the base means a new field always has a sensible text until
 * someone edits it.
 */
export async function getEncuestaTextos(
  slug: string = ENCUESTA_SLUG_ACTUAL,
): Promise<EncuestaTextos> {
  const guardados = await getDataLayer().encuestaTextos.get(slug);
  if (!guardados) return ENCUESTA_TEXTOS_ORIGINALES;
  return { ...ENCUESTA_TEXTOS_ORIGINALES, ...guardados };
}

