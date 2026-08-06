import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { ButtonAnchor } from "@/components/ui/button";
import { readPublishedActividades } from "@/lib/data/actividades-read";

export const metadata = { title: "Actividad" };

/**
 * Socio activity detail. Members read the activity inside the panel (not the
 * public site), so the card links here. Only activities visible to members
 * ('socios' or 'ambos') resolve.
 */
export default async function SocioActividadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const actividad = (await readPublishedActividades("socios")).find(
    (a) => a.slug === slug,
  );
  if (!actividad) notFound();

  const cuerpo = actividad.cuerpo ?? actividad.descripcion;

  return (
    <article>
      <Link
        href="/socio/actividades"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a actividades
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {actividad.titulo}
      </h1>

      {(actividad.fecha || actividad.lugar) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
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

      {actividad.imagen && (
        <div className="mt-6 w-full overflow-hidden rounded-xl border border-border bg-surface">
          <SafeImage
            src={actividad.imagen}
            alt={actividad.titulo}
            fit="contain"
            className="max-h-[70vh] w-full object-contain"
          />
        </div>
      )}

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
    </article>
  );
}
