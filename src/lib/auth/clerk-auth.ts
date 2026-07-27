import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { AuthProvider } from "@/lib/auth/types";
import type { CurrentUser, UserRole } from "@/lib/types/domain";

/**
 * Clerk-backed auth provider. Satisfies the read-only `AuthProvider` port:
 * it answers "who is the current user?" from the verified Clerk session.
 * Establishing/ending a session is Clerk's own flow, not this port's.
 *
 * Role model: the app role ("admin" | "socio") lives in the user's Clerk
 * `publicMetadata.role`, surfaced into the session token via a custom claim.
 * We read it from `sessionClaims` (the same token Supabase RLS reads), with a
 * fallback to `publicMetadata` for the rare case the claim is not yet on the
 * token. The role is NEVER taken from client-supplied input — only from the
 * Clerk-signed session.
 */

/** Narrow an unknown claim value to a valid UserRole, or null. */
function toRole(value: unknown): UserRole | null {
  return value === "admin" || value === "socio" ? value : null;
}

export const clerkAuth: AuthProvider = {
  async getRole(): Promise<UserRole | null> {
    const { sessionClaims } = await auth();
    if (!sessionClaims) return null;
    // Custom claim shapes we support: top-level `metadata.role` (recommended
    // JWT claim path) mirrors what the RLS `current_app_role()` reads.
    const claimRole =
      (sessionClaims.metadata as { role?: unknown } | undefined)?.role ??
      (sessionClaims as { role?: unknown }).role;
    const fromClaim = toRole(claimRole);
    if (fromClaim) return fromClaim;

    // Fallback: read straight from the user record if the claim is absent.
    const user = await currentUser();
    return toRole(user?.publicMetadata?.role);
  },

  async getCurrentUser(): Promise<CurrentUser | null> {
    const user = await currentUser();
    if (!user) return null;

    const role = await clerkAuth.getRole();
    if (!role) return null;

    const email =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      "";
    const nombre =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      email;

    const shopping = user.publicMetadata?.shopping;

    return {
      id: user.id,
      nombre,
      email,
      role,
      shopping: typeof shopping === "string" ? shopping : undefined,
    };
  },
};
