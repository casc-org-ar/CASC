"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { clerkEnabled } from "@/lib/auth/flag";

/**
 * Public-header entry button. When the visitor is already signed in it reads
 * "Ir al panel" and points at the platform; otherwise "Ingresar" → /login.
 *
 * Uses Clerk's `useUser()` for the session, so it only renders its Clerk-aware
 * variant when Clerk is active; with the mock provider it falls back to a plain
 * "Ingresar" (there's no client session to read).
 */
export function IngresarButton({ size }: { size?: "sm" }) {
  // With the mock (no ClerkProvider), useUser isn't available → plain Ingresar.
  if (!clerkEnabled()) {
    return (
      <ButtonLink href="/login" size={size}>
        Ingresar
      </ButtonLink>
    );
  }
  return <ClerkAwareIngresar size={size} />;
}

function ClerkAwareIngresar({ size }: { size?: "sm" }) {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    // Land on /socio; the socio layout forwards admins to their panel. /login
    // is also session-aware and routes by role, so either target works.
    return (
      <ButtonLink href="/socio" size={size}>
        Ir al panel
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </ButtonLink>
    );
  }

  return (
    <ButtonLink href="/login" size={size}>
      Ingresar
    </ButtonLink>
  );
}
