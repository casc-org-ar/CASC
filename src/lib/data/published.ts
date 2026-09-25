import type {
  PublicationStatus,
  SocioCategoria,
  Visibilidad,
} from "@/lib/types/domain";

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
 * Keep only the items a member of `categoria` may see.
 *
 * Each report declares its own audience (`Informe.categorias`, migration
 * 0027), so this is what makes the Informes section show different things to a
 * shopping centre and to a provider.
 *
 * An UNDEFINED category is denied everything, never granted it. That state
 * should not occur — the socio layout redirects members whose row is not
 * linked yet — so reaching here without one means something unexpected
 * happened, and an unexpected state must not be the one that opens the door.
 * This mirrors `visibleFor` in navigation.ts on purpose.
 *
 * An admin previewing the socio surface passes `undefined` too, but they reach
 * the listing through their own path (`requireCategoria` lets them through),
 * so callers hand them every item rather than calling this.
 */
export function byCategoria<T extends { categorias: SocioCategoria[] }>(
  items: T[],
  categoria: SocioCategoria | undefined,
): T[] {
  if (!categoria) return [];
  return items.filter((item) => item.categorias.includes(categoria));
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
