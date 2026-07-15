import Image from "next/image";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgePercent,
  BarChart3,
  BedDouble,
  CalendarDays,
  Clock3,
  ClipboardList,
  Mail,
  Phone,
  Sparkles,
  Utensils,
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
    title: "Comisiones de trabajo",
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
];

const pullmanDiscounts = [
  {
    value: "15%",
    title: "Alojamiento",
    description:
      "de descuento en Alojamiento de lunes a domingo sobre la tarifa disponible del día y no acumulable con otras promociones.",
    icon: BedDouble,
  },
  {
    value: "10%",
    title: "Restaurante ALL DAY",
    description:
      "de descuento en el restaurante ALL DAY, tanto en almuerzo como cena, de domingos a jueves.",
    icon: Utensils,
  },
  {
    value: "10%",
    title: "DAY SPA",
    description: "de descuento sobre las tarifas de DAY SPA vigentes.",
    icon: Sparkles,
  },
] satisfies Array<{
  value: string;
  title: string;
  description: string;
  icon: LucideIcon;
}>;

const reservationDetails = [
  {
    label: "E-mail",
    value: "reservas@citycenter-rosario.com.ar",
    href: "mailto:reservas@citycenter-rosario.com.ar",
    icon: Mail,
  },
  {
    label: "Teléfono",
    value: "0800-222-2489",
    href: "tel:08002222489",
    icon: Phone,
  },
  {
    label: "Horarios",
    value: "Lunes a domingo – 24 hs.",
    icon: Clock3,
  },
] satisfies Array<{
  label: string;
  value: string;
  href?: string;
  icon: LucideIcon;
}>;

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

function ReservationDetail({
  detail,
}: {
  detail: (typeof reservationDetails)[number];
}) {
  const Icon = detail.icon;
  const content = (
    <>
      <IconFrame size="sm">
        <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
      </IconFrame>
      <span>
        <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
          {detail.label}
        </span>
        <span className="block text-sm font-medium text-ink">
          {detail.value}
        </span>
      </span>
    </>
  );

  if (detail.href) {
    return (
      <a
        href={detail.href}
        className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-accent/60"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
      {content}
    </div>
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
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink">
              Descuentos y promociones
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden rounded-lg p-0 shadow-none transition-colors duration-200 hover:border-accent/60 hover:shadow-none">
              <div className="relative h-48 border-b border-border bg-white sm:h-56">
                <Image
                  src="/assets/pages/beneficios/descuentos.png"
                  alt="CityCenter Rosario y Pullman Hotels and Resorts"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-8"
                />
              </div>

              <div className="p-6 lg:p-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary shadow-sm">
                  <BadgePercent
                    className="h-3.5 w-3.5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  Descuentos y promociones
                </span>

                <h3 className="mt-5 text-xl font-bold tracking-tight text-ink">
                  CITYCENTER ROSARIO – HOTEL PULLMAN
                </h3>
                <p className="mt-4 text-sm leading-6 text-ink-muted">
                  Los socios de la Cámara, pueden acceder a descuentos especiales
                  en el complejo CityCenter Rosario, socio de la CASC.
                </p>
                <p className="mt-3 text-sm leading-6 text-ink-muted">
                  Se trata de los siguientes beneficios para disfrutar en el
                  Hotel Pullman, parte integrante de CityCenter Rosario:
                </p>

                <div className="mt-6 space-y-3">
                  {pullmanDiscounts.map((discount) => {
                    const Icon = discount.icon;

                    return (
                      <div
                        key={discount.title}
                        className="rounded-lg border border-border bg-surface p-4"
                      >
                        <div className="flex items-start gap-4">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-base font-extrabold text-primary">
                            {discount.value}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <Icon
                                className="h-4 w-4 text-primary"
                                strokeWidth={1.8}
                                aria-hidden="true"
                              />
                              <h4 className="text-sm font-bold text-ink">
                                {discount.title}
                              </h4>
                            </div>
                            <p className="mt-1 text-sm leading-6 text-ink-muted">
                              {discount.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-lg border border-border bg-white p-4">
                  <p className="text-sm leading-6 text-ink-muted">
                    Las reservas se podrán solicitar vía telefónica o por
                    e-mail.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">
                    Se deberá mencionar el beneficio al momento de realizarlas.
                  </p>

                  <div className="mt-4 grid gap-3">
                    {reservationDetails.map((detail) => (
                      <ReservationDetail key={detail.label} detail={detail} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden rounded-lg p-0 shadow-none transition-colors duration-200 hover:border-accent/60 hover:shadow-none">
              <div className="relative h-48 border-b border-border bg-white sm:h-56">
                <Image
                  src="/assets/pages/beneficios/panel-casc.png"
                  alt="Panel exclusivo para socios"
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

                <h3 className="mt-5 text-xl font-bold tracking-tight text-ink">
                  PANEL EXCLUSIVO PARA SOCIOS
                </h3>
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
            </Card>
          </div>
        </div>
      </section>

      <JoinCta />
    </>
  );
}
