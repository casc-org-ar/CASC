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
 * The current caller's own `socios` row id, or null when they have none.
 *
 * Matched on `clerk_user_id`, which is the identity the session actually
 * carries — NOT `socios[0]`, and NOT the Clerk role.
 *
 * Both of those were wrong, for opposite reasons:
 *
 *  - `socios[0]` assumes RLS returned exactly one row. True for a member
 *    (`socios_select_self` narrows it to their own), but an admin also has
 *    `socios_admin_all` and gets EVERY row — so the first one is whoever the
 *    table happens to list first, not them.
 *  - Requiring `role === "socio"` assumed an admin never has a member row.
 *    That turned out to be false: CASC staff who also represent a shopping
 *    are loaded as socios AND hold an admin account, and they were refused
 *    the survey while their own member row sat there, active and linked.
 *
 * Matching the row to the signed-in Clerk user answers the real question —
 * "is there a member row that belongs to whoever is asking?" — and gives the
 * same answer however many rows RLS hands back. It also settles the mock,
 * which has no RLS and returns everyone.
 *
 * Inactive rows are excluded: a member given de baja is already bounced from
 * the panel by `getMemberAccess`, and the survey must not outlive that.
 */
async function socioIdActual(): Promise<string | null> {
  const user = await getAuth().getCurrentUser();
  if (!user) return null;

  const socios = await getDataLayer().socios.list();
  const propio = socios.find(
    (s) => s.clerkUserId === user.id && s.estado === "activo",
  );
  return propio?.id ?? null;
}

/**
 * Survey state for whoever is viewing the panel.
 *
 * `socioId` is returned alongside because the submit action needs it to stamp
 * the row, and resolving it twice would ask the same question twice.
 *
 * `pendiente` says whether the survey should be OFFERED, `socioId` says whose
 * answer it would be. What decides that is HAVING A MEMBER ROW, not the Clerk
 * role: several CASC staff also represent a shopping, so they hold an admin
 * account and a `socios` row at once. Their answer is a real member's answer
 * and must count as one.
 *
 * Someone with no member row — an admin who is only staff — is still offered
 * the survey, and may submit it: it is the only way to check the form saves
 * before it goes out. Those submissions are flagged `esPrueba` and stay out
 * of CASC's results.
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
   * The caller's own `socios` row id, when they have one. Null for an account
   * with no member row, whose answers are stored as tests.
   */
  socioId: string | null;
  /**
   * True when the answer would be a TEST — the caller has no member row to
   * attribute it to. Named for what it does, not for the role: an admin who
   * is also a socio answers for real, and this is false for them.
   */
  esAdmin: boolean;
}

export async function getEncuestaEstado(): Promise<EncuestaEstado> {
  // The member row is resolved FIRST, before the role is even considered:
  // checking the role first refused the survey to CASC staff who are also
  // socios, while their own active, linked row sat right there.
  const socioId = await socioIdActual();

  if (!socioId) {
    const user = await getAuth().getCurrentUser();
    // No member row. An admin still gets the form (to try it end to end); its
    // submission is recorded as a test. Anyone else is offered nothing.
    const esAdmin = user?.role === "admin";
    return { pendiente: esAdmin, socioId: null, esAdmin };
  }

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
