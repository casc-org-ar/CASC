"use client";

import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Error boundary for the admin panel. Same reasoning as the socio one: a thrown
 * read used to take the route down as a blank 500 (Supabase rejecting a session
 * token with "JWT not yet valid" on a clock-skew hiccup). Those failures pass,
 * so the screen offers a retry instead of a dead end.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] render failed", error);
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
        el error se repite, revisá los logs del proyecto.
      </p>

      <Button onClick={reset} className="mt-8">
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Reintentar
      </Button>
    </div>
  );
}
