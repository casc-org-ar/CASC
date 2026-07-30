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
