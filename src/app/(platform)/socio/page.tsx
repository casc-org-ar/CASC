import { FileText, Newspaper, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getDataLayer } from "@/lib/data";

/** Socio home: read-only feed mixing latest published news, webinars, informes. */
export default async function SocioHomePage() {
  const data = getDataLayer();
  const [webinars, informes, noticias] = await Promise.all([
    data.webinars.list(),
    data.informes.list(),
    data.noticias.list(),
  ]);

  const onlyPublished = <T extends { status: string }>(items: T[]) =>
    items.filter((i) => i.status === "publicado");

  type FeedItem = {
    tipo: string;
    icon: LucideIcon;
    titulo: string;
    descripcion: string;
    fecha: string;
  };

  const feed: FeedItem[] = [
    ...onlyPublished(noticias).map((n) => ({
      tipo: "Noticia",
      icon: Newspaper,
      titulo: n.titulo,
      descripcion: n.bajada,
      fecha: n.fecha,
    })),
    ...onlyPublished(webinars).map((w) => ({
      tipo: "Webinar",
      icon: Video,
      titulo: w.titulo,
      descripcion: w.descripcion,
      fecha: w.fecha,
    })),
    ...onlyPublished(informes).map((i) => ({
      tipo: "Informe",
      icon: FileText,
      titulo: i.titulo,
      descripcion: i.descripcion,
      fecha: i.fecha,
    })),
  ].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <>
      <SectionHeading
        title="Novedades"
        subtitle="Lo último publicado por la Cámara"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {feed.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {item.tipo}
                  </span>
                </div>
                <Badge tone="muted">
                  {new Date(item.fecha).toLocaleDateString("es-AR")}
                </Badge>
              </div>
              <CardTitle>{item.titulo}</CardTitle>
              <CardDescription className="mt-2">
                {item.descripcion}
              </CardDescription>
            </Card>
          );
        })}
      </div>
    </>
  );
}
