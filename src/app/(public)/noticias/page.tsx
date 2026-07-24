import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import { CardCover } from "@/components/shared/card-cover";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";

/**
 * Public news listing. Reads published blog posts from the panel — the same
 * source the home page previews — and gives each article its own page.
 */

export const metadata: Metadata = {
  title: "Noticias — CASC",
  description:
    "Noticias y tendencias del sector de los Shopping Centers, publicadas por la Cámara Argentina de Shopping Centers.",
};

export default async function NoticiasPage() {
  const posts = onlyPublished(await getDataLayer().blog.list()).sort((a, b) =>
    b.fecha.localeCompare(a.fecha),
  );

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
          <div className="stagger-children grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
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
        )}
      </section>

      <JoinCta />
    </>
  );
}
