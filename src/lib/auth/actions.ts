"use server";

import { redirect } from "next/navigation";
import { setMockRole, clearMockRole } from "@/lib/auth/mock-auth";
import { clerkEnabled } from "@/lib/auth/flag";
import type { UserRole } from "@/lib/types/domain";

/**
 * DEV-ONLY session actions.
 *
 * These drive the mock login and the dev role-switcher. They are NOT the
 * production sign-in path: real authentication goes through Clerk's own
 * components (`<SignIn>`, `useClerk().signOut()`), where credentials are
 * verified and the role is read from user metadata — never chosen by the
 * caller. Letting a caller pick their own role is fine for a local mock and
 * a privilege-escalation hole in production.
 *
 * HARD GUARD: `signInAs` lets the CALLER pick their own role, so it must never
 * run in production. It's blocked whenever the build is production OR Clerk is
 * the active provider — a defense-in-depth so a misconfigured env var can't
 * expose the mock login online. This is enforced in code, not only by config.
 */

/** True when picking a mock role must be refused (any non-dev-mock context). */
function mockLoginForbidden(): boolean {
  return process.env.NODE_ENV === "production" || clerkEnabled();
}

/** Set the mocked role, then land on that role's home. Dev-mock only. */
export async function signInAs(role: UserRole): Promise<void> {
  if (mockLoginForbidden()) {
    // Never allow caller-chosen roles outside the local dev mock.
    redirect("/login");
  }
  await setMockRole(role);
  redirect(role === "admin" ? "/admin" : "/socio");
}

/** Clear the mocked session and return to login. */
export async function signOut(): Promise<void> {
  await clearMockRole();
  redirect("/login");
}
