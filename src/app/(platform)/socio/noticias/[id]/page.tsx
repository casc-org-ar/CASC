import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDataLayer } from "@/lib/data";

/** Individual news article page (read-only, published only). */
export default async function NoticiaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noticia = await getDataLayer().noticias.getById(id);

  // A socio must never reach a draft or a missing item.
  if (!noticia || noticia.status !== "publicado") notFound();

  return (
    <article>
      <Link
        href="/socio/noticias"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a noticias
      </Link>

      <p className="text-sm text-ink-muted">
        {new Date(noticia.fecha).toLocaleDateString("es-AR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
        {noticia.titulo}
      </h1>
      <p className="mt-3 text-lg font-medium text-ink-muted">
        {noticia.bajada}
      </p>

      <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-ink">
        {noticia.cuerpo}
      </div>
    </article>
  );
}
