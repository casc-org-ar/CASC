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
    // Newest publication first. `fecha` is a free-text display date ("8 de
    // mayo", "13 de agosto 2026") and cannot be sorted, so publication time
    // (`createdAt`) is the ordering key. Sorting here — not only in the
    // repository — keeps every actividades view consistent, and `id` breaks
    // ties so rows seeded with an identical timestamp never reshuffle.
    return [...visible].sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id),
    );
  } catch {
    return [];
  }
}
