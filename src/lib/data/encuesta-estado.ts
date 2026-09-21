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
 * Reads the row the SAME way `getMemberAccess` does — `socios[0]`, trusting
 * `socios_select_self` (migration 0004) to have narrowed the list to the
 * caller's own row. Consistency matters here: the layout already used that
 * row to let this member in, so resolving it differently could disagree with
 * the guard that just ran.
 *
 * An earlier version matched on the member's email instead, to cover the mock
 * (which has no RLS and returns everyone). That traded a real problem for a
 * worse one: under Clerk the session email and the `socios` row email come
 * from different places, so any divergence — an alias, a different case, a
 * `+tag` — resolved to no row and silently hid the survey from a member who
 * could perfectly well answer it. RLS already answers "which row is yours",
 * and asking a second, weaker question could only contradict it.
 *
 * The mock is handled by the role check instead: an admin previewing the socio
 * surface is not a member and gets no row, so they are never offered a survey
 * they would be answering as somebody else. Under Clerk that check is
 * redundant (an admin has no socios row at all), which is exactly what makes
 * it safe.
 */
async function socioIdActual(): Promise<string | null> {
  const user = await getAuth().getCurrentUser();
  if (!user || user.role !== "socio") return null;

  const socios = await getDataLayer().socios.list();
  return socios[0]?.id ?? null;
}

/**
 * Survey state for whoever is viewing the panel.
 *
 * `socioId` is returned alongside because the submit action needs it to stamp
 * the row, and resolving it twice would ask the same question twice.
 *
 * `pendiente` drives what the panel SHOWS: the home CTA and the survey page.
 * `soloLectura` drives what it ACCEPTS. They are deliberately separate,
 * because an admin previewing the socio surface should see exactly what a
 * member sees — the socio view is there to preview the member experience, and
 * a view that hides part of it previews nothing.
 *
 * So an admin gets `pendiente: true` (the CTA shows, the form opens) with
 * `soloLectura: true` (the submit is closed, and the action refuses it
 * anyway). A member who already answered gets neither: they have had their
 * turn, and showing them the form again would invite an edit the platform
 * refuses.
 */
export interface EncuestaEstado {
  /**
   * True when the survey should be OFFERED to this caller — it drives the
   * home CTA and the survey page. Not the same as being able to answer: see
   * `soloLectura`.
   */
  pendiente: boolean;
  /** The member's `socios` row id, when they have one. */
  socioId: string | null;
  /**
   * True for a caller who may LOOK at the survey but not answer it: today,
   * an admin. They have no `socios` row, so the insert policy would refuse
   * their answer — read-only is the honest way to show a form that could
   * never be submitted.
   */
  soloLectura: boolean;
}

export async function getEncuestaEstado(): Promise<EncuestaEstado> {
  const user = await getAuth().getCurrentUser();
  // An admin sees the survey as a member would — CTA included — but cannot
  // answer it. Hiding it from them would make the socio view a preview that
  // leaves out the very thing being previewed.
  if (user?.role === "admin") {
    return { pendiente: true, socioId: null, soloLectura: true };
  }

  const socioId = await socioIdActual();
  if (!socioId) return { pendiente: false, socioId: null, soloLectura: false };

  // Under Supabase, RLS already limits this to the member's own answer. The
  // in-memory mock has no RLS and returns every row, so both filters are
  // applied here: matching on `socioId` keeps the two implementations
  // behaving identically, which is the whole point of the port.
  const respuestas = await getDataLayer().encuesta.list();
  const yaRespondio = respuestas.some(
    (r) => r.socioId === socioId && r.encuestaSlug === ENCUESTA_SLUG_ACTUAL,
  );

  return { pendiente: !yaRespondio, socioId, soloLectura: false };
}
