import { ArrowLeft, FileDown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonAnchor } from "@/components/ui/button";
import { getDataLayer } from "@/lib/data";

/** Individual informe page: embedded PDF viewer + download (published only). */
export default async function InformeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const informe = await getDataLayer().informes.getById(id);

  if (!informe || informe.status !== "publicado") notFound();

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
        <ButtonAnchor
          href={informe.archivoUrl}
          download
        >
          <FileDown className="h-4 w-4" />
          Descargar PDF
        </ButtonAnchor>
      </div>

      <p className="mt-4 text-base leading-relaxed text-ink">
        {informe.descripcion}
      </p>

      {/* Embedded PDF viewer. In production the URL comes from Vercel Blob. */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        <object
          data={informe.archivoUrl}
          type="application/pdf"
          className="h-[70vh] w-full"
        >
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <span className="text-3xl font-extralight text-accent">[ ]</span>
            <p className="text-sm text-ink-muted">
              No se puede previsualizar el PDF aquí.
            </p>
            <a
              href={informe.archivoUrl}
              className="text-sm font-medium text-primary hover:underline"
            >
              Descargar para verlo
            </a>
          </div>
        </object>
      </div>
    </div>
  );
}
