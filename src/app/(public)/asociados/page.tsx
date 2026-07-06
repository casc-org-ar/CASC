import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import {
  asociados,
  asociadoCategories,
  type Asociado,
} from "@/lib/data/asociados";

/**
 * Asociados directory — migrated from asociados.html. Lists every associate
 * grouped by category, linking to its individual ficha.
 */

export const metadata: Metadata = {
  title: "Asociados — CASC",
  description:
    "Directorio de asociados de la Cámara Argentina de Shopping Centers: Shopping Centers, Retailers y Proveedores de servicios.",
};

function AsociadoCard({ asociado }: { asociado: Asociado }) {
  return (
    <Link
      href={`/asociados/${asociado.slug}`}
      className="flex flex-col items-center gap-3 rounded-lg border border-border bg-bg p-5 text-center transition-colors hover:border-primary"
    >
      <div className="flex h-24 w-full items-center justify-center">
        {asociado.logo ? (
          <Image
            src={asociado.logo}
            alt={asociado.name}
            width={140}
            height={80}
            className="max-h-20 w-auto object-contain"
          />
        ) : (
          <span className="text-2xl font-bold text-accent">
            [{asociado.name.charAt(0)}]
          </span>
        )}
      </div>
      <span className="text-sm font-medium text-ink">{asociado.name}</span>
    </Link>
  );
}

export default function AsociadosPage() {
  return (
    <>
      <PageHero
        title="Asociados"
        subtitle="Directorio de los Shopping Centers, Retailers y Proveedores de servicios que integran la Cámara Argentina de Shopping Centers."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {asociadoCategories.map((category) => {
          const items = asociados.filter((a) => a.category === category);
          if (items.length === 0) return null;
          return (
            <div key={category} className="mb-14 last:mb-0">
              <h2 className="mb-6 text-2xl font-bold text-ink">
                <span className="text-accent">[</span> {category}{" "}
                <span className="text-accent">]</span>
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((a) => (
                  <AsociadoCard key={a.slug} asociado={a} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <JoinCta />
    </>
  );
}
