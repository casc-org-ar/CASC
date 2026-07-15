import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import {
  ContentCarousel,
  type ContentCarouselItem,
} from "@/components/public/content-carousel";
import { EmptyState } from "@/components/shared/empty-state";
import { actividades2025, capacitaciones } from "@/lib/data/home-content";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";

/**
 * Actividades — migrated from actividades.html.
 *
 * Content comes from real migrated activities and published BlogPosts from
 * the internal DataLayer. Drafts stay hidden through onlyPublished().
 */

export const metadata: Metadata = {
  title: "Actividades — CASC",
  description:
    "Capacitaciones y eventos de la Cámara Argentina de Shopping Centers.",
};

const heroDescription =
  "Desarrollamos una agenda capacitaciones y eventos orientada a promover el intercambio de conocimientos, la actualización profesional y el fortalecimiento de la industria de los Centros Comerciales en Argentina.";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default async function ActividadesPage() {
  const blogPosts = onlyPublished(await getDataLayer().blog.list()).sort(
    (a, b) => (a.fecha < b.fecha ? 1 : -1),
  );

  const activityItems: ContentCarouselItem[] = capacitaciones.map(
    (item, index) => ({
      id: `actividad-${index + 1}`,
      title: item.titulo,
      description: item.descripcion,
      image: item.imagen,
      eyebrow: "Actividad",
    }),
  );

  const activity2025Items: ContentCarouselItem[] = actividades2025.map(
    (item, index) => ({
      id: `actividad-2025-${index + 1}`,
      title: item.titulo,
      description: item.descripcion,
      image: item.imagen,
      imageFit: "contain",
      eyebrow: "Actividad 2025",
    }),
  );

  const newsItems: ContentCarouselItem[] = blogPosts.map((post) => ({
    id: post.slug,
    title: post.titulo,
    description: post.bajada,
    image: post.portadaUrl,
    eyebrow: "Noticia",
    dateLabel: formatDate(post.fecha),
  }));

  return (
    <>
      <PageHero title="Capacitaciones y eventos" subtitle={heroDescription} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ContentCarousel title="Actividades 2026" items={activityItems} />
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <ContentCarousel title="Actividades 2025" items={activity2025Items} />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {newsItems.length > 0 ? (
            <ContentCarousel
              title="Noticias y tendencias del sector"
              items={newsItems}
            />
          ) : (
            <EmptyState message="Pronto vas a encontrar acá las últimas noticias del sector." />
          )}
        </div>
      </section>

      <JoinCta />
    </>
  );
}
