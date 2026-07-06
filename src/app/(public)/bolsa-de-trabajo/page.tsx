import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";

/**
 * Bolsa de trabajo — migrated verbatim from bolsa-de-trabajo.html.
 */

export const metadata: Metadata = {
  title: "Bolsa de trabajo — CASC",
  description:
    "Próximamente vas a poder acceder a la Bolsa de Trabajo de la Cámara Argentina de Shopping Centers.",
};

const RRHH_EMAIL = "casc.rrhh@gmail.com";

export default function BolsaDeTrabajoPage() {
  return (
    <>
      <PageHero title="Bolsa de trabajo" />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6 text-lg font-light text-ink-muted">
          <p>
            Próximamente vas a poder acceder a la Bolsa de Trabajo, donde se
            publicarán las búsquedas laborales y puestos disponibles en los
            distintos centros comerciales, retailers y empresas asociadas.
          </p>
          <p>
            Puedes enviarnos tu CV a:{" "}
            <a
              href={`mailto:${RRHH_EMAIL}`}
              className="font-medium text-primary hover:underline"
            >
              {RRHH_EMAIL}
            </a>
          </p>
        </div>
      </section>

      <JoinCta />
    </>
  );
}
