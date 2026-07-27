import Image from "next/image";
import { redirect } from "next/navigation";
import { ShieldCheck, Store } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { signInAs } from "@/lib/auth/actions";
import { getAuth } from "@/lib/auth";
import { clerkEnabled } from "@/lib/auth/flag";
import { Button } from "@/components/ui/button";

/**
 * Login entry point. With Clerk active, this hands off to Clerk's real
 * sign-in at /sign-in. In mock mode it shows the two-role prototype login.
 * Keeping /login as the single entry means internal links never change.
 *
 * Session-aware to avoid a redirect loop: an already-authenticated user must
 * NOT be bounced to /sign-in (Clerk would bounce them back here → loop).
 */
export default async function LoginPage() {
  if (clerkEnabled()) {
    const { userId } = await auth();

    // Not signed in → show Clerk's sign-in.
    if (!userId) redirect("/sign-in");

    // Signed in: route by app role. A signed-in user with no role is a real
    // configuration error (missing publicMetadata.role), not a place to loop.
    const role = await getAuth().getRole();
    if (role === "admin") redirect("/admin");
    if (role === "socio") redirect("/socio");

    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-ink">
            Tu cuenta está autenticada pero todavía no tiene un rol asignado.
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Un administrador debe asignarte acceso antes de que puedas ingresar.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/brand/casc-logo-black.png"
            alt="CASC — Cámara Argentina de Shopping Centers"
            width={72}
            height={72}
            priority
            className="h-16 w-auto"
          />
          <p className="mt-3 text-sm text-ink-muted">
            Plataforma institucional — acceso privado
          </p>
        </div>

        <p className="mb-4 text-center text-xs uppercase tracking-wide text-ink-muted">
          Ingresá según tu rol
        </p>

        <div className="space-y-3">
          <form action={signInAs.bind(null, "admin")}>
            <Button type="submit" className="w-full" size="md">
              <ShieldCheck className="h-4 w-4" />
              Entrar como Admin (Comisión)
            </Button>
          </form>
          <form action={signInAs.bind(null, "socio")}>
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              size="md"
            >
              <Store className="h-4 w-4" />
              Entrar como Socio
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">
          Login simulado para el prototipo. La autenticación real se resuelve
          con Clerk.
        </p>
      </div>
    </main>
  );
}
