import { ArrowLeft, FileDown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDataLayer } from "@/lib/data";

/**
 * Individual newsletter edition — reads like an opened email: header with
 * edition/date, then the body. Optional PDF download (published only).
 */
export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const edicion = await getDataLayer().newsletters.getById(id);

  if (!edicion || edicion.status !== "publicado") notFound();

  return (
    <div>
      <Link
        href="/socio/newsletter"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al archivo
      </Link>

      {/* Email-like envelope */}
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="border-b border-border bg-surface px-6 py-4">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span className="font-medium uppercase tracking-wide text-primary">
              {edicion.edicion}
            </span>
            <span>
              {new Date(edicion.fecha).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">
            {edicion.titulo}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            CASC · Cámara Argentina de Shopping Centers
          </p>
        </div>

        <div className="whitespace-pre-line px-6 py-6 text-base leading-relaxed text-ink">
          {edicion.contenido}
        </div>

        {edicion.adjuntoUrl && (
          <div className="border-t border-border px-6 py-4">
            <a
              href={edicion.adjuntoUrl}
              download
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface"
            >
              <FileDown className="h-4 w-4 text-primary" />
              Descargar edición en PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
