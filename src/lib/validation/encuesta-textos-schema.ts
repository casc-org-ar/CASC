import { z } from "zod";

/**
 * Zod schema for the survey's editable wording.
 *
 * Validated here and not in the database: Postgres can guarantee the column
 * holds JSON, not that the document carries all nine questions with usable
 * text. An admin saving a blank question would leave the form rendering an
 * unlabelled control, so every field is required and bounded.
 *
 * Bounds are generous but real: a question is a sentence, not an essay, and a
 * label that overflows its control breaks the layout for every member.
 */

const LIMITS = {
  /** Page and banner headings. */
  titulo: 120,
  /** Question wording and the banner's body. */
  pregunta: 300,
  /** Scale endpoints, which sit under a five-button row. */
  extremo: 40,
  /** One option of a choice question. */
  opcion: 80,
  /** How many options a choice question may offer. */
  opciones: 12,
} as const;

const texto = (max: number) => z.string().trim().min(1).max(max);

/**
 * The options of a choice question.
 *
 * At least two, because a single-option question asks nothing. Duplicates are
 * rejected: the answers are stored by their text, so two identical options
 * would be indistinguishable once submitted — and would double-count in the
 * panel's distribution.
 */
const opciones = z
  .array(texto(LIMITS.opcion))
  .min(2, "Ofrecé al menos dos opciones")
  .max(LIMITS.opciones)
  .refine(
    (list) => new Set(list.map((o) => o.toLowerCase())).size === list.length,
    { message: "No repitas opciones" },
  );

export const encuestaTextosSchema = z.object({
  titulo: texto(LIMITS.titulo),
  subtitulo: texto(LIMITS.pregunta),
  ctaTitulo: texto(LIMITS.titulo),
  ctaDescripcion: texto(LIMITS.pregunta),

  satisfaccionServicios: texto(LIMITS.pregunta),
  satisfaccionMin: texto(LIMITS.extremo),
  satisfaccionMax: texto(LIMITS.extremo),
  utilidadComunicacion: texto(LIMITS.pregunta),
  utilidadMin: texto(LIMITS.extremo),
  utilidadMax: texto(LIMITS.extremo),
  queMejorarias: texto(LIMITS.pregunta),

  temasPrioritarios: texto(LIMITS.pregunta),
  temasOpciones: opciones,
  participacionAcciones: texto(LIMITS.pregunta),
  canalesPreferidos: texto(LIMITS.pregunta),
  canalesOpciones: opciones,

  facilidadPortal: texto(LIMITS.pregunta),
  facilidadMin: texto(LIMITS.extremo),
  facilidadMax: texto(LIMITS.extremo),
  funcionalidadSugerida: texto(LIMITS.pregunta),
  dispositivoPrincipal: texto(LIMITS.pregunta),
});

export type EncuestaTextosInput = z.infer<typeof encuestaTextosSchema>;

/**
 * Split a textarea of options into a list: one per line, blanks dropped.
 *
 * A line-per-option textarea rather than a repeatable row widget — the lists
 * are four items long, and typing them is faster than clicking "add" four
 * times. Trimming and dropping blanks means a stray newline is not an error
 * the admin has to hunt down.
 */
export function parseOpciones(valor: FormDataEntryValue | null): string[] {
  return String(valor ?? "")
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean);
}
