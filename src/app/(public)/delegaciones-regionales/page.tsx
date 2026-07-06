import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";

/**
 * Delegaciones Regionales — migrated verbatim from delegaciones-regionales.html.
 */

export const metadata: Metadata = {
  title: "Delegaciones Regionales — CASC",
  description:
    "Delegaciones regionales de la Cámara Argentina de Shopping Centers y sus delegados.",
};

const delegates = [
  { name: "Sebastián Schneider", org: "Devoto Shopping" },
  { name: "Marcelo Chane", org: "Nuevo Quilmes Plaza" },
  { name: "Fernando Monedero", org: "Grupo Libertad" },
  { name: "Diego Lago", org: "Palmares Mall" },
  { name: "Graciela Jorge", org: "Annuar Shopping" },
  { name: "Catalina López Soto", org: "Paseo del Fuego" },
];

export default function DelegacionesRegionalesPage() {
  return (
    <>
      <PageHero title="Delegaciones Regionales" />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/asociados"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos los Shopping Centers asociados
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {delegates.map((d) => (
            <div key={d.name} className="rounded-lg border border-border bg-bg p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Delegado/a
              </p>
              <p className="mt-1 font-bold text-ink">{d.name}</p>
              <p className="text-sm text-ink-muted">{d.org}</p>
              <Link
                href="/asociados"
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                Ver asociados
              </Link>
            </div>
          ))}
        </div>
      </section>

      <JoinCta />
    </>
  );
}
