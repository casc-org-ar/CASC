import { redirect } from "next/navigation";

/**
 * Public sign-up is intentionally disabled. Members don't self-register: an
 * admin invites them from /admin/socios and their role is pre-assigned on the
 * invitation. Anyone landing on /sign-up is sent to sign-in.
 *
 * This is UX/coherence only — the real lock is disabling sign-ups in the Clerk
 * dashboard (Restrictions), otherwise Clerk's hosted account portal would still
 * accept registrations outside the app. See docs/FASE-2-clerk-supabase-conexion.md.
 */
export default function SignUpPage() {
  redirect("/sign-in");
}
