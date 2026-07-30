import "server-only";
import { getDataLayer } from "@/lib/data";
import type { MemberState } from "@/lib/types/domain";

/**
 * Resolve a member's `estado` (activo/inactivo) from the socios store by email.
 *
 * The platform guard authenticates via Clerk (identity + role), but a member's
 * active/inactive state lives in the `socios` table, not in Clerk. A socio who
 * is set to "inactivo" (or removed) keeps their Clerk account, so without this
 * check they could still sign in. The socio layout calls this to bounce an
 * inactive member out — reversibly: reactivating them restores access with no
 * re-invitation.
 *
 * Matching is by email (case-insensitive), the stable link between a Clerk user
 * and their socio record. Returns null when no socio row matches the email
 * (e.g. an admin, who has no `estado`) — callers treat null as "not gated".
 */
export async function getMemberEstado(
  email: string,
): Promise<MemberState | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  const socios = await getDataLayer().socios.list();
  const match = socios.find(
    (s) => s.email.trim().toLowerCase() === normalized,
  );
  return match?.estado ?? null;
}
