import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Delegaciones Regionales — migrated from delegaciones-regionales.html.
 * Region images live in public/assets/pages/delegaciones/.
 */

export const metadata: Metadata = {
  title: "Delegaciones Regionales — CASC",
  description:
    "Delegaciones regionales de la Cámara Argentina de Shopping Centers y sus delegados.",
};

const delegates = [
  {
    region: "CABA",
    role: "Delegado",
    name: "Sebastián Schneider",
    org: "Devoto Shopping",
    image: "/assets/pages/delegaciones/caba.jpg",
    regionSlug: "caba",
  },
  {
    region: "GBA",
    role: "Delegado",
    name: "Marcelo Chane",
    org: "Nuevo Quilmes Plaza",
    image: "/assets/pages/delegaciones/gba.png",
    regionSlug: "gba",
  },
  {
    region: "Pampeana",
    role: "Delegado",
    name: "Fernando Monedero",
    org: "Grupo Libertad",
    image: "/assets/pages/delegaciones/pampeana.png",
    regionSlug: "pampeana",
  },
  {
    region: "Cuyo",
    role: "Delegado",
    name: "Diego Lago",
    org: "Palmares Mall",
    image: "/assets/pages/delegaciones/cuyo.png",
    regionSlug: "cuyo",
  },
  {
    region: "Norte",
    role: "Delegada",
    name: "Graciela Jorge",
    org: "Annuar Shopping",
    image: "/assets/pages/delegaciones/norte.png",
    regionSlug: "norte",
  },
  {
    region: "Patagonia",
    role: "Delegada",
    name: "Catalina López Soto",
    org: "Paseo del Fuego",
    image: "/assets/pages/delegaciones/patagonia.png",
    regionSlug: "patagonia",
  },
];

function DelegateCard({ delegate }: { delegate: (typeof delegates)[number] }) {
  return (
    <Link
      href={`/asociados?categoria=shopping-centers&region=${delegate.regionSlug}#directorio`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={`Ver asociados de la delegación ${delegate.region}`}
    >
      <Card
        className={cn(
          "h-full overflow-hidden rounded-lg bg-white p-0 shadow-none transition-all duration-200 ease-out",
          "group-hover:-translate-y-0.5 group-hover:border-accent/70",
        )}
      >
        <div className="overflow-hidden border-b border-border bg-surface">
          <Image
            src={delegate.image}
            alt={`Delegación ${delegate.region}`}
            width={600}
            height={600}
            className="aspect-square w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025]"
          />
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {delegate.role}
          </p>
          <h2 className="mt-1 text-lg font-bold leading-tight text-ink">
            {delegate.name}
          </h2>

          <p className="mt-2 text-sm leading-5 text-ink-muted">
            {delegate.org}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <p className="text-sm font-semibold text-ink">{delegate.region}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Ver asociados
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function DelegacionesRegionalesPage() {
  return (
    <>
      <PageHero title="Delegaciones Regionales" />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Representación federal
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Delegados regionales
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

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {delegates.map((delegate) => (
            <li key={delegate.region}>
              <DelegateCard delegate={delegate} />
            </li>
          ))}
        </ul>
      </section>

      <JoinCta />
    </>
  );
}
