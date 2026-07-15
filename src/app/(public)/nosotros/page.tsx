import type { Metadata } from "next";
import Image from "next/image";
import {
  Globe,
  Building2,
  Handshake,
  Shield,
  Rocket,
  Users,
  Link2,
  Presentation,
} from "lucide-react";
import { JoinCta } from "@/components/public/join-cta";
import { ButtonAnchor } from "@/components/ui/button";
import { IconFrame } from "@/components/ui/icon-frame";

/**
 * Nosotros — reconstructed to mirror the original nosotros.html layout:
 * intro with hero image + three-column summary, a full-bleed banner, the
 * Objetivos grid with icons, and the Propuesta de Valor block. Texts are
 * verbatim from the legacy site; images live in /assets/pages/nosotros.
 */

export const metadata: Metadata = {
  title: "Nosotros — CASC",
  description:
    "La Cámara Argentina de Shopping Centers (CASC) es una entidad sin fines de lucro que representa a los principales Centros Comerciales, Retailers y Empresas proveedoras de servicios de Argentina.",
};

/** The three summary paragraphs shown under the intro, each with an icon. */
const resumen = [
  {
    icon: Globe,
    text: "Nuestro principal objetivo es consensuar el interés global de todos los Shopping Centers asociados por encima del interés particular, empresario o regional.",
  },
  {
    icon: Building2,
    text: "En la actualidad, más del 60% de los Shoppings distribuidos en las distintas provincias del País, se encuentran nucleados en nuestra entidad, posicionándose la Cámara como la voz encargada de representar a la industria ante las autoridades y la opinión pública.",
  },
  {
    icon: Handshake,
    text: "Además, la CASC mantiene alianzas estratégicas con la Cámara Argentina de Comercio y Servicios (CACyS) y es miembro fundador de la Cámara Latinoamericana de la Industria de Centros Comerciales (CLICC), con la finalidad de promover objetivos en común.",
  },
];

const objetivos = [
  {
    icon: Shield,
    title: "Defender",
    text: "Los derechos de los socios activos en el marco de las normas vigentes y en armonía con los intereses de la comunidad.",
  },
  {
    icon: Rocket,
    title: "Impulsar",
    text: "El intercambio de información y conocimiento entre sus asociados y con terceros.",
  },
  {
    icon: Users,
    title: "Colaborar",
    text: "Con los poderes públicos en todo aquello que resulte de interés para los asociados y la comunidad.",
  },
  {
    icon: Link2,
    title: "Propiciar",
    text: "Vinculaciones con asociaciones empresarias, nacionales y extranjeras, cuyos fines sean comunes a los de esta Cámara.",
  },
  {
    icon: Presentation,
    title: "Participar",
    text: "De congresos y convenciones nacionales o extranjeras, cuando se consideren vinculadas a la actividad.",
  },
];

const PROPUESTA_PDF =
  "https://casc.nuovasuite.com/storage/casc70152122/Propuesta_valor_CASC_23_12_25.pdf";

export default function NosotrosPage() {
  return (
    <>
      {/* Intro: título + imagen, con resumen en tres columnas */}
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 xl:gap-16">
          <div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Cámara Argentina de Shopping Centers
            </h1>
            <p className="text-lg font-light text-ink-muted">
              La Cámara Argentina de Shopping Centers (CASC) es una entidad sin
              fines de lucro que representa a los principales Centros
              Comerciales, Retailers y Empresas proveedoras de servicios de
              Argentina desde hace más de 30 años, promoviendo una industria
              sólida, profesional y en permanente evolución.
            </p>
          </div>
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg">
            <Image
              src="/assets/pages/nosotros/nosotros1.jpg"
              alt="Interior de un shopping center"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="mb-16 mt-16 grid gap-8 sm:grid-cols-3">
          {resumen.map(({ icon: Icon, text }, i) => (
            <div key={i}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-casc-navy-900 text-white">
                <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </div>
              <p className="font-light text-ink-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Banner institucional full-bleed. Aspect ratio matches the source
          image (2000×200 = 10:1) so object-cover never upscales it. */}
      <section className="relative aspect-10/1 w-full overflow-hidden bg-surface">
        <Image
          src="/assets/pages/nosotros/banner-nosotros2.png"
          alt="Centros comerciales de Argentina"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </section>

      {/* Objetivos */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Objetivos
        </h2>
        <p className="mt-3 max-w-3xl text-lg font-light text-ink-muted">
          Sobre esta base institucional, la Cámara define sus objetivos y
          acciones orientadas al crecimiento, la representación y el desarrollo
          del sector.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {objetivos.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="card-depth h-full rounded-xl border border-border bg-white p-6"
            >
              <IconFrame size="lg" className="mb-5">
                <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </IconFrame>
              <h3 className="mb-2 text-xl font-bold text-ink">{title}</h3>
              <p className="font-light text-ink-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Propuesta de Valor 2026 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 xl:gap-16">
          <div>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-ink">
              Propuesta de Valor 2026
            </h2>
            <p className="mb-8 text-lg font-light text-ink-muted">
              Impulsamos el crecimiento de los Shopping Centers en todo el país.
              Descargá nuestra propuesta de valor y sumate a la red que fortalece
              al sector.
            </p>
            <ButtonAnchor
              href={PROPUESTA_PDF}
              target="_blank"
              rel="noreferrer"
              size="lg"
            >
              Descargar propuesta
              <span aria-hidden>→</span>
            </ButtonAnchor>
          </div>
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg">
            <Image
              src="/assets/pages/nosotros/nosotros3.png"
              alt="Presentación de la propuesta de valor CASC"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Frase institucional */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="flex items-center justify-center gap-3 text-center text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          <span className="text-4xl font-extralight text-accent">[</span>
          Representamos a los Shopping Centers de Argentina
          <span className="text-4xl font-extralight text-accent">]</span>
        </p>
      </section>

      <JoinCta />
    </>
  );
}
