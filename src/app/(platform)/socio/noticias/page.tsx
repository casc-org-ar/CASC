import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";

/** Socio Noticias: feed of published news, each linking to its own page. */
export default async function SocioNoticiasPage() {
  const noticias = onlyPublished(await getDataLayer().noticias.list()).sort(
    (a, b) => b.fecha.localeCompare(a.fecha),
  );

  return (
    <>
      <SectionHeading title="Noticias" subtitle="Novedades institucionales" />
      {noticias.length === 0 ? (
        <EmptyState message="No hay noticias publicadas por el momento." />
      ) : (
        <div className="space-y-4">
          {noticias.map((n) => (
            <Link key={n.id} href={`/socio/noticias/${n.id}`} className="block">
              <Card className="transition-colors hover:border-accent">
                <div className="mb-2 text-xs text-ink-muted">
                  {new Date(n.fecha).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <CardTitle className="text-lg">{n.titulo}</CardTitle>
                <CardDescription className="mt-1 font-medium text-ink">
                  {n.bajada}
                </CardDescription>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Leer nota
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
