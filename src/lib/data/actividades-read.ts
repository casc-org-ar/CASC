import { getPublicDataLayer } from "@/lib/data";
import { byVisibilidad, onlyPublished } from "@/lib/data/published";
import type { Actividad } from "@/lib/types/domain";

/**
 * Read published activities for a given audience, resiliently.
 *
 * Filters by `visibilidad` like the blog: the public site sees 'publico' +
 * 'ambos'; the members panel sees 'socios' + 'ambos'. Pass no audience to get
 * every published activity (e.g. the admin, or a slug lookup across audiences).
 *
 * The `actividades` table may be briefly unavailable during a deploy (migration
 * not applied yet, or the Supabase schema cache not refreshed). Callers MUST
 * NOT crash the build over that — a missing table degrades to "no activities",
 * not a failed export. So any read error is swallowed and an empty list returned.
 */
export async function readPublishedActividades(
  audience?: "socios" | "publico",
): Promise<Actividad[]> {
  try {
    const published = onlyPublished(
      await getPublicDataLayer().actividades.list(),
    );
    const visible = audience ? byVisibilidad(published, audience) : published;
    // Newest EVENT first, by `fechaEvento`.
    //
    // Ordering used to run on `createdAt` (publication time) while each card
    // shows the event date, so the dates on screen looked shuffled — sorted by
    // one field, read by another. `fecha` cannot be the key either: it is free
    // text in mixed formats ("8 de mayo", "13 de agosto 2026"). `fechaEvento`
    // is the real date added for exactly this.
    //
    // Activities with no event date sort last rather than on top, where a
    // missing value would otherwise outrank confirmed events; among themselves
    // they keep publication order, with `id` breaking ties so rows sharing a
    // timestamp never reshuffle between requests.
    return [...visible].sort((a, b) => {
      if (a.fechaEvento && b.fechaEvento) {
        return (
          b.fechaEvento.localeCompare(a.fechaEvento) ||
          b.createdAt.localeCompare(a.createdAt) ||
          b.id.localeCompare(a.id)
        );
      }
      if (a.fechaEvento) return -1;
      if (b.fechaEvento) return 1;
      return (
        b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id)
      );
    });
  } catch {
    return [];
  }
}
