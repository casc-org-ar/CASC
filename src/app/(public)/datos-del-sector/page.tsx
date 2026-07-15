import type { Metadata } from "next";
import {
  Building2,
  ChartNoAxesColumnIncreasing,
  UsersRound,
} from "lucide-react";
import { CountUpNumber } from "@/components/public/count-up-number";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import { Card } from "@/components/ui/card";
import { IconFrame } from "@/components/ui/icon-frame";
import { cn } from "@/lib/utils";

/**
 * Datos del sector — migrated verbatim from datos-del-sector.html.
 * Figures are grouped visually, but all values come from the legacy page.
 */

export const metadata: Metadata = {
  title: "Datos del sector — CASC",
  description:
    "Con más de 140 Centros Comerciales vigentes en la actualidad, que generan más de 64 mil puestos de trabajo directos e indirectos, la industria continúa expandiéndose.",
};

type IconComponent = typeof Building2;

interface SectorMetric {
  value: number;
  prefix: "+";
  unit?: string;
  label: string;
  featured?: boolean;
}

interface MetricGroup {
  title: string;
  icon: IconComponent;
  metrics: SectorMetric[];
}

const metricGroups: MetricGroup[] = [
  {
    title: "Infraestructura",
    icon: Building2,
    metrics: [
      {
        value: 142,
        prefix: "+",
        label: "Centros Comerciales y Paseos Comerciales",
        featured: true,
      },
      {
        value: 5_000_000,
        prefix: "+",
        unit: "m²",
        label: "Área Bruta Locativa",
      },
      {
        value: 6_500,
        prefix: "+",
        label: "Locales comerciales",
      },
    ],
  },
  {
    title: "Actividad",
    icon: ChartNoAxesColumnIncreasing,
    metrics: [
      {
        value: 30_000_000,
        prefix: "+",
        label: "Visitas mensuales",
        featured: true,
      },
      {
        value: 820,
        prefix: "+",
        label: "Locales Gastronómicos",
      },
      {
        value: 36,
        prefix: "+",
        label: "Proyectos",
      },
    ],
  },
  {
    title: "Empleo",
    icon: UsersRound,
    metrics: [
      {
        value: 4_000,
        prefix: "+",
        label: "Empleados propios",
      },
      {
        value: 55_000,
        prefix: "+",
        label: "Empleados de locatarios",
        featured: true,
      },
      {
        value: 5_500,
        prefix: "+",
        label: "Personas brindando servicios",
      },
    ],
  },
];

const numberFormatter = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 0,
});

function MetricValue({ metric }: { metric: SectorMetric }) {
  const formattedValue = `${metric.prefix}${numberFormatter.format(metric.value)}${
    metric.unit ? ` ${metric.unit}` : ""
  }`;

  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-1.5 tracking-tight text-ink",
        metric.featured ? "text-5xl font-black" : "text-4xl font-extrabold",
      )}
      aria-label={formattedValue}
    >
      <span
        className={cn(
          "text-primary",
          metric.featured ? "text-3xl" : "text-2xl",
        )}
        aria-hidden="true"
      >
        {metric.prefix}
      </span>
      <span aria-hidden="true">
        <CountUpNumber value={metric.value} />
      </span>
      {metric.unit && (
        <span
          className={cn(
            "font-bold text-primary",
            metric.featured ? "text-xl" : "text-lg",
          )}
          aria-hidden="true"
        >
          {metric.unit}
        </span>
      )}
    </p>
  );
}

function MetricCard({ metric }: { metric: SectorMetric }) {
  return (
    <Card
      className={cn(
        "card-depth h-full rounded-lg bg-white p-5 text-left transition-all duration-200 ease-out hover:border-accent/60 sm:p-6",
        metric.featured && "border-primary/25 bg-surface/60",
      )}
    >
      <MetricValue metric={metric} />
      <h3 className="mt-3 text-sm font-semibold leading-5 text-ink-muted">
        {metric.label}
      </h3>
    </Card>
  );
}

function MetricGroupSection({ group }: { group: MetricGroup }) {
  const Icon = group.icon;

  return (
    <section className="animate-fade-in-up rounded-xl border border-border bg-surface/60 p-5 shadow-none sm:p-7 lg:p-8">
      <div className="mb-7 flex items-center gap-3 border-b border-border pb-5">
        <IconFrame size="xl">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </IconFrame>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Datos del sector
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {group.title}
          </h2>
        </div>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
        {group.metrics.map((metric) => (
          <li key={`${group.title}-${metric.label}`}>
            <MetricCard metric={metric} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DatosDelSectorPage() {
  return (
    <>
      <PageHero
        title="Datos del sector"
        subtitle="Con más de 140 Centros Comerciales vigentes en la actualidad, que generan aproximadamente más de 64 mil puestos de trabajo de manera directa e indirecta, la industria continúa expandiéndose para todos los argentinos."
      />

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        {metricGroups.map((group) => (
          <MetricGroupSection key={group.title} group={group} />
        ))}
      </section>

      <JoinCta />
    </>
  );
}

