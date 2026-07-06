import Image from "next/image";
import { ShieldCheck, Store } from "lucide-react";
import { signInAs } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

/**
 * Mock login. Simulates the real Clerk sign-in with two role buttons.
 * When Clerk lands, this becomes the real sign-in screen and the buttons
 * are replaced by Clerk's flow — the rest of the app is untouched.
 */
export default function LoginPage() {
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
