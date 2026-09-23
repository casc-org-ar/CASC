import { z } from "zod";
import { type EscalaRespuesta } from "@/lib/types/domain";

/**
 * Zod schema for the member satisfaction survey.
 *
 * Kept apart from `admin-schemas.ts` because the author is different: those
 * validate what a CASC admin writes, this validates what a MEMBER submits.
 * Input from a member is less trusted than input from an admin, and the server
 * action is a public HTTP endpoint either way — so this is the gate that
 * decides what reaches the database, not the form.
 *
 * It intentionally mirrors the database constraints in migration 0023 (1-5
 * scales, the two enums). Both layers check: the schema so the member gets a
 * readable error, the database so nothing invalid can ever land, whatever the
 * app does.
 */

/** Free-text answer caps. Long enough for a real comment, bounded so a paste-bomb can't land. */
const LIMITS = { abierta: 2000, otro: 120 } as const;

/**
 * A 1-5 rating. The form posts strings (FormData has no numbers), so the value
 * is coerced before being matched against the allowed ratings.
 *
 * Built from an explicit list rather than `.min(1).max(5)` so it infers as
 * `EscalaRespuesta` (the union `1 | 2 | 3 | 4 | 5`) instead of plain `number`.
 * A range check validates at runtime but tells the type system nothing, which
 * would leave a cast standing between here and the domain — and a cast is
 * exactly the place a future off-by-one would slip through unnoticed.
 */
const ESCALA_VALIDA = [1, 2, 3, 4, 5] as const satisfies readonly EscalaRespuesta[];

const escala = z.coerce
  .number()
  .int()
  .refine(
    (n): n is EscalaRespuesta =>
      (ESCALA_VALIDA as readonly number[]).includes(n),
    { message: "Elegí un valor de 1 a 5" },
  );

/** An optional open answer: blank becomes undefined rather than an empty row value. */
const abierta = z
  .string()
  .trim()
  .max(LIMITS.abierta)
  .transform((s) => s || undefined)
  .optional();

/**
 * Multi-choice answers arrive as repeated form fields, which
 * `formData.getAll()` returns as an array. Each entry must be one of the
 * offered options, EXCEPT the topics question, which allows a free-text
 * "Otro" — see below.
 *
 * Shaped as free text here and checked against the offered list in the action:
 * a `z.enum` would have to be built from a constant, and the options are now
 * edited from the admin panel, so the constant would reject exactly the
 * choices CASC just published.
 */
const canales = z
  .array(z.string().trim().min(1).max(LIMITS.otro))
  .min(1, "Elegí al menos un canal");

/**
 * Topics: the offered options plus whatever the member typed under "Otro".
 *
 * A plain `z.enum` would reject the custom topic, which is precisely the
 * answer worth reading. Free text is accepted but capped, and `min(1)` keeps
 * the question from being submitted empty — the survey asks it to learn
 * priorities, and an empty answer teaches nothing.
 */
const temas = z
  .array(z.string().trim().min(1).max(LIMITS.otro))
  .min(1, "Elegí al menos un tema");

export const encuestaSchema = z.object({
  // Eje 1 — Satisfacción general
  satisfaccionServicios: escala,
  utilidadComunicacion: escala,
  queMejorarias: abierta,

  // Eje 2 — Prioridades y participación
  temasPrioritarios: temas,
  participacionAcciones: z.enum(["si", "no", "depende"]),
  canalesPreferidos: canales,

  // Eje 3 — Portal
  facilidadPortal: escala,
  funcionalidadSugerida: abierta,
  dispositivoPrincipal: z.enum(["celular", "desktop"]),
});

export type EncuestaInput = z.infer<typeof encuestaSchema>;

/** Field names carrying the free-text "Otro" topic, shared by the form and the action. */
export const CAMPO_TEMA_OTRO = "temaOtro";

/**
 * Build the topics list from the submitted form.
 *
 * The checkbox for "Otro" and the text beside it are two separate fields: the
 * member ticks the box, then types. Only the typed value is stored — "Otro" as
 * a literal would be noise in the export, since it names no topic. Ticking the
 * box and leaving the text empty therefore contributes nothing, which the
 * `min(1)` above turns into a visible error only if it was their sole answer.
 *
 * @param ofrecidas The options the form actually rendered. Passed in rather
 * than read from a constant: CASC edits these from the panel, and filtering
 * against a hard-coded list would silently drop every answer as soon as they
 * did. The filter still matters — it is what stops a crafted submission from
 * inserting a topic nobody was offered.
 */
export function construirTemas(
  formData: FormData,
  ofrecidas: readonly string[],
): string[] {
  const elegidos = formData
    .getAll("temasPrioritarios")
    .map(String)
    .filter((t) => ofrecidas.includes(t));
  const otro = String(formData.get(CAMPO_TEMA_OTRO) ?? "").trim();
  return otro ? [...elegidos, otro] : elegidos;
}
