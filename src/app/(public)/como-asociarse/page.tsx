import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { AssociateForm } from "@/components/public/associate-form";

/**
 * Cómo asociarse — migrated verbatim from como-asociarse.html.
 */

export const metadata: Metadata = {
  title: "Cómo asociarse — CASC",
  description:
    "Sumate a la Cámara Argentina de Shopping Centers. Completá el formulario para iniciar el proceso de asociación.",
};

const values = [
  {
    title: "Representación institucional",
    text: "La CASC representa a los actores del sector ante organismos públicos y privados, defendiendo los intereses de shoppings, marcas y proveedores, y promoviendo una agenda común que impulse el crecimiento sostenible y profesional de la actividad en Argentina.",
  },
  {
    title: "Información y conocimiento",
    text: "Accedé a información sectorial, estadísticas, estudios, capacitaciones y contenidos exclusivos orientados a la toma de decisiones, la innovación y la mejora continua de la gestión en centros comerciales, retail y servicios especializados.",
  },
  {
    title: "Actividades y beneficios exclusivos",
    text: "Participá de eventos, capacitaciones, comisiones de trabajo y encuentros sectoriales con beneficios especiales para asociados, fomentando el networking, el intercambio de experiencias y la generación de oportunidades entre los distintos eslabones de la cadena de valor.",
  },
];

export default function ComoAsociarsePage() {
  return (
    <>
      <PageHero title="Cómo asociarse" />

      {/* Propuesta de valor */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.title}>
              <h2 className="mb-2 text-xl font-bold text-ink">{v.title}</h2>
              <p className="font-light text-ink-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulario */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mb-8 text-lg font-light text-ink-muted">
            Completá el siguiente formulario para iniciar el proceso de
            asociación. Nuestro equipo se pondrá en contacto para brindarte más
            información y acompañarte en los próximos pasos.
          </p>
          <AssociateForm />
        </div>
      </section>
    </>
  );
}
