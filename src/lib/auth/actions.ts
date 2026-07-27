"use server";

import { redirect } from "next/navigation";
import { setMockRole, clearMockRole } from "@/lib/auth/mock-auth";
import type { UserRole } from "@/lib/types/domain";

/**
 * DEV-ONLY session actions.
 *
 * These drive the mock login and the dev role-switcher. They are NOT the
 * production sign-in path: real authentication goes through Clerk's own
 * components (`<SignIn>`, `useClerk().signOut()`), where credentials are
 * verified and the role is read from user metadata — never chosen by the
 * caller. Letting a caller pick their own role is fine for a local mock and
 * a privilege-escalation hole in production, which is why this lives here and
 * not behind the `AuthProvider` port.
 */

/** Set the mocked role, then land on that role's home. Dev only. */
export async function signInAs(role: UserRole): Promise<void> {
  await setMockRole(role);
  redirect(role === "admin" ? "/admin" : "/socio");
}

/** Clear the mocked session and return to login. Dev only. */
export async function signOut(): Promise<void> {
  await clearMockRole();
  redirect("/login");
}
