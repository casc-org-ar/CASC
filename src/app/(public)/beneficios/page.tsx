import Image from "next/image";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgePercent,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Mail,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconFrame } from "@/components/ui/icon-frame";

/**
 * Beneficios — migrated from beneficios.html.
 */

export const metadata: Metadata = {
  title: "Beneficios — CASC",
  description:
    "Ser parte de la Cámara Argentina de Shopping Centers permite acceder a beneficios exclusivos pensados para fortalecer la gestión, la información y el intercambio entre los actores de la industria.",
};

interface BenefitItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

const benefits: BenefitItem[] = [
  {
    title: "Networking",
    description: "Networking e intercambio de prácticas y experiencias.",
    icon: Users,
  },
  {
    title: "Comisiones de Trabajo",
    description:
      "Conformación de Comisiones de Trabajo entre los asociados de la Cámara.",
    icon: ClipboardList,
  },
  {
    title: "Información estadística",
    description: "Acceso a información estadística para Shopping Centers.",
    icon: BarChart3,
  },
  {
    title: "Actividades",
    description:
      "Actividades organizadas por la Cámara con tarifas de inscripción especiales para asociados.",
    icon: CalendarDays,
  },
  {
    title: "Newsletter mensual",
    description:
      "Acceso a newsletter mensual que la Cámara distribuye exclusivamente para sus asociados.",
    icon: Mail,
  },
  {
    title: "Descuentos especiales",
    description:
      "Descuentos en cadenas hoteleras para los asociados de la Cámara.",
    icon: BadgePercent,
  },
];

function BenefitCard({ benefit }: { benefit: BenefitItem }) {
  const Icon = benefit.icon;

  return (
    <Card className="card-depth group relative h-full overflow-hidden rounded-lg p-6 transition-colors duration-200 hover:border-accent/60">
      <div className="mb-6">
        <IconFrame
          size="lg"
          contentClassName="group-hover:from-white group-hover:to-casc-gray-100"
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
        </IconFrame>
      </div>

      <h2 className="text-lg font-bold tracking-tight text-ink">
        {benefit.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-ink-muted">
        {benefit.description}
      </p>
    </Card>
  );
}

export default function BeneficiosPage() {
  return (
    <>
      <PageHero
        title="Beneficios"
        subtitle="Ser parte de la Cámara Argentina de Shopping Centers permite acceder a beneficios exclusivos pensados para fortalecer la gestión, la información y el intercambio entre los actores de la industria."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">
            Beneficios para asociados
          </h2>
        </div>

        <div className="stagger-children grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.description} benefit={benefit} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Card className="overflow-hidden rounded-lg p-0 shadow-none transition-colors duration-200 hover:border-accent/60 hover:shadow-none">
            <div className="grid lg:grid-cols-2">
              <div className="relative h-56 border-b border-border bg-white sm:h-72 lg:h-auto lg:border-b-0 lg:border-r">
                <Image
                  src="/assets/pages/beneficios/casc-plataforma.jpg"
                  alt="Vista de la plataforma exclusiva para socios de la CASC"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col p-6 lg:p-8">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary shadow-sm">
                  <Users
                    className="h-3.5 w-3.5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  Accesos exclusivos
                </span>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-ink">
                  PANEL EXCLUSIVO PARA SOCIOS
                </h2>
                <p className="mt-4 text-sm leading-6 text-ink-muted">
                  El Panel Exclusivo para Socios de la CASC es un espacio
                  digital pensado para centralizar contenidos, materiales y
                  herramientas de valor para los asociados. Allí se podrá
                  acceder a información institucional, capacitaciones, eventos,
                  documentación relevante y recursos exclusivos orientados a
                  acompañar la gestión y el desarrollo de los Centros
                  Comerciales.
                </p>
                <p className="mt-3 text-sm leading-6 text-ink-muted">
                  Este entorno busca fortalecer el intercambio, facilitar el
                  acceso a contenidos actualizados y brindar un punto de
                  encuentro digital que potencie la experiencia de los socios
                  dentro de la Cámara.
                </p>

                {/* Leads to the membership request, not the platform login. */}
                <div className="mt-auto pt-6">
                  <ButtonLink href="/como-asociarse" size="lg">
                    Solicitar unirse
                    <ArrowRight
                      className="h-4 w-4"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <JoinCta />
    </>
  );
}
