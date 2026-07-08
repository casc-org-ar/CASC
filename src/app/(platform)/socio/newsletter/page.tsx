import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";
import type { Newsletter } from "@/lib/types/domain";

/** Socio Newsletter: archive of published editions, grouped by year only when spanning multiple years. */
export default async function SocioNewsletterPage() {
  const ediciones = onlyPublished(
    await getDataLayer().newsletters.list(),
  ).sort((a, b) => b.fecha.localeCompare(a.fecha));

  // Group by year (already sorted newest-first, so years come down in order).
  const porAnio = new Map<number, Newsletter[]>();
  for (const edicion of ediciones) {
    const anio = new Date(edicion.fecha).getFullYear();
    const grupo = porAnio.get(anio) ?? [];
    grupo.push(edicion);
    porAnio.set(anio, grupo);
  }
  // Show the year heading only when there's more than one year to separate —
  // a lone "2026" over every edition is noise, not information.
  const showYearHeading = porAnio.size > 1;

  return (
    <>
      <SectionHeading
        title="Newsletter"
        subtitle="Archivo de ediciones del boletín"
      />
      {ediciones.length === 0 ? (
        <EmptyState message="No hay ediciones publicadas por el momento." />
      ) : (
        <div className="space-y-8">
          {[...porAnio.entries()].map(([anio, grupo]) => (
            <section key={anio}>
              {showYearHeading && (
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
                  {anio}
                </h2>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {grupo.map((n) => (
                  <Link
                    key={n.id}
                    href={`/socio/newsletter/${n.id}`}
                    className="block"
                  >
                    <Card
                      interactive
                      className="flex h-full items-start gap-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-casc-navy-700">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="text-xs font-medium uppercase tracking-wide text-primary">
                            {n.edicion}
                          </span>
                          <span className="text-xs text-ink-muted">
                            {new Date(n.fecha).toLocaleDateString("es-AR")}
                          </span>
                        </div>
                        <CardTitle>{n.titulo}</CardTitle>
                        {n.contenido && (
                          <CardDescription className="mt-1 line-clamp-2">
                            {n.contenido}
                          </CardDescription>
                        )}
                        <span className="mt-3 inline-flex items-center gap-1 self-start text-sm font-medium text-primary">
                          Abrir edición
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
