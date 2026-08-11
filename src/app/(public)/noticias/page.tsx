import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import { CardCover } from "@/components/shared/card-cover";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { getPublicDataLayer } from "@/lib/data";
import { byVisibilidad, onlyPublished } from "@/lib/data/published";

/**
 * Public news listing. Reads published blog posts from the panel — the same
 * source the home page previews — and gives each article its own page. A
 * server-side search (?q=) and numbered pagination (?page=) keep the growing
 * archive navigable; both live in the URL so they work without JS and are SEO-
 * friendly.
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
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const query = (sp.q ?? "").trim();
  const q = query.toLowerCase();

  const allPosts = byVisibilidad(
    onlyPublished(await getPublicDataLayer().blog.list()),
    "publico",
  ).sort((a, b) => b.fecha.localeCompare(a.fecha));

  // Filter by the search query across title, summary and body.
  const posts = q
    ? allPosts.filter((p) =>
        `${p.titulo} ${p.bajada} ${p.cuerpo}`.toLowerCase().includes(q),
      )
    : allPosts;

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const requested = Number.parseInt(sp.page ?? "1", 10);
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
        {/* Buscador (server-side, ?q=). Reinicia a la página 1 en cada búsqueda. */}
        <form method="get" action="/noticias" className="mb-10 flex max-w-xl gap-2">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Buscar noticias…"
              aria-label="Buscar noticias"
              className="min-h-11 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Buscar
          </button>
        </form>

        {allPosts.length === 0 ? (
          <EmptyState message="Todavía no hay noticias publicadas." />
        ) : posts.length === 0 ? (
          <EmptyState
            message={`No encontramos noticias para "${query}". Probá con otra búsqueda.`}
          />
        ) : (
          <>
            {query && (
              <p className="mb-6 text-sm text-ink-muted">
                {posts.length} resultado{posts.length === 1 ? "" : "s"} para “
                {query}”.
              </p>
            )}
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
              <Pagination page={page} totalPages={totalPages} query={query} />
            )}
          </>
        )}
      </section>

      <JoinCta />
    </>
  );
}

/**
 * Numbered pager: `‹ 1 2 3 ›`. Each link carries ?page=N (and ?q= when a search
 * is active) so every page is its own URL (SEO + shareable).
 */
function Pagination({
  page,
  totalPages,
  query,
}: {
  page: number;
  totalPages: number;
  query: string;
}) {
  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/noticias?${qs}` : "/noticias";
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const base =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors";
  const active = `${base} border-primary bg-primary text-white`;
  const inactive = `${base} border-border bg-white text-ink hover:border-primary hover:text-primary`;
  const disabled = `${base} border-border bg-surface text-ink-muted/40`;

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label="Paginación de noticias"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={inactive} rel="prev" aria-label="Página anterior">
          ‹
        </Link>
      ) : (
        <span className={disabled} aria-disabled="true">
          ‹
        </span>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          className={p === page ? active : inactive}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Link>
      ))}

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={inactive} rel="next" aria-label="Página siguiente">
          ›
        </Link>
      ) : (
        <span className={disabled} aria-disabled="true">
          ›
        </span>
      )}
    </nav>
  );
}
