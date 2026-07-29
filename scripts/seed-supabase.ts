/**
 * Seed Supabase with the real content originally migrated from the legacy CASC
 * site (the data that lived in the mock `seed-data.ts`).
 *
 * When the app switched from the in-memory mock to Supabase, the platform began
 * reading an empty database — so the real content "disappeared" from the UI.
 * This script loads that same seed into Supabase as real rows, which the admin
 * can then edit or delete like any other content.
 *
 * It reuses the SAME row↔domain mappers the app uses, so the inserted columns
 * match the app's contract exactly (no duplicated camelCase→snake_case logic).
 *
 * Auth: inserts must bypass RLS (this runs as "the system", not a logged-in
 * user), so it uses the SERVICE ROLE key. That key is read from the environment
 * and never hardcoded. Run locally only.
 *
 * Run:  pnpm seed        (loads .env.local, then executes this file with tsx)
 */
import { createClient } from "@supabase/supabase-js";
import type { BaseEntity } from "@/lib/types/domain";
import type { EntityMapper } from "@/lib/data/supabase/mappers";
import {
  blogMapper,
  candidatoMapper,
  consultaMapper,
  hotelMapper,
  informeMapper,
  newsletterMapper,
  noticiaMapper,
  socioMapper,
  solicitudMapper,
  webinarMapper,
} from "@/lib/data/supabase/mappers";
import {
  blogPosts,
  candidatos,
  consultas,
  hoteles,
  informes,
  newsletters,
  noticias,
  socios,
  solicitudes,
  webinars,
} from "@/lib/data/mock/seed-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Faltan variables: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY " +
      "(la service_role key, en .env.local). Abortando.",
  );
  process.exit(1);
}

// Node < 22 has no global WebSocket, and creating a Supabase client eagerly
// initializes its Realtime module, which throws without one. The seed never
// uses Realtime — only inserts — so a no-op WebSocket stub satisfies the
// initializer without pulling in a dependency. Harmless: it's never connected.
if (typeof (globalThis as { WebSocket?: unknown }).WebSocket === "undefined") {
  (globalThis as { WebSocket?: unknown }).WebSocket = class {
    close() {}
    addEventListener() {}
    removeEventListener() {}
    send() {}
  };
}

// Service-role client: bypasses RLS. Never expose this key to the browser.
const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});

/**
 * One seed unit: a table, its rows, and the mapper that turns each domain row
 * into DB columns. `toRow` drops id/created_at/updated_at (DB-owned), so seeded
 * rows get fresh UUIDs and timestamps — the mock string ids are not reused.
 */
interface SeedGroup<T extends BaseEntity> {
  table: string;
  rows: T[];
  mapper: EntityMapper<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const groups: SeedGroup<any>[] = [
  { table: "webinars", rows: webinars, mapper: webinarMapper },
  { table: "informes", rows: informes, mapper: informeMapper },
  { table: "noticias", rows: noticias, mapper: noticiaMapper },
  { table: "newsletters", rows: newsletters, mapper: newsletterMapper },
  { table: "blog_posts", rows: blogPosts, mapper: blogMapper },
  { table: "hoteles", rows: hoteles, mapper: hotelMapper },
  { table: "socios", rows: socios, mapper: socioMapper },
  { table: "candidatos", rows: candidatos, mapper: candidatoMapper },
  { table: "solicitudes", rows: solicitudes, mapper: solicitudMapper },
  { table: "consultas", rows: consultas, mapper: consultaMapper },
];

async function seed() {
  console.log("Sembrando Supabase con el contenido real…\n");

  for (const { table, rows, mapper } of groups) {
    if (rows.length === 0) {
      console.log(`- ${table}: sin datos en el seed, se omite.`);
      continue;
    }

    const payload = rows.map((row) => mapper.toRow(row));
    const { error } = await supabase.from(table).insert(payload);

    if (error) {
      console.error(`✗ ${table}: ${error.message}`);
    } else {
      console.log(`✓ ${table}: ${rows.length} registros insertados.`);
    }
  }

  console.log("\nListo. Revisá el contenido en la app o en el dashboard.");
}

seed().catch((err) => {
  console.error("Error inesperado durante el seed:", err);
  process.exit(1);
});
