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
 * A Google Drive "…/file/d/ID/view" link is a Drive PAGE, not the PDF — it
 * can't be embedded in an <object>. Convert it to the embeddable preview form
 * so pasted Drive links render. Non-Drive URLs are returned unchanged.
 */
function normalizePdfLink(url: string): string {
  const m = url.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}

/**
 * Resolve the stored `archivoUrl` to a URL the browser can load. Uploaded PDFs
 * live in the private `informes` bucket as an object PATH, so we mint a signed
 * URL for them. A pasted external link (starts with http) is used as-is, with
 * Google Drive links normalized to their embeddable preview form.
 */
async function resolvePdfUrl(archivoUrl: string): Promise<string | null> {
  if (!archivoUrl) return null;
  if (archivoUrl.startsWith("http")) return normalizePdfLink(archivoUrl);
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
  // Google Drive serves an HTML preview page (not a raw PDF), so it must be
  // shown in an <iframe>, not an <object type="application/pdf">.
  const isDriveEmbed = !!pdfUrl && pdfUrl.includes("drive.google.com");

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

      {/* Embedded PDF viewer. A Google Drive link renders in an <iframe> (Drive
          serves an HTML preview page); an uploaded PDF (signed URL) or a direct
          .pdf link renders in an <object type="application/pdf">. */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        {!pdfUrl ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <FileText className="h-8 w-8 text-accent" aria-hidden />
            <p className="text-sm text-ink-muted">
              Este informe todavía no tiene un archivo disponible.
            </p>
          </div>
        ) : isDriveEmbed ? (
          <iframe
            src={pdfUrl}
            title={informe.titulo}
            className="h-[70vh] w-full"
            allow="autoplay"
          />
        ) : (
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
        )}
      </div>
    </div>
  );
}
