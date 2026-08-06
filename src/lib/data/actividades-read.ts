import { getPublicDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";
import type { Actividad } from "@/lib/types/domain";

/**
 * Read published activities for the public site, resiliently.
 *
 * The `actividades` table may be briefly unavailable during a deploy (migration
 * not applied yet, or the Supabase schema cache not refreshed). Public pages
 * that list activities MUST NOT crash the build over that — a missing table
 * should degrade to "no activities yet", not a failed export. So any read error
 * is swallowed and an empty list returned.
 */
export async function readPublishedActividades(): Promise<Actividad[]> {
  try {
    return onlyPublished(await getPublicDataLayer().actividades.list());
  } catch {
    return [];
  }
}
