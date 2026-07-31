"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { clerkEnabled } from "@/lib/auth/flag";

/**
 * "Cerrar sesión" for the inactive-account screen. Uses Clerk's real sign-out
 * when Clerk is active, falling back to the mock sign-out otherwise — same
 * pattern as the sidebar account menu. Signing out returns to the public site.
 */
export function SignOutCta() {
  const [pending, startTransition] = useTransition();

  if (clerkEnabled()) {
    return (
      <SignOutButton redirectUrl="/">
        <Button size="lg">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </Button>
      </SignOutButton>
    );
  }

  return (
    <Button
      size="lg"
      disabled={pending}
      onClick={() => startTransition(() => void signOut())}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Cerrar sesión
    </Button>
  );
}
