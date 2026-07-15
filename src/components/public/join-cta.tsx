import { ButtonLink } from "@/components/ui/button";

/**
 * "Sumate a la Cámara" call-to-action band. Reused across institutional pages,
 * verbatim from the original site.
 */
export function JoinCta() {
  return (
    <section className="bg-casc-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto mb-6 max-w-2xl text-3xl font-extrabold tracking-tight text-white">
          Sumate a la Cámara que representa a los Shopping Centers de Argentina
        </h2>
        <ButtonLink href="/como-asociarse" variant="secondary" size="lg">
          Asociarse
        </ButtonLink>
      </div>
    </section>
  );
}
