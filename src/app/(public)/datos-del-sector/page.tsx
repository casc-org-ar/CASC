import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";

/**
 * Datos del sector — migrated verbatim from datos-del-sector.html.
 * Big figures use the Inter Extra Light weight reserved for large data.
 */

export const metadata: Metadata = {
  title: "Datos del sector — CASC",
  description:
    "Con más de 140 Centros Comerciales vigentes en la actualidad, que generan más de 64 mil puestos de trabajo directos e indirectos, la industria continúa expandiéndose.",
};

const stats = [
  { value: "+142", label: "Centros Comerciales y Paseos Comerciales" },
  { value: "+36", label: "Proyectos" },
  { value: "+5.000.000", label: "m² de Área Bruta Locativa" },
  { value: "+6.500", label: "Locales comerciales" },
  { value: "+820", label: "Locales Gastronómicos" },
  { value: "+30.000.000", label: "Visitas mensuales" },
  { value: "+4.000", label: "Empleados propios" },
  { value: "+55.000", label: "Empleados de locatarios" },
  { value: "+5.500", label: "Personas brindando servicios" },
];

export default function DatosDelSectorPage() {
  return (
    <>
      <PageHero
        title="Datos del sector"
        subtitle="Con más de 140 Centros Comerciales vigentes en la actualidad, que generan aproximadamente más de 64 mil puestos de trabajo de manera directa e indirecta, la industria continúa expandiéndose para todos los argentinos."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-border pt-6">
              <p className="text-5xl font-light tracking-tight text-primary">
                {s.value}
              </p>
              <p className="mt-2 text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <JoinCta />
    </>
  );
}
