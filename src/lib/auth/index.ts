import type { AuthProvider } from "@/lib/auth/types";
import { mockAuth } from "@/lib/auth/mock-auth";
import { clerkAuth } from "@/lib/auth/clerk-auth";
import { clerkEnabled } from "@/lib/auth/flag";

/**
 * Single entry point to auth. The only place that picks an implementation.
 * Consumers depend on the `AuthProvider` port and never see which one runs.
 *
 * Provider selection is env-driven so the same code runs the mock locally
 * and Clerk in production:
 *   NEXT_PUBLIC_AUTH_PROVIDER=clerk → real Clerk sessions
 *   anything else / unset          → in-memory mock (dev, tests, prototype)
 *
 * A single NEXT_PUBLIC_ flag (not a server-only one) so client components can
 * read the same source of truth — no risk of a server/client flag drifting.
 */
export function getAuth(): AuthProvider {
  return clerkEnabled() ? clerkAuth : mockAuth;
}

// Re-export so server callers can keep importing the flag from "@/lib/auth".
export { clerkEnabled } from "@/lib/auth/flag";

export type { AuthProvider, CurrentUser, UserRole } from "@/lib/auth/types";
