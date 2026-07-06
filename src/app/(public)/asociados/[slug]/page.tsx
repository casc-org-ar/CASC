import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import { asociados, getAsociadoBySlug } from "@/lib/data/asociados";

/**
 * Asociado ficha — dynamic route migrated from asociados/[slug].html.
 * Pre-rendered for every associate via generateStaticParams.
 */

export function generateStaticParams() {
  return asociados.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const asociado = getAsociadoBySlug(slug);
  if (!asociado) return { title: "Asociado — CASC" };
  return {
    title: `${asociado.name} — CASC`,
    description: `${asociado.name} — ${asociado.category}. Asociado de la Cámara Argentina de Shopping Centers.`,
  };
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border py-3">
      <dt className="text-sm font-semibold text-ink">{label}</dt>
      <dd className="mt-1 text-ink-muted">{value}</dd>
    </div>
  );
}

export default async function AsociadoFichaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const asociado = getAsociadoBySlug(slug);
  if (!asociado) notFound();

  const webHref = asociado.web
    ? asociado.web.startsWith("http")
      ? asociado.web
      : `https://${asociado.web}`
    : null;

  return (
    <>
      <PageHero title={asociado.name} subtitle={asociado.category} />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/asociados"
          className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver al directorio
        </Link>

        <div className="grid gap-10 md:grid-cols-[200px_1fr]">
          {/* Logo */}
          <div className="flex items-start justify-center">
            {asociado.logo ? (
              <Image
                src={asociado.logo}
                alt={asociado.name}
                width={200}
                height={120}
                className="w-full max-w-[200px] object-contain"
              />
            ) : (
              <span className="text-5xl font-bold text-accent">
                [{asociado.name.charAt(0)}]
              </span>
            )}
          </div>

          {/* Datos */}
          <div>
            {asociado.actividad && (
              <p className="mb-6 font-light text-ink-muted">
                {asociado.actividad}
              </p>
            )}

            <dl>
              {asociado.direccion && (
                <DataRow label="Dirección" value={asociado.direccion} />
              )}
              {asociado.telefono && (
                <DataRow label="Teléfono" value={asociado.telefono} />
              )}
              {asociado.contacto && (
                <DataRow label="Contacto" value={asociado.contacto} />
              )}
              {asociado.inauguracion && (
                <DataRow label="Inauguración" value={asociado.inauguracion} />
              )}
              {asociado.visitas && (
                <DataRow label="Visitas mensuales" value={asociado.visitas} />
              )}
              {asociado.locales && (
                <DataRow label="Cantidad de locales" value={asociado.locales} />
              )}
            </dl>

            {webHref && (
              <a
                href={webHref}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Visitar sitio web
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            )}
          </div>
        </div>
      </section>

      <JoinCta />
    </>
  );
}
