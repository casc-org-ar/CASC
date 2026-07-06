import type { AuthProvider } from "@/lib/auth/types";
import { mockAuth } from "@/lib/auth/mock-auth";

/**
 * Single entry point to auth. The only place that picks an implementation.
 * Swap to a Clerk-backed provider here later — components are untouched.
 */
export function getAuth(): AuthProvider {
  return mockAuth;
}

export type { AuthProvider, CurrentUser, UserRole } from "@/lib/auth/types";
