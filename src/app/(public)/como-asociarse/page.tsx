import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Building2, CalendarCheck } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { AssociateForm } from "@/components/public/associate-form";
import { IconFrame } from "@/components/ui/icon-frame";

/**
 * Cómo asociarse — migrated verbatim from como-asociarse.html.
 */

export const metadata: Metadata = {
  title: "Cómo asociarse — CASC",
  description:
    "Conocé los requisitos, pasos y beneficios para asociarte a la Cámara y formar parte de la red institucional del sector.",
};

const introText =
  "Sumarse a la Cámara Argentina de Shopping Centers permite integrar una red federal que reúne a centros comerciales, retailers y empresas proveedoras de servicios, accediendo a información estratégica, espacios de intercambio y oportunidades de desarrollo para todo el ecosistema del sector.";

const values: {
  title: string;
  text: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Representación institucional",
    text: "La CASC representa a los actores del sector ante organismos públicos y privados, defendiendo los intereses de shoppings, marcas y proveedores, y promoviendo una agenda común que impulse el crecimiento sostenible y profesional de la actividad en Argentina.",
    icon: Building2,
  },
  {
    title: "Información y conocimiento",
    text: "Accedé a información sectorial, estadísticas, estudios, capacitaciones y contenidos exclusivos orientados a la toma de decisiones, la innovación y la mejora continua de la gestión en centros comerciales, retail y servicios especializados.",
    icon: BarChart3,
  },
  {
    title: "Actividades y beneficios exclusivos",
    text: "Participá de eventos, capacitaciones, comisiones de trabajo y encuentros sectoriales con beneficios especiales para asociados, fomentando el networking, el intercambio de experiencias y la generación de oportunidades entre los distintos eslabones de la cadena de valor.",
    icon: CalendarCheck,
  },
];

export default function ComoAsociarsePage() {
  return (
    <>
      <PageHero
        title="Cómo asociarse"
        subtitle="Conocé los requisitos, pasos y beneficios para asociarte a la Cámara y formar parte de la red institucional del sector."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Cómo asociarse a la CASC
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">
            Sumate a la red institucional del sector
          </h2>
          <p className="mt-4 text-lg leading-8 text-ink-muted">{introText}</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="group flex h-full flex-col rounded-2xl border border-primary-hover/40 bg-primary p-6 text-white transition-colors duration-200 hover:border-accent"
              >
                <IconFrame
                  size="lg"
                  variant="secondary"
                  className="mb-7"
                  contentClassName="text-primary"
                >
                  <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden />
                </IconFrame>
                <h3 className="text-xl font-extrabold tracking-tight">
                  {value.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/75">
                  {value.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-surface/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div className="rounded-2xl border border-border bg-white p-7 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Formulario Asociarse
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">
              Iniciá el proceso de asociación
            </h2>
            <p className="mt-4 text-sm leading-6 text-ink-muted">
              Completá el siguiente formulario para iniciar el proceso de
              asociación. Nuestro equipo se pondrá en contacto para brindarte
              más información y acompañarte en los próximos pasos.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 lg:p-8">
            <AssociateForm />
          </div>
        </div>
      </section>
    </>
  );
}
