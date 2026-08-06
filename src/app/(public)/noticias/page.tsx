import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import { CardCover } from "@/components/shared/card-cover";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { getPublicDataLayer } from "@/lib/data";
import { byVisibilidad, onlyPublished } from "@/lib/data/published";

/**
 * Public news listing. Reads published blog posts from the panel — the same
 * source the home page previews — and gives each article its own page.
 * Paginated so the list never grows unbounded as more news is published.
 */

export const metadata: Metadata = {
  title: "Noticias — CASC",
  description:
    "Noticias y tendencias del sector de los Shopping Centers, publicadas por la Cámara Argentina de Shopping Centers.",
};

/** Articles per page (3×3 grid). */
const PAGE_SIZE = 9;

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const posts = byVisibilidad(
    onlyPublished(await getPublicDataLayer().blog.list()),
    "publico",
  ).sort((a, b) => b.fecha.localeCompare(a.fecha));

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const requested = Number.parseInt((await searchParams).page ?? "1", 10);
  const page = Math.min(Math.max(1, requested || 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = posts.slice(start, start + PAGE_SIZE);

  return (
    <>
      <PageHero
        title="Noticias"
        subtitle="Novedades, análisis y tendencias de la industria de los Centros Comerciales."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <EmptyState message="Todavía no hay noticias publicadas." />
        ) : (
          <>
            <div className="stagger-children grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((post) => (
                <Link
                  key={post.id}
                  href={`/noticias/${post.slug}`}
                  className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Card
                    interactive
                    className="card-depth flex h-full flex-col rounded-2xl"
                  >
                    <CardCover src={post.portadaUrl} alt={post.titulo} />

                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {new Date(post.fecha).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h2 className="text-base font-bold leading-6 text-ink">
                      {post.titulo}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-muted">
                      {post.bajada}
                    </p>

                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-primary">
                      Leer nota
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} />
            )}
          </>
        )}
      </section>

      <JoinCta />
    </>
  );
}

/** Prev/next pager. Links carry ?page=N so each page is its own URL (SEO). */
function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const hrefFor = (p: number) => (p <= 1 ? "/noticias" : `/noticias?page=${p}`);
  const linkClass =
    "inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary";
  const disabledClass =
    "inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-ink-muted/50";

  return (
    <nav
      className="mt-12 flex items-center justify-between gap-4"
      aria-label="Paginación de noticias"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkClass} rel="prev">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Anteriores
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Anteriores
        </span>
      )}

      <span className="text-sm text-ink-muted">
        Página {page} de {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={linkClass} rel="next">
          Siguientes
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          Siguientes
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
