import type { Metadata } from "next";
import { SafeImage } from "@/components/shared/safe-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { JoinCta } from "@/components/public/join-cta";
import { ShareButtons } from "@/components/public/share-buttons";
import { ButtonAnchor } from "@/components/ui/button";
import { readPublishedActividades } from "@/lib/data/actividades-read";
import type { Actividad } from "@/lib/types/domain";

/**
 * Activity detail page. Activities are admin-managed content read from the
 * DataLayer (public, published only), addressed by slug. The body falls back to
 * the short description when an activity has no extended write-up yet.
 */

async function getActividad(slug: string): Promise<Actividad | null> {
  const actividades = await readPublishedActividades();
  return actividades.find((a) => a.slug === slug) ?? null;
}

export async function generateStaticParams() {
  const actividades = await readPublishedActividades();
  return actividades.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const actividad = await getActividad(slug);
  if (!actividad) return { title: "Actividad — CASC" };

  return {
    title: `${actividad.titulo} — CASC`,
    description: actividad.descripcion,
    openGraph: {
      title: actividad.titulo,
      description: actividad.descripcion,
      type: "article",
      images: actividad.imagen ? [{ url: actividad.imagen }] : undefined,
    },
  };
}

export default async function ActividadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const actividad = await getActividad(slug);
  if (!actividad) notFound();

  const cuerpo = actividad.cuerpo ?? actividad.descripcion;

  return (
    <>
      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href="/actividades"
          className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver a actividades
        </Link>

        <header>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            {actividad.titulo}
          </h1>

          {(actividad.fecha || actividad.lugar) && (
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
              {actividad.fecha && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-accent" aria-hidden />
                  {actividad.fecha}
                </span>
              )}
              {actividad.lugar && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-accent" aria-hidden />
                  {actividad.lugar}
                </span>
              )}
            </div>
          )}
        </header>

        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface">
          <SafeImage src={actividad.imagen} alt={actividad.titulo} />
        </div>

        <div className="mt-8 space-y-5">
          {cuerpo
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((parrafo, i) => (
              <p key={i} className="text-base leading-8 text-ink">
                {parrafo}
              </p>
            ))}
        </div>

        {actividad.inscripcionUrl && (
          <div className="mt-8">
            <ButtonAnchor
              href={actividad.inscripcionUrl}
              target="_blank"
              rel="noreferrer"
              size="lg"
            >
              Más información e inscripción
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </ButtonAnchor>
          </div>
        )}

        <div className="mt-10 border-t border-border pt-6">
          <ShareButtons
            title={actividad.titulo}
            url={`/actividades/${actividad.slug}`}
          />
        </div>
      </article>

      <JoinCta />
    </>
  );
}
