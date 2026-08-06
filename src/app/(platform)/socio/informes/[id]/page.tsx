import { ArrowLeft, FileDown, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonAnchor } from "@/components/ui/button";
import { getDataLayer } from "@/lib/data";
import { signedUrl } from "@/lib/data/supabase/storage";
import { clerkEnabled } from "@/lib/auth/flag";

/** How long the informe PDF stays viewable — enough to read it in one sitting. */
const PDF_TTL_SECONDS = 60 * 60; // 1 hour

/**
 * Resolve the stored `archivoUrl` to a URL the browser can load. Uploaded PDFs
 * live in the private `informes` bucket as an object PATH, so we mint a signed
 * URL for them. A pasted external link (starts with http) is used as-is.
 */
async function resolvePdfUrl(archivoUrl: string): Promise<string | null> {
  if (!archivoUrl) return null;
  if (archivoUrl.startsWith("http")) return archivoUrl;
  // A stored path — only resolvable when Supabase is active.
  if (!clerkEnabled()) return archivoUrl;
  return signedUrl("informes", archivoUrl, { ttlSeconds: PDF_TTL_SECONDS });
}

/** Individual informe page: embedded PDF viewer + download (published only). */
export default async function InformeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const informe = await getDataLayer().informes.getById(id);

  if (!informe || informe.status !== "publicado") notFound();

  const pdfUrl = await resolvePdfUrl(informe.archivoUrl);

  return (
    <div>
      <Link
        href="/socio/informes"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a informes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-primary">
            {informe.categoria}
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">
            {informe.titulo}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {new Date(informe.fecha).toLocaleDateString("es-AR")}
          </p>
        </div>
        {pdfUrl && (
          <ButtonAnchor href={pdfUrl} download>
            <FileDown className="h-4 w-4" />
            Descargar PDF
          </ButtonAnchor>
        )}
      </div>

      <p className="mt-4 text-base leading-relaxed text-ink">
        {informe.descripcion}
      </p>

      {/* Embedded PDF viewer. The URL is a signed URL for uploaded PDFs (private
          bucket) or the pasted external link. */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        {pdfUrl ? (
          <object
            data={pdfUrl}
            type="application/pdf"
            className="h-[70vh] w-full"
          >
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <FileText className="h-8 w-8 text-accent" aria-hidden />
              <p className="text-sm text-ink-muted">
                No se puede previsualizar el PDF aquí.
              </p>
              <a
                href={pdfUrl}
                className="text-sm font-medium text-primary hover:underline"
              >
                Descargar para verlo
              </a>
            </div>
          </object>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <FileText className="h-8 w-8 text-accent" aria-hidden />
            <p className="text-sm text-ink-muted">
              Este informe todavía no tiene un archivo disponible.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
