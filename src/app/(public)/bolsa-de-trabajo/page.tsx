import type { Metadata } from "next";
import { ArrowUpRight, Briefcase, Search, Users } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import { CvForm } from "@/components/public/cv-form";
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
    title: "Te encuentran los reclutadores",
    description:
      "Los centros comerciales asociados buscan perfiles por habilidades y te contactan.",
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
              ¿Buscás las ofertas laborales de las empresas asociadas? Las
              publicamos en el LinkedIn de la Cámara.
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

      {/* Formulario de carga de CV. */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Cargá tu CV
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Los campos con <span className="text-accent">*</span> son
            obligatorios.
          </p>
        </div>

        <CvForm />
      </section>

      <JoinCta />
    </>
  );
}
