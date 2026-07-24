import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import {
  DelegacionesMap,
  type MapDelegation,
} from "@/components/public/delegaciones-map";
import { ButtonLink } from "@/components/ui/button";

/**
 * Delegaciones Regionales — migrated from delegaciones-regionales.html.
 */

export const metadata: Metadata = {
  title: "Delegaciones Regionales — CASC",
  description:
    "Delegaciones regionales de la Cámara Argentina de Shopping Centers y sus delegados.",
};

/**
 * Regional delegations. `coverage` lists the provinces each delegation spans,
 * matching the region grouping used by the map.
 */
const delegates: MapDelegation[] = [
  {
    region: "CABA",
    role: "Delegado",
    name: "Sebastián Schneider",
    org: "Devoto Shopping",
    regionSlug: "caba",
    coverage: ["Ciudad Autónoma de Buenos Aires"],
  },
  {
    region: "GBA",
    role: "Delegado",
    name: "Marcelo Chane",
    org: "Nuevo Quilmes Plaza",
    regionSlug: "gba",
    coverage: ["Provincia de Buenos Aires"],
  },
  {
    region: "Pampeana",
    role: "Delegado",
    name: "Fernando Monedero",
    org: "Grupo Libertad",
    regionSlug: "pampeana",
    coverage: ["Córdoba", "Santa Fe", "Entre Ríos", "La Pampa", "Corrientes"],
  },
  {
    region: "Cuyo",
    role: "Delegado",
    name: "Diego Lago",
    org: "Palmares Mall",
    regionSlug: "cuyo",
    coverage: ["Mendoza", "San Juan", "San Luis", "La Rioja"],
  },
  {
    region: "Norte",
    role: "Delegada",
    name: "Graciela Jorge",
    org: "Annuar Shopping",
    regionSlug: "norte",
    coverage: [
      "Salta",
      "Jujuy",
      "Tucumán",
      "Santiago del Estero",
      "Catamarca",
      "Chaco",
      "Formosa",
      "Misiones",
    ],
  },
  {
    region: "Patagonia",
    role: "Delegada",
    name: "Catalina López Soto",
    org: "Paseo del Fuego",
    regionSlug: "patagonia",
    coverage: [
      "Neuquén",
      "Río Negro",
      "Chubut",
      "Santa Cruz",
      "Tierra del Fuego",
    ],
  },
];

export default function DelegacionesRegionalesPage() {
  return (
    <>
      <PageHero
        title="Delegaciones Regionales"
        subtitle="La Cámara organiza su representación en seis delegaciones que cubren todo el país. Cada una cuenta con un delegado que articula la relación entre los centros comerciales de su región y la Cámara."
      />

      {/* Interactive map + delegation cards — the single source for delegates. */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Representación federal
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {delegates.length} delegaciones en todo el país
            </h2>
          </div>
          <ButtonLink
            href="/asociados?categoria=shopping-centers#directorio"
            className="w-fit"
          >
            Ver todos los Shopping Centers asociados
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>

        <DelegacionesMap delegations={delegates} />
      </section>

      <JoinCta />
    </>
  );
}
