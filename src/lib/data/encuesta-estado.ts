import "server-only";
import { getAuth } from "@/lib/auth";
import { getDataLayer } from "@/lib/data";
import { ENCUESTA_SLUG_ACTUAL } from "@/lib/types/domain";

/**
 * Thrown when the survey is submitted by an account that cannot answer it.
 *
 * It lives here and not beside the action because a `"use server"` module may
 * only export async functions — exporting a class from one makes Next drop
 * every export in the file, and the form's import of the action breaks at
 * build time. `UnauthorizedError` sits in `auth/guard.ts` for the same reason.
 */
export class EncuestaNoDisponibleError extends Error {
  constructor(message = "La encuesta no está disponible para esta cuenta.") {
    super(message);
    this.name = "EncuestaNoDisponibleError";
  }
}

/**
 * Whether the current member still has the survey pending.
 *
 * This is what decides if the home CTA shows: "una vez que el usuario
 * respondió que no le aparezca de nuevo". The answer is derived from the data
 * — there is no "dismissed" flag to keep in sync, and no date to expire. The
 * survey is open indefinitely and closes for a member the moment they submit.
 */

/**
 * The current member's `socios` row id, or null when there is none.
 *
 * Resolved by EMAIL, not by taking the first row.
 *
 * Under Supabase, `socios_select_self` (migration 0004) already narrows the
 * list to the caller's own row, so `socios[0]` would be right — but only
 * there. The in-memory mock has no RLS and returns every member, so the first
 * row is simply whoever the seed happens to list first. Matching on the
 * authenticated identity gives the same answer under both implementations,
 * which is the point of having one port over two adapters.
 *
 * It also settles a case RLS covers and the mock does not: an admin previewing
 * the socio surface. They have no socios row, so they resolve to null and are
 * never offered a survey they would be answering as somebody else.
 *
 * Email is the join key because it is what identifies a member before Clerk
 * links their account, and the database keeps it unique case-insensitively
 * (`socios_email_unique`, migration 0001) — so the comparison is lowercased
 * here to match.
 */
async function socioIdActual(): Promise<string | null> {
  const user = await getAuth().getCurrentUser();
  if (!user || user.role !== "socio") return null;

  const socios = await getDataLayer().socios.list();
  const email = user.email.trim().toLowerCase();
  const propio = socios.find((s) => s.email.trim().toLowerCase() === email);
  return propio?.id ?? null;
}

/**
 * Survey state for the member viewing the panel.
 *
 * `socioId` is returned alongside because the submit action needs it to stamp
 * the row, and resolving it twice would ask the same question twice.
 *
 * An admin gets `{ pendiente: false }`: the survey is for members, and the CTA
 * has nothing to offer someone who cannot answer. Same for a member whose row
 * cannot be resolved — under Clerk they would not pass the insert policy
 * either, so offering the survey would only produce an error.
 */
export interface EncuestaEstado {
  /** True when this member can still answer — drives the home CTA. */
  pendiente: boolean;
  /** The member's `socios` row id, when they have one. */
  socioId: string | null;
}

export async function getEncuestaEstado(): Promise<EncuestaEstado> {
  const socioId = await socioIdActual();
  if (!socioId) return { pendiente: false, socioId: null };

  // Under Supabase, RLS already limits this to the member's own answer. The
  // in-memory mock has no RLS and returns every row, so both filters are
  // applied here: matching on `socioId` keeps the two implementations
  // behaving identically, which is the whole point of the port.
  const respuestas = await getDataLayer().encuesta.list();
  const yaRespondio = respuestas.some(
    (r) => r.socioId === socioId && r.encuestaSlug === ENCUESTA_SLUG_ACTUAL,
  );

  return { pendiente: !yaRespondio, socioId };
}
