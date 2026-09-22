import type { Metadata } from "next";
import Image from "next/image";
import { Clock } from "lucide-react";
import { SignOutCta } from "@/app/cuenta-inactiva/sign-out-cta";
import { ReintentarCta } from "./reintentar-cta";

export const metadata: Metadata = {
  title: "Activando tu cuenta — CASC",
  robots: { index: false, follow: false },
};

/**
 * Shown when a member is signed in but their socios record is not linked to
 * their Clerk user yet, so RLS cannot return it (see `getMemberAccess`).
 *
 * This is NOT a deactivation: it is the short window between accepting the
 * invitation and the `user.created` webhook landing. Reusing the inactive
 * screen here told active members their access "was disabled" and sent them to
 * support over a state that usually resolves in seconds — so this page says
 * what is actually happening and gets them in as soon as it does.
 *
 * It used to say "actualizá la página" and offer only a sign-out button, which
 * was a dead end: reloading this URL re-renders this page, because the socio
 * layout sends an unlinked member right back here. `ReintentarCta` navigates to
 * /socio instead — the route whose guard re-runs the check — and does it on a
 * timer, so the usual few-second wait resolves without anyone doing anything.
 */
export default function CuentaEnActivacionPage() {
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

      <div className="mt-10 flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-600">
        <Clock className="h-7 w-7" aria-hidden="true" />
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Estamos activando tu cuenta
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-muted">
        Tu registro se completó correctamente y estamos terminando de vincularlo
        con tu perfil de socio. Esto suele demorar unos segundos y reintentamos
        solos. Si el acceso no se habilita, comunicate con la Cámara Argentina
        de Shopping Centers.
      </p>

      <div className="mt-8">
        <ReintentarCta />
      </div>

      {/* Signing out is the secondary way out, so it reads as a link rather
          than a second button competing with "Entrar al portal". */}
      <div className="mt-6">
        <SignOutCta variant="ghost" size="sm" />
      </div>
    </main>
  );
}
