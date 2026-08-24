"use client";

import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Error boundary for the socio panel.
 *
 * Without one, any thrown read takes the whole route down as a blank 500 — which
 * is what members saw when Supabase rejected a session token with "JWT not yet
 * valid" (a clock-skew hiccup between Clerk and Supabase, retried once in the
 * repository now). Those failures are transient, so the screen offers to retry
 * rather than sending the member to support over something that fixes itself.
 */
export default function SocioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in the Vercel function logs alongside the original stack, so a
    // recurring failure is still visible instead of being swallowed by the UI.
    console.error("[socio] render failed", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <RefreshCw className="h-7 w-7" aria-hidden="true" />
      </div>

      <h1 className="mt-6 text-xl font-bold tracking-tight text-ink">
        No pudimos cargar esta sección
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-muted">
        Fue un problema momentáneo al traer la información. Volvé a intentar: si
        el error se repite, comunicate con la Cámara Argentina de Shopping
        Centers.
      </p>

      <Button onClick={reset} className="mt-8">
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Reintentar
      </Button>
    </div>
  );
}
