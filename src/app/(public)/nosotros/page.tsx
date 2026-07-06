import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";

/**
 * Nosotros — migrated verbatim from the original nosotros.html.
 */

export const metadata: Metadata = {
  title: "Nosotros — CASC",
  description:
    "La Cámara Argentina de Shopping Centers (CASC) es una entidad sin fines de lucro que representa a los principales Centros Comerciales, Retailers y Empresas proveedoras de servicios de Argentina.",
};

const objetivos = [
  {
    title: "Defender",
    text: "Los derechos de los socios activos en el marco de las normas vigentes y en armonía con los intereses de la comunidad.",
  },
  {
    title: "Impulsar",
    text: "El intercambio de información y conocimiento entre sus asociados y con terceros.",
  },
  {
    title: "Colaborar",
    text: "Con los poderes públicos en todo aquello que resulte de interés para los asociados y la comunidad.",
  },
  {
    title: "Propiciar",
    text: "Vinculaciones con asociaciones empresarias, nacionales y extranjeras, cuyos fines sean comunes a los de esta Cámara.",
  },
  {
    title: "Participar",
    text: "De congresos y convenciones nacionales o extranjeras, cuando se consideren vinculadas a la actividad.",
  },
];

const PROPUESTA_PDF =
  "https://casc.nuovasuite.com/storage/casc70152122/Propuesta_valor_CASC_23_12_25.pdf";

export default function NosotrosPage() {
  return (
    <>
      <PageHero title="Sobre la Cámara" />

      {/* Base institucional */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6 text-lg font-light text-ink-muted">
          <p>
            La Cámara Argentina de Shopping Centers (CASC) es una entidad sin
            fines de lucro que representa a los principales Centros Comerciales,
            Retailers y Empresas proveedoras de servicios de Argentina desde
            hace más de 30 años, promoviendo una industria sólida, profesional y
            en permanente evolución.
          </p>
          <p>
            Nuestro principal objetivo es consensuar el interés global de todos
            los Shopping Centers asociados por encima del interés particular,
            empresario o regional. En la actualidad, más del 60% de los
            Shoppings distribuidos en las distintas provincias del País, se
            encuentran nucleados en nuestra entidad, posicionándose la Cámara
            como la voz encargada de representar a la industria ante las
            autoridades y la opinión pública.
          </p>
          <p>
            Además, la CASC mantiene alianzas estratégicas con la Cámara
            Argentina de Comercio y Servicios (CACyS) y es miembro fundador de
            la Cámara Latinoamericana de la Industria de Centros Comerciales
            (CLICC), con la finalidad de promover objetivos en común.
          </p>
        </div>
      </section>

      {/* Objetivos */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">
            Objetivos
          </h2>
          <p className="mt-3 max-w-3xl text-lg font-light text-ink-muted">
            Sobre esta base institucional, la Cámara define sus objetivos y
            acciones orientadas al crecimiento, la representación y el desarrollo
            del sector.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {objetivos.map((o) => (
              <div key={o.title}>
                <h3 className="mb-2 text-xl font-bold text-ink">{o.title}</h3>
                <p className="font-light text-ink-muted">{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Propuesta de Valor 2026 */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Propuesta de Valor 2026
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg font-light text-ink-muted">
          Impulsamos el crecimiento de los Shopping Centers en todo el país.
          Descargá nuestra propuesta de valor y sumate a la red que fortalece al
          sector.
        </p>
        <a
          href={PROPUESTA_PDF}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Descargar propuesta
        </a>
      </section>

      <JoinCta />
    </>
  );
}
