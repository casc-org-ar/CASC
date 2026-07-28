import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/auth/clerk-appearance";

/**
 * Sign-up is invitation-only. There are two cases:
 *
 *  - With an invitation `__clerk_ticket` in the URL → render <SignUp>, which
 *    consumes the ticket and completes the invited registration (role arrives
 *    pre-assigned from the invitation's publicMetadata). This is how an invited
 *    socio lands INSIDE the app with CASC branding instead of Clerk's hosted
 *    Account Portal.
 *  - Without a ticket (someone trying to self-register) → bounce to /sign-in.
 *    Public sign-up doesn't exist; members join by admin invitation only.
 *
 * The real lock is still the Clerk dashboard (Restrictions: invitations only);
 * this page just gives invited users a branded, in-app acceptance screen.
 */
export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ __clerk_ticket?: string }>;
}) {
  const { __clerk_ticket } = await searchParams;

  if (!__clerk_ticket) {
    redirect("/sign-in");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <SignUp appearance={clerkAppearance} fallbackRedirectUrl="/socio" />
    </main>
  );
}
