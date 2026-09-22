"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { SignOutButton } from "@clerk/nextjs";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { clerkEnabled } from "@/lib/auth/flag";

/**
 * "Cerrar sesión" for the account-blocked screens. Uses Clerk's real sign-out
 * when Clerk is active, falling back to the mock sign-out otherwise — same
 * pattern as the sidebar account menu. Signing out returns to the public site.
 *
 * `variant`/`size` are exposed because the two screens weigh this action
 * differently: on /cuenta-inactiva it is the only thing to do, while on
 * /cuenta-en-activacion it sits under "Entrar al portal" and should not
 * compete with it. Defaults match the inactive screen, which came first.
 */
export function SignOutCta({
  variant = "primary",
  size = "lg",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  const [pending, startTransition] = useTransition();

  if (clerkEnabled()) {
    return (
      <SignOutButton redirectUrl="/">
        <Button variant={variant} size={size}>
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </Button>
      </SignOutButton>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      disabled={pending}
      onClick={() => startTransition(() => void signOut())}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Cerrar sesión
    </Button>
  );
}
