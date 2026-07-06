import type { PublicationStatus } from "@/lib/types/domain";

/**
 * Keep only published items. The socio side is read-only and must never
 * surface drafts — every socio view filters through this.
 */
export function onlyPublished<T extends { status: PublicationStatus }>(
  items: T[],
): T[] {
  return items.filter((item) => item.status === "publicado");
}
