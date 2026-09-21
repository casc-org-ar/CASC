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
 * `pendiente` says whether the survey should be OFFERED, `esAdmin` says whose
 * answer it would be. An admin sees exactly what a member sees — the socio
 * view exists to preview the member experience, and a view that leaves out
 * the survey previews nothing — and can submit too, so the form can be tried
 * end to end before CASC sends it out. Their answer is stored as a test
 * (`esPrueba`), because there is no member row for it to belong to.
 *
 * A member who already answered gets neither the CTA nor the form: they have
 * had their turn, and showing it again would invite an edit the platform
 * refuses.
 */
export interface EncuestaEstado {
  /**
   * True when the survey should be OFFERED to this caller — it drives the
   * home CTA and the survey page.
   */
  pendiente: boolean;
  /**
   * The member's `socios` row id. Null for an admin, whose answers belong to
   * no member and are stored as tests.
   */
  socioId: string | null;
  /**
   * True when the caller is an admin trying the form out. Their submission is
   * recorded with `esPrueba`, so CASC's real results stay clean.
   */
  esAdmin: boolean;
}

export async function getEncuestaEstado(): Promise<EncuestaEstado> {
  const user = await getAuth().getCurrentUser();
  // An admin is offered the survey like any member, and may submit it: that is
  // the only way to check the form actually saves before it goes out. They
  // have no `socios` row, so what they send is flagged as a test.
  if (user?.role === "admin") {
    return { pendiente: true, socioId: null, esAdmin: true };
  }

  const socioId = await socioIdActual();
  if (!socioId) return { pendiente: false, socioId: null, esAdmin: false };

  // Under Supabase, RLS already limits this to the member's own answer. The
  // in-memory mock has no RLS and returns every row, so both filters are
  // applied here: matching on `socioId` keeps the two implementations
  // behaving identically, which is the whole point of the port.
  const respuestas = await getDataLayer().encuesta.list();
  const yaRespondio = respuestas.some(
    (r) => r.socioId === socioId && r.encuestaSlug === ENCUESTA_SLUG_ACTUAL,
  );

  return { pendiente: !yaRespondio, socioId, esAdmin: false };
}
