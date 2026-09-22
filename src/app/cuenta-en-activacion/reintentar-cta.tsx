"use client";

import { ArrowRight, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * "Entrar al portal" for the activation screen, with an automatic retry.
 *
 * The screen used to say "actualizá la página" while offering only a sign-out
 * button — and refreshing this URL just re-renders this same page, because the
 * layout guard sends an unlinked member straight back here. The way out was to
 * edit the address bar by hand, which nobody should have to work out.
 *
 * So it navigates to `/socio` instead of reloading: that is the route whose
 * guard re-runs the check, and it lets the member through the moment their row
 * is linked. While the link is still missing the guard returns them here, which
 * is the correct outcome — it just should not be a dead end.
 *
 * It retries on its own because the wait is normally a few seconds (the
 * `user.created` webhook landing): a member who watches this screen for those
 * seconds should end up inside without pressing anything. The button stays for
 * whoever wants to force it, and for when the automatic attempts run out.
 */

/** Seconds between automatic attempts. */
const INTERVALO = 4;

/**
 * How many times to retry before leaving it to the member.
 *
 * The webhook lands in seconds when it lands at all; past ~30s the cause is
 * something a retry cannot fix (a misconfigured webhook, a row that was never
 * created). Retrying forever would hammer the server and, worse, suggest
 * progress that is not happening — better to stop and say what to do next.
 */
const MAX_INTENTOS = 7;

/**
 * Where the attempt count lives.
 *
 * It CANNOT be component state: every retry is a full page navigation, and a
 * failed one lands back on this page with the component freshly mounted — a
 * counter in `useState` would restart at zero each time and retry forever,
 * every few seconds, for as long as the tab stayed open.
 *
 * `sessionStorage` survives the navigation and is scoped to the tab, so the
 * count resets when the member closes it or comes back later — which is the
 * right moment to give the webhook another chance.
 */
const CLAVE_INTENTOS = "casc.activacion.intentos";

function leerIntentos(): number {
  // `typeof window` guards the server render, where there is no storage at all;
  // the catch covers a browser that has it but refuses access (private mode,
  // blocked site data). Either way the answer is zero: retrying a few extra
  // times is harmless, crashing the screen is not.
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.sessionStorage.getItem(CLAVE_INTENTOS)) || 0;
  } catch {
    return 0;
  }
}

function guardarIntentos(n: number): void {
  try {
    window.sessionStorage.setItem(CLAVE_INTENTOS, String(n));
  } catch {
    // Ignored on purpose — see `leerIntentos`. Losing the count only means a
    // few extra retries, never a broken screen.
  }
}

export function ReintentarCta() {
  const [restante, setRestante] = useState(INTERVALO);
  /**
   * Read through the lazy initializer rather than in an effect: an effect that
   * sets state on mount costs an extra render pass for a value already
   * available. The initializer runs on the server too, where `sessionStorage`
   * does not exist — `leerIntentos` catches that and returns 0, which is also
   * what the first client render needs for the markup to match on hydration.
   */
  const [intentos, setIntentos] = useState(leerIntentos);
  const [navegando, setNavegando] = useState(false);
  const intentosRef = useRef(intentos);

  /**
   * @param manual true when the member pressed the button.
   *
   * A press restarts the count, so the automatic attempts come back instead of
   * the screen staying stuck after the first round. Automatic attempts carry
   * the count forward, which is what eventually stops them.
   */
  const reintentar = (manual = false) => {
    setNavegando(true);
    guardarIntentos(manual ? 0 : intentosRef.current);
    // A full navigation, not `router.push`: the guard runs on the server, and a
    // client-side transition can be served from the router cache — which would
    // replay the very redirect that landed the member here.
    window.location.href = "/socio";
  };

  useEffect(() => {
    if (intentos >= MAX_INTENTOS) return;

    const id = setInterval(() => {
      setRestante((s) => {
        if (s > 1) return s - 1;
        intentosRef.current += 1;
        setIntentos(intentosRef.current);
        if (intentosRef.current <= MAX_INTENTOS) reintentar();
        return INTERVALO;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [intentos]);

  const agotado = intentos >= MAX_INTENTOS;

  return (
    <div className="flex flex-col items-center gap-3">
      <Button size="lg" onClick={() => reintentar(true)} disabled={navegando}>
        {navegando ? (
          <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        )}
        {navegando ? "Entrando…" : "Entrar al portal"}
      </Button>

      {/* `aria-live` so a screen reader is told the state changed, since the
          countdown and the give-up message replace each other in place. */}
      <p className="text-xs text-ink-muted" aria-live="polite">
        {agotado
          ? "Seguimos sin poder habilitar el acceso. Probá de nuevo o comunicate con la Cámara."
          : `Volvemos a intentar en ${restante} segundo${restante === 1 ? "" : "s"}…`}
      </p>
    </div>
  );
}
