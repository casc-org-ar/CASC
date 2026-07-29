import type { Metadata } from "next";
import { ArrowUpRight, Briefcase, Search, Users } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import { ButtonAnchor } from "@/components/ui/button";
import { LINKEDIN_CASC_URL } from "@/lib/data/bolsa-trabajo";

/**
 * Bolsa de Trabajo — public landing.
 *
 * Candidates submit their CV here; the data feeds a filterable database the
 * shopping-center recruiters browse from the members platform. External company
 * postings (IRSA, Cencosud, etc.) are intentionally NOT hosted: a button
 * redirects to the CASC LinkedIn instead (per the 2026-07-21 meeting).
 */

export const metadata: Metadata = {
  title: "Bolsa de trabajo — CASC",
  description:
    "Sumá tu CV a la Bolsa de Trabajo de la Cámara Argentina de Shopping Centers y conectá con los centros comerciales del país.",
};

const pasos = [
  {
    icon: Briefcase,
    title: "Cargás tu CV",
    description:
      "Completás el formulario con tus datos, tu experiencia y tus habilidades.",
  },
  {
    icon: Search,
    title: "La Cámara lo revisa",
    description:
      "El equipo de la CASC valida tu perfil antes de sumarlo a la base de candidatos.",
  },
  {
    icon: Users,
    title: "Formás parte de nuestra base de talentos",
    description:
      "Tu perfil queda disponible para los reclutadores de las empresas que forman parte de la Cámara, quienes podrán contactarte cuando surjan oportunidades acordes a tu experiencia.",
  },
];

export default function BolsaDeTrabajoPage() {
  return (
    <>
      <PageHero
        title="Bolsa de trabajo"
        subtitle="Sumá tu CV y conectá con los centros comerciales, retailers y empresas asociadas a la Cámara Argentina de Shopping Centers."
      />

      {/* Cómo funciona + acceso a búsquedas externas (LinkedIn). */}
      <section className="border-b border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {pasos.map((paso, index) => {
              const Icon = paso.icon;
              return (
                <div
                  key={paso.title}
                  className="rounded-xl border border-border bg-white p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      Paso {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-ink">
                    {paso.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">
                    {paso.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 rounded-xl bg-primary p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-white/90">
              Encontrá oportunidades en la industria. Compartimos en el LinkedIn
              las búsquedas laborales de las empresas asociadas.
            </p>
            <ButtonAnchor
              href={LINKEDIN_CASC_URL}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
              size="lg"
              className="shrink-0"
            >
              Ver búsquedas en LinkedIn
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </ButtonAnchor>
          </div>
        </div>
      </section>

      {/* Carga de CV — deshabilitada por ahora ("próximamente"). La sección se
          mantiene visible para anticipar la funcionalidad, pero el formulario NO
          se muestra hasta encuadrar el tratamiento de datos personales (ley
          25.326). Reactivar reponiendo <CvForm /> cuando esté habilitado. */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-dashed border-primary/40 bg-surface/60 px-6 py-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <Briefcase className="h-4 w-4" aria-hidden="true" />
            Próximamente
          </span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Carga de CV
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
            Estamos terminando de preparar la Bolsa de Trabajo para que puedas
            sumar tu CV de forma segura. Muy pronto vas a poder cargar tu perfil
            y conectar con las empresas asociadas a la Cámara.
          </p>
        </div>
      </section>

      <JoinCta />
    </>
  );
}
