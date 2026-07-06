import { Mail } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";

/** Socio Newsletter: archive of published editions, each opening its own page. */
export default async function SocioNewsletterPage() {
  const ediciones = onlyPublished(
    await getDataLayer().newsletters.list(),
  ).sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <>
      <SectionHeading
        title="Newsletter"
        subtitle="Archivo de ediciones del boletín"
      />
      {ediciones.length === 0 ? (
        <EmptyState message="No hay ediciones publicadas por el momento." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ediciones.map((n) => (
            <Link
              key={n.id}
              href={`/socio/newsletter/${n.id}`}
              className="block"
            >
              <Card className="flex h-full items-start gap-4 transition-colors hover:border-accent">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-casc-navy-700">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-primary">
                      {n.edicion}
                    </span>
                    <span className="text-xs text-ink-muted">
                      {new Date(n.fecha).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                  <CardTitle>{n.titulo}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {n.contenido}
                  </CardDescription>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
