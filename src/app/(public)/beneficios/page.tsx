import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";

/**
 * Beneficios — migrated verbatim from beneficios.html.
 */

export const metadata: Metadata = {
  title: "Beneficios — CASC",
  description:
    "Ser parte de la Cámara Argentina de Shopping Centers permite acceder a beneficios exclusivos pensados para fortalecer la gestión, la información y el intercambio entre los actores de la industria.",
};

const benefits = [
  "Networking e intercambio de prácticas y experiencias.",
  "Conformación de Comisiones de Trabajo entre los asociados de la Cámara.",
  "Acceso a información estadística para Shopping Centers.",
  "Actividades organizadas por la Cámara con tarifas de inscripción especiales para asociados.",
  "Acceso a newsletter mensual que la Cámara distribuye exclusivamente para sus asociados.",
];

const pullmanDiscounts = [
  "15% de descuento en Alojamiento de lunes a domingo sobre la tarifa disponible del día y no acumulable con otras promociones.",
  "10% de descuento en el restaurante ALL DAY, tanto en almuerzo como cena, de domingos a jueves.",
  "10% de descuento sobre las tarifas de DAY SPA vigentes.",
];

export default function BeneficiosPage() {
  return (
    <>
      <PageHero
        title="Beneficios"
        subtitle="Ser parte de la Cámara Argentina de Shopping Centers permite acceder a beneficios exclusivos pensados para fortalecer la gestión, la información y el intercambio entre los actores de la industria."
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex gap-3 text-ink-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="font-light">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Descuentos y promociones */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">
            Descuentos y promociones
          </h2>
          <h3 className="mt-6 text-xl font-bold text-ink">
            CityCenter Rosario – Hotel Pullman
          </h3>
          <p className="mt-3 font-light text-ink-muted">
            Los socios de la Cámara pueden acceder a descuentos especiales en el
            complejo CityCenter Rosario, socio de la CASC. Se trata de los
            siguientes beneficios para disfrutar en el Hotel Pullman, parte
            integrante de CityCenter Rosario:
          </p>
          <ul className="mt-4 space-y-3">
            {pullmanDiscounts.map((d) => (
              <li key={d} className="flex gap-3 text-ink-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="font-light">{d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-light text-ink-muted">
            Las reservas se podrán solicitar vía telefónica o por e-mail.
          </p>
        </div>
      </section>

      {/* Panel exclusivo para socios */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Panel exclusivo para socios
        </h2>
        <p className="mt-3 font-light text-ink-muted">
          El Panel Exclusivo para Socios de la CASC es un espacio digital pensado
          para centralizar contenidos, materiales y herramientas de valor para
          los asociados. Allí se podrá acceder a información institucional,
          capacitaciones, eventos, documentación relevante y recursos exclusivos
          orientados a acompañar la gestión de los centros comerciales.
        </p>
      </section>

      <JoinCta />
    </>
  );
}
