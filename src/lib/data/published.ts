import type { PublicationStatus, Visibilidad } from "@/lib/types/domain";

/**
 * Keep only published items. The socio side is read-only and must never
 * surface drafts — every socio view filters through this.
 */
export function onlyPublished<T extends { status: PublicationStatus }>(
  items: T[],
): T[] {
  return items.filter((item) => item.status === "publicado");
}

/**
 * Keep only items visible to a given audience. Blog + noticias are one entity
 * now; each article carries a `visibilidad` ("socios" | "publico" | "ambos").
 * An article tagged "ambos" surfaces for both audiences.
 */
export function byVisibilidad<T extends { visibilidad: Visibilidad }>(
  items: T[],
  audience: "socios" | "publico",
): T[] {
  return items.filter(
    (item) => item.visibilidad === audience || item.visibilidad === "ambos",
  );
}

/**
 * Sort newest-first by `fecha`, most recently published first.
 *
 * Every listing wants this, and each one used to inline
 * `.sort((a, b) => b.fecha.localeCompare(a.fecha))`. That comparator returns 0
 * for items sharing a `fecha` and leaves their relative order to whatever the
 * database happened to return — which is itself unordered for rows with equal
 * sort keys, so tied items could reshuffle between requests. Content seeded in
 * bulk shares dates often (10 of 21 blog posts do), making the reshuffle
 * visible on the page.
 *
 * Breaking ties on the unique `id` makes the order total and deterministic, so
 * a listing renders the same way every time.
 */
export function byFechaDesc<T extends { fecha: string; id: string }>(
  items: T[],
): T[] {
  return [...items].sort(
    (a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id),
  );
}
