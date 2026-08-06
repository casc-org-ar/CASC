import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { CardCover } from "@/components/shared/card-cover";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { readPublishedActividades } from "@/lib/data/actividades-read";

export const metadata = { title: "Actividades" };

/**
 * Socio Actividades: the same published activities shown on the public site,
 * surfaced inside the panel for members. Cards open the public detail page
 * (/actividades/[slug]), which already renders the full activity.
 */
export default async function SocioActividadesPage() {
  const actividades = await readPublishedActividades();

  return (
    <>
      <SectionHeading
        title="Actividades"
        subtitle="Capacitaciones, congresos y eventos de la Cámara"
      />

      {actividades.length === 0 ? (
        <EmptyState message="Todavía no hay actividades publicadas." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actividades.map((actividad) => (
            <Link
              key={actividad.id}
              href={`/actividades/${actividad.slug}`}
              className="group block"
            >
              <Card interactive className="flex h-full flex-col overflow-hidden">
                <CardCover src={actividad.imagen} alt={actividad.titulo} />
                <CardTitle>{actividad.titulo}</CardTitle>
                {(actividad.fecha || actividad.lugar) && (
                  <p className="mt-1 text-xs font-medium text-ink-muted">
                    {[actividad.fecha, actividad.lugar]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                <CardDescription className="mt-2 line-clamp-3">
                  {actividad.descripcion}
                </CardDescription>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Ver actividad
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
