import "server-only";
import type { EncuestaTextosRepository } from "@/lib/data/repositories";
import type { EncuestaTextos } from "@/lib/types/domain";
import {
  createSupabaseClient,
  isTransientTokenError,
} from "@/lib/data/supabase/client";

/**
 * Supabase-backed store for the survey's editable wording (migration 0026).
 *
 * One row per survey, keyed by slug — so this does NOT use the generic
 * `SupabaseContentRepository`, whose whole shape is id-addressed CRUD.
 *
 * The document is stored as `jsonb` and read back as-is. It is validated in
 * the action that writes it (`encuestaTextosSchema`), not here: the database
 * can guarantee valid JSON, not that it holds all nine questions.
 */
export class SupabaseEncuestaTextosRepository
  implements EncuestaTextosRepository
{
  private readonly table = "encuesta_textos";

  /** One `get` round-trip. Split out so it can be retried with a fresh client. */
  private async runGet(slug: string) {
    const supabase = createSupabaseClient();
    return supabase
      .from(this.table)
      .select("contenido")
      .eq("encuesta_slug", slug)
      .maybeSingle();
  }

  async get(slug: string): Promise<EncuestaTextos | null> {
    let { data, error } = await this.runGet(slug);

    // Same clock-skew retry as the content repository: a token minted moments
    // ago can look not-yet-valid to Supabase, and this read sits in front of
    // the survey form — failing it would take the page down over a few
    // milliseconds of drift.
    if (error && isTransientTokenError(error.message)) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      ({ data, error } = await this.runGet(slug));
    }

    if (error) {
      throw new Error(`[${this.table}] get failed: ${error.message}`);
    }
    // No row means CASC never edited the wording; the caller falls back to the
    // original texts. That is a normal state, not an error.
    return (data?.contenido as EncuestaTextos | undefined) ?? null;
  }

  async save(
    slug: string,
    textos: EncuestaTextos,
    editadoPor?: string,
  ): Promise<void> {
    const supabase = createSupabaseClient();
    // Upsert on the primary key: the first edit creates the row, every later
    // one replaces it. A survey has exactly one live set of texts — the
    // history that matters is the snapshot on each answer, not a trail here.
    const { error } = await supabase.from(this.table).upsert(
      {
        encuesta_slug: slug,
        contenido: textos,
        editado_por: editadoPor ?? null,
      },
      { onConflict: "encuesta_slug" },
    );

    if (error) {
      throw new Error(`[${this.table}] save failed: ${error.message}`);
    }
  }
}
