import "server-only";
import { getAuth } from "@/lib/auth";
import type { CurrentUser, UserRole } from "@/lib/types/domain";

/** Thrown when a server action is called by an unauthorized user. */
export class UnauthorizedError extends Error {
  constructor(message = "No autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Authorize a server action by role. Server actions are public HTTP
 * endpoints — the route layout guard only protects navigation, NOT action
 * execution. Every mutating action MUST call this itself; never rely on
 * where the action is mounted.
 */
export async function requireRole(role: UserRole): Promise<CurrentUser> {
  const user = await getAuth().getCurrentUser();
  if (!user || user.role !== role) {
    throw new UnauthorizedError();
  }
  return user;
}
