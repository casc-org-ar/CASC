import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ContentRepository,
  CreateInput,
  UpdateInput,
} from "@/lib/data/repositories";
import type { BaseEntity } from "@/lib/types/domain";
import { createSupabaseClient } from "@/lib/data/supabase/client";
import type { EntityMapper } from "@/lib/data/supabase/mappers";

/** Factory for the Supabase client a repository uses (authenticated or anon). */
export type ClientFactory = () => SupabaseClient;

/**
 * Ordering for `list()`. Mirrors the mock (newest-first) for content, but a few
 * tables list differently (e.g. hoteles by name). Kept explicit per table so it
 * matches the composite indexes in migration 0005.
 */
export interface ListOrder {
  column: string;
  ascending: boolean;
}

/**
 * Generic Supabase repository. Implements the same `ContentRepository<T>` port
 * as `InMemoryContentRepository`, but reads/writes a real table via the
 * Clerk-authenticated Supabase client — so RLS (migration 0004) is the last
 * line of defense on every call.
 *
 * Parameterized by table name + the entity's row↔domain mapper, so one class
 * backs every content entity instead of a hand-written repo per table.
 *
 * A note on RLS and errors: with a missing/mismatched token, RLS makes SELECTs
 * return empty (not an error) and writes fail with a policy error. We surface
 * Supabase errors by throwing — a silent empty read is the caller's to notice,
 * but a failed write must never look like success.
 */
export class SupabaseContentRepository<T extends BaseEntity>
  implements ContentRepository<T>
{
  constructor(
    private readonly table: string,
    private readonly mapper: EntityMapper<T>,
    private readonly order: ListOrder = {
      column: "created_at",
      ascending: false,
    },
    /**
     * Which Supabase client to use. Defaults to the Clerk-authenticated one;
     * the public DataLayer passes the anonymous factory so published-content
     * reads work for anon visitors and at build time (no Clerk `auth()`).
     */
    private readonly client: ClientFactory = createSupabaseClient,
  ) {}

  async list(): Promise<T[]> {
    const supabase = this.client();
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .order(this.order.column, { ascending: this.order.ascending })
      // Tie-breaker. Ordering by a single column leaves rows that share a value
      // in an order Postgres does not guarantee, so they can come back in a
      // different sequence on each request. Rows seeded by one INSERT share the
      // exact same `created_at` (5 of the 8 actividades do), which made the
      // listing visibly reshuffle between reloads. `id` is unique, so adding it
      // makes the order total and stable without changing the primary sort.
      .order("id", { ascending: false });

    if (error) throw new Error(`[${this.table}] list failed: ${error.message}`);
    return (data ?? []).map((row) => this.mapper.fromRow(row));
  }

  async getById(id: string): Promise<T | null> {
    const supabase = this.client();
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error)
      throw new Error(`[${this.table}] getById failed: ${error.message}`);
    return data ? this.mapper.fromRow(data) : null;
  }

  async create(input: CreateInput<T>): Promise<T> {
    const supabase = this.client();
    const { data, error } = await supabase
      .from(this.table)
      .insert(this.mapper.toRow(input))
      .select("*")
      .single();

    if (error)
      throw new Error(`[${this.table}] create failed: ${error.message}`);
    return this.mapper.fromRow(data);
  }

  /**
   * Insert without reading the row back. A returning `.select()` re-reads the
   * inserted row and applies the SELECT RLS policy — but anonymous public
   * writers (contact/membership forms, CV upload) have INSERT permission and no
   * SELECT policy on those tables, so a returning insert fails RLS on the
   * read-back even though the write is allowed. Public forms don't need the
   * created row, so they use this instead of `create`.
   */
  async createNoReturn(input: CreateInput<T>): Promise<void> {
    const supabase = this.client();
    const { error } = await supabase
      .from(this.table)
      .insert(this.mapper.toRow(input));

    if (error)
      throw new Error(`[${this.table}] create failed: ${error.message}`);
  }

  async update(id: string, input: UpdateInput<T>): Promise<T> {
    const supabase = this.client();
    const { data, error } = await supabase
      .from(this.table)
      .update(this.mapper.toRow(input))
      .eq("id", id)
      .select("*")
      .single();

    if (error)
      throw new Error(`[${this.table}] update failed: ${error.message}`);
    return this.mapper.fromRow(data);
  }

  async remove(id: string): Promise<void> {
    const supabase = this.client();
    const { error } = await supabase.from(this.table).delete().eq("id", id);

    if (error)
      throw new Error(`[${this.table}] remove failed: ${error.message}`);
  }
}
