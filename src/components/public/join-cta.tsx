import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/**
 * "Sumate a la Cámara" call-to-action band. Reused across institutional pages.
 *
 * Uses the institutional blue (not the navy of the footer) so the band does not
 * blend into the footer when it sits directly above it. A soft radial accent
 * adds depth without a heavy background image.
 */
export function JoinCta() {
  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Soft accent glow so the flat blue reads with some depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto mb-6 max-w-2xl text-3xl font-extrabold tracking-tight text-white">
          Sumate a la Cámara que representa a los Shopping Centers de Argentina
        </h2>
        <ButtonLink href="/como-asociarse" variant="secondary" size="lg">
          Asociarse
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ButtonLink>
      </div>
    </section>
  );
}
