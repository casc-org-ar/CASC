import type { DataLayer } from "@/lib/data/repositories";

/**
 * Supabase data layer — STUB.
 *
 * Roadmap: implement each repository against Supabase (PostgreSQL) using
 * the same `ContentRepository<T>` contract, then return this bundle from
 * `getDataLayer()` behind an env flag. Nothing in the UI changes.
 *
 * Intentionally not implemented in this phase.
 */
export const supabaseDataLayer: DataLayer = new Proxy({} as DataLayer, {
  get() {
    throw new Error(
      "supabaseDataLayer is not implemented yet. See README roadmap step 3.",
    );
  },
});
