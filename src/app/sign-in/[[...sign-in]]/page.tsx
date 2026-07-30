import { SignIn } from "@clerk/nextjs";

/**
 * Real Clerk sign-in. Catch-all route so Clerk can drive its multi-step flow
 * (verification, factors) under a single path. Active when Clerk is the
 * provider; the mock login at /login is used otherwise.
 *
 * `fallbackRedirectUrl` is set explicitly so a successful sign-in always has a
 * destination even if the NEXT_PUBLIC_CLERK_* env vars are missing. Without a
 * destination Clerk re-renders the sign-in page ("the page just refreshes").
 *
 * We land on /login, which is session-aware and routes by role: admins go to
 * /admin, socios to /socio. This sends each user straight to THEIR panel with
 * no detour through the other role's home. An admin who wants the socio view
 * switches into it deliberately from the sidebar.
 *
 * No `signUpUrl`: public sign-up is disabled (members join by admin invitation
 * only), so the sign-in card must not offer a "create account" link.
 */
export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <SignIn fallbackRedirectUrl="/login" />
    </main>
  );
}
