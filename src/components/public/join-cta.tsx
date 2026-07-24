import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/**
 * "Sumate a la Cámara" call-to-action band. Reused across institutional pages.
 *
 * Uses the light accent blue with a top divider, so the band reads as its own
 * section and never blends into the navy footer below it. Text is dark (ink)
 * because white would not meet contrast on this light background.
 */
export function JoinCta() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-accent/25">
      {/* Soft glows so the flat colour still reads with some depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto mb-6 max-w-2xl text-3xl font-extrabold tracking-tight text-ink">
          Sumate a la Cámara que representa a los Shopping Centers de Argentina
        </h2>
        <ButtonLink href="/como-asociarse" size="lg">
          Asociarse
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ButtonLink>
      </div>
    </section>
  );
}
