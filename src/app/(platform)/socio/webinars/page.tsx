import { Play } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";

/** Socio Webinars: grid of published webinars, each opening its own page. */
export default async function SocioWebinarsPage() {
  const webinars = onlyPublished(await getDataLayer().webinars.list());

  return (
    <>
      <SectionHeading
        title="Webinars"
        subtitle="Charlas y capacitaciones de la Cámara"
      />
      {webinars.length === 0 ? (
        <EmptyState message="No hay webinars publicados por el momento." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {webinars.map((w) => (
            <Link
              key={w.id}
              href={`/socio/webinars/${w.id}`}
              className="block"
            >
              <Card className="flex h-full flex-col transition-colors hover:border-accent">
                <div className="mb-3 flex items-center justify-between">
                  <Badge tone="accent">{w.categoria}</Badge>
                  <span className="text-xs text-ink-muted">
                    {new Date(w.fecha).toLocaleDateString("es-AR")}
                  </span>
                </div>
                <CardTitle>{w.titulo}</CardTitle>
                <CardDescription className="mt-2 line-clamp-3 flex-1">
                  {w.descripcion}
                </CardDescription>
                <span className="mt-4 inline-flex items-center gap-2 self-start text-sm font-medium text-primary">
                  <Play className="h-4 w-4" />
                  Ver webinar
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
