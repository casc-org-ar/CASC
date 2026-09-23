import type { EncuestaTextosRepository } from "@/lib/data/repositories";
import type { EncuestaTextos } from "@/lib/types/domain";

/**
 * In-memory store for the survey's editable wording. Satisfies the same port
 * as the Supabase one, so the form and the admin panel behave identically
 * under the mock.
 *
 * Starts EMPTY on purpose: no row means "never edited", which is what a fresh
 * database looks like, and callers fall back to `ENCUESTA_TEXTOS_ORIGINALES`.
 * Seeding it would hide that fallback path during development — the one that
 * every existing install runs until someone saves an edit.
 */
export class InMemoryEncuestaTextosRepository
  implements EncuestaTextosRepository
{
  private readonly store = new Map<string, EncuestaTextos>();

  async get(slug: string): Promise<EncuestaTextos | null> {
    const guardado = this.store.get(slug);
    // A copy, so a caller mutating what it read cannot alter the store —
    // the Supabase repository returns fresh objects every time.
    return guardado ? structuredClone(guardado) : null;
  }

  async save(slug: string, textos: EncuestaTextos): Promise<void> {
    this.store.set(slug, structuredClone(textos));
  }
}
