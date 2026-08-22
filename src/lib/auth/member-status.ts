import "server-only";
import { getDataLayer } from "@/lib/data";
import type { MemberState } from "@/lib/types/domain";

/**
 * Why a member can be blocked. The socio layout needs to tell two very
 * different situations apart, because they look identical from `estado` alone:
 *
 *  - "inactivo": the member exists and was deliberately given de baja.
 *  - "sin-vincular": the member's socios row is not linked to their Clerk user
 *    yet, so RLS cannot return it. This is the transient window right after
 *    accepting an invitation, before the `user.created` webhook lands.
 *
 * Showing "tu cuenta fue desactivada" to someone in the second case is wrong —
 * nobody deactivated them, the link just has not happened yet.
 */
export type MemberAccess =
  | { allowed: true; estado: MemberState }
  | { allowed: false; reason: "inactivo" | "sin-vincular" };

/**
 * Resolve whether the current member may enter the platform.
 *
 * IMPORTANT — this must agree with RLS. The `socios_select_self` policy
 * (migration 0004) filters by `clerk_user_id() = socios.clerk_user_id`, so an
 * authenticated socio can only ever read their OWN row, and only once that row
 * carries their `clerk_user_id`.
 *
 * The previous implementation listed socios and matched by email in JS. That
 * asked a different question than the database answered: with `clerk_user_id`
 * still null, RLS returned nothing, the email match found nothing, and an
 * `activo` member was bounced to /cuenta-inactiva. Matching on the same key RLS
 * uses removes that whole class of mismatch — the row RLS returns IS the
 * caller's row, so there is nothing left to filter client-side.
 *
 * Returns "sin-vincular" when RLS yields no row (not yet linked) and
 * "inactivo" only when the row is really there and set to inactive.
 */
export async function getMemberAccess(): Promise<MemberAccess> {
  // RLS scopes this to the caller's own row, so at most one comes back.
  const socios = await getDataLayer().socios.list();
  const own = socios[0];

  // No row visible → the link is missing, NOT a deactivation.
  if (!own) return { allowed: false, reason: "sin-vincular" };
  if (own.estado !== "activo") return { allowed: false, reason: "inactivo" };
  return { allowed: true, estado: own.estado };
}
