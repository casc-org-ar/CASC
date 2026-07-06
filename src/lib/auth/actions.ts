"use server";

import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import type { UserRole } from "@/lib/types/domain";

/** Sign in with the mocked role, then land on that role's home. */
export async function signInAs(role: UserRole): Promise<void> {
  await getAuth().signIn(role);
  redirect(role === "admin" ? "/admin" : "/socio");
}

/** Clear the mocked session and return to login. */
export async function signOut(): Promise<void> {
  await getAuth().signOut();
  redirect("/login");
}
