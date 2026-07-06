import type { CurrentUser, UserRole } from "@/lib/types/domain";

/**
 * Auth contract (the "port"). The mock implementation satisfies it now;
 * a Clerk implementation satisfies it later. Components call these methods
 * and never know which provider is behind them.
 */
export interface AuthProvider {
  getCurrentUser(): Promise<CurrentUser | null>;
  getRole(): Promise<UserRole | null>;
  signIn(role: UserRole): Promise<void>;
  signOut(): Promise<void>;
}

export type { CurrentUser, UserRole };
