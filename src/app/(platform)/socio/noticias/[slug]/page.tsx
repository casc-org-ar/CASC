import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/shared/safe-image";
import { getDataLayer } from "@/lib/data";
import { byVisibilidad, onlyPublished } from "@/lib/data/published";

/**
 * Individual article page for members (read-only). Resolves by slug — the same
 * URL scheme as the public site — and only surfaces articles that are published
 * and flagged for the socios audience.
 */
export default async function NoticiaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const noticias = byVisibilidad(
    onlyPublished(await getDataLayer().blog.list()),
    "socios",
  );
  const noticia = noticias.find((n) => n.slug === slug);

  // A socio must never reach a draft, a public-only article, or a missing item.
  if (!noticia) notFound();

  return (
    <article>
      <Link
        href="/socio/noticias"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a noticias
      </Link>

      {noticia.portadaUrl && (
        <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl bg-surface md:h-80">
          <SafeImage src={noticia.portadaUrl} alt={noticia.titulo} />
        </div>
      )}

      <div className="flex items-center gap-3">
        {noticia.tags[0] && <Badge tone="accent">{noticia.tags[0]}</Badge>}
        <p className="text-sm text-ink-muted">
          {new Date(noticia.fecha).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
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
