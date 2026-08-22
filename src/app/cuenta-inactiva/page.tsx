import type { Metadata } from "next";
import Image from "next/image";
import { ShieldAlert } from "lucide-react";
import { SignOutCta } from "./sign-out-cta";

export const metadata: Metadata = {
  title: "Cuenta inactiva — CASC",
  robots: { index: false, follow: false },
};

/**
 * Shown when a member whose `estado` is "inactivo" reaches the platform — a
 * deliberate baja by an admin. The socio layout redirects here instead of
 * letting them in. The account still exists in Clerk (the block is reversible:
 * an admin can reactivate them), so we explain the situation and offer a clean
 * sign-out rather than a raw error.
 *
 * A member who is merely not linked to their socios row yet goes to
 * /cuenta-en-activacion instead — that is a transient state, not a baja, and
 * this page's wording would be wrong for it.
 */
export default function CuentaInactivaPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
      <Image
        src="/assets/brand/casc-logo.webp"
        alt="Cámara Argentina de Shopping Centers"
        width={132}
        height={44}
        priority
        className="h-10 w-auto"
      />

      <div className="mt-10 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <ShieldAlert className="h-7 w-7" aria-hidden="true" />
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Tu cuenta está inactiva
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-muted">
        Tu acceso a la plataforma fue desactivado. Si creés que se trata de un
        error, comunicate con la Cámara Argentina de Shopping Centers para
        reactivar tu cuenta.
      </p>

      <div className="mt-8">
        <SignOutCta />
      </div>
    </main>
  );
}
