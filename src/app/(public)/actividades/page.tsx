import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";

/**
 * Actividades — migrated from actividades.html.
 *
 * The original page is entirely blog-driven: its content is the "Actividades
 * 2026 / 2025" event carousels sourced from articulos/actividades/*. That is
 * dynamic blog content wired from the internal panel in Etapa 3. The page
 * structure is reproduced here; the event grids are TODO for Etapa 3 — no
 * fabricated events are added.
 */

export const metadata: Metadata = {
  title: "Actividades — CASC",
  description:
    "Capacitaciones y eventos de la Cámara Argentina de Shopping Centers.",
};

export default function ActividadesPage() {
  return (
    <>
      <PageHero title="Capacitaciones y eventos" />

      {/* Actividades 2026 — Etapa 3 (blog desde el panel) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-ink">
          Actividades 2026
        </h2>
        {/* TODO Etapa 3: carrusel de actividades 2026 alimentado desde el panel. */}
      </section>

      {/* Actividades 2025 — Etapa 3 (blog desde el panel) */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-ink">
            Actividades 2025
          </h2>
          {/* TODO Etapa 3: carrusel de actividades 2025 alimentado desde el panel. */}
        </div>
      </section>

      <JoinCta />
    </>
  );
}
