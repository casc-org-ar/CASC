import type { DataLayer } from "@/lib/data/repositories";
import { mockDataLayer } from "@/lib/data/mock";

/**
 * Single entry point to the data layer. This is the ONLY place that
 * decides which implementation is active. To switch to Supabase later,
 * build `supabaseDataLayer` and return it here based on an env flag —
 * no component or page changes.
 */
export function getDataLayer(): DataLayer {
  return mockDataLayer;
}

export type { DataLayer } from "@/lib/data/repositories";
