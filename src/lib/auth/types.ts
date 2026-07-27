import type { CurrentUser, UserRole } from "@/lib/types/domain";

/**
 * Auth contract (the "port"). The mock implementation satisfies it now;
 * a Clerk implementation satisfies it later. Components call these methods
 * and never know which provider is behind them.
 *
 * Read-only by design. Establishing a session is the identity provider's job,
 * not this port's: a `signIn(role)` here would let any caller pick their own
 * role — a privilege-escalation hole. Real sign-in happens through Clerk's
 * flow (credentials verified server-side, role read from metadata); sign-out
 * happens through Clerk's client (`useClerk().signOut()`). This port only
 * answers "who is the current user, as already established by the provider?".
 */
export interface AuthProvider {
  getCurrentUser(): Promise<CurrentUser | null>;
  getRole(): Promise<UserRole | null>;
}

export type { CurrentUser, UserRole };
