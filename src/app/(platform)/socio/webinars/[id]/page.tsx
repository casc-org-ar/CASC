import { ArrowLeft, FileDown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getDataLayer } from "@/lib/data";

/** Individual webinar page: embedded player + attached material (published only). */
export default async function WebinarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const webinar = await getDataLayer().webinars.getById(id);

  if (!webinar || webinar.status !== "publicado") notFound();

  return (
    <div>
      <Link
        href="/socio/webinars"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a webinars
      </Link>

      <div className="mb-4 flex items-center gap-3">
        <Badge tone="accent">{webinar.categoria}</Badge>
        <span className="text-sm text-ink-muted">
          {new Date(webinar.fecha).toLocaleDateString("es-AR")}
        </span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        {webinar.titulo}
      </h1>

      <div className="mt-6 aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black">
        <iframe
          src={webinar.videoUrl}
          title={webinar.titulo}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="mt-6 text-base leading-relaxed text-ink">
        {webinar.descripcion}
      </p>

      {webinar.materialAdjuntoUrl && (
        <a
          href={webinar.materialAdjuntoUrl}
          download
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface"
        >
          <FileDown className="h-4 w-4 text-primary" />
          Descargar material adjunto
        </a>
      )}
    </div>
  );
}
