import { ArrowLeft, ExternalLink, FileDown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonAnchor } from "@/components/ui/button";
import { getDataLayer } from "@/lib/data";

/**
 * Individual newsletter edition — reads like an opened email: header with
 * edition/date, then the body. The platform is an archive: `adjuntoUrl` holds
 * the link to the edition already sent (a Mailchimp/emBlue campaign page) or a
 * PDF. A PDF is offered as a download; an external campaign link opens in a new
 * tab so the socio sees the edition exactly as it was sent.
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

        {edicion.contenido && (
          <div className="whitespace-pre-line px-6 py-6 text-base leading-relaxed text-ink">
            {edicion.contenido}
          </div>
        )}

        {edicion.adjuntoUrl &&
          (() => {
            const esPdf = /\.pdf($|\?)/i.test(edicion.adjuntoUrl);
            return (
              <div className="border-t border-border px-6 py-6">
                <p className="mb-3 text-sm text-ink-muted">
                  Accedé a la edición completa tal como fue enviada:
                </p>
                <ButtonAnchor
                  href={edicion.adjuntoUrl}
                  {...(esPdf
                    ? { download: true }
                    : { target: "_blank", rel: "noreferrer" })}
                >
                  {esPdf ? (
                    <>
                      <FileDown className="h-4 w-4" />
                      Descargar edición
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      Ver edición completa
                    </>
                  )}
                </ButtonAnchor>
              </div>
            );
          })()}
      </div>
    </div>
  );
}
