import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

/**
 * Global 404. Rendered whenever a route (or `notFound()`) has no match, on the
 * public site and the platform alike. Keeps the brand and offers a clear way
 * back home instead of a bare error.
 */
export default function NotFound() {
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

      <p className="mt-10 text-6xl font-extrabold tracking-tight text-primary sm:text-7xl">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        No encontramos esta página
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-muted">
        Puede que el enlace esté roto o que la página se haya movido. Volvé al
        inicio y seguí navegando.
      </p>

      <div className="mt-8">
        <ButtonLink href="/" size="lg">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al inicio
        </ButtonLink>
      </div>
    </main>
  );
}
