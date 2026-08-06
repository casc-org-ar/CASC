import type {
  ActividadRepository,
  BlogRepository,
  CandidatoRepository,
  ConsultaRepository,
  DataLayer,
  HotelRepository,
  NoticiaRepository,
  SolicitudRepository,
} from "@/lib/data/repositories";
import { SupabaseContentRepository } from "@/lib/data/supabase/content-repository";
import { createPublicSupabaseClient } from "@/lib/data/supabase/client";
import {
  actividadMapper,
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

/**
 * Supabase data layer.
 *
 * Every entity is backed by the generic `SupabaseContentRepository`, one
 * instance per table + its row↔domain mapper. All calls go through the
 * Clerk-authenticated client, so RLS (0004 / 0007) applies on every read/write.
 *
 * The `ContentRepository<T>` contract fits all ten entities uniformly — even
 * socios/candidatos/solicitudes/consultas, whose per-field differences live in
 * their mappers, not in the repository. Only the list ordering varies per table
 * (matching the 0005/0007 indexes).
 */
export const supabaseDataLayer: DataLayer = {
  // Content entities — newest-first, matching the mock and the 0005 indexes.
  actividades: new SupabaseContentRepository("actividades", actividadMapper),
  webinars: new SupabaseContentRepository("webinars", webinarMapper),
  informes: new SupabaseContentRepository("informes", informeMapper),
  noticias: new SupabaseContentRepository("noticias", noticiaMapper),
  newsletters: new SupabaseContentRepository("newsletters", newsletterMapper),
  blog: new SupabaseContentRepository("blog_posts", blogMapper),
  // Hoteles list by name, not by date.
  hoteles: new SupabaseContentRepository("hoteles", hotelMapper, {
    column: "nombre",
    ascending: true,
  }),

  // Special entities — same generic repo, entity-specific mappers.
  candidatos: new SupabaseContentRepository("candidatos", candidatoMapper),
  solicitudes: new SupabaseContentRepository("solicitudes", solicitudMapper),
  consultas: new SupabaseContentRepository("consultas", consultaMapper),
  socios: new SupabaseContentRepository("socios", socioMapper),
};

/**
 * PUBLIC read repositories for the anonymous website.
 *
 * These use the anonymous Supabase client (no Clerk token), so they work for
 * logged-out visitors and during static generation. Backed by the public-read
 * RLS policy (migration 0009): they can only ever return rows with
 * status = 'publicado'. Only the entities the public site actually shows are
 * exposed here — never candidatos/socios/etc.
 */
const asc = { column: "nombre", ascending: true } as const;

export const publicActividades: ActividadRepository =
  new SupabaseContentRepository(
    "actividades",
    actividadMapper,
    { column: "created_at", ascending: false },
    createPublicSupabaseClient,
  );
export const publicBlog: BlogRepository = new SupabaseContentRepository(
  "blog_posts",
  blogMapper,
  { column: "fecha", ascending: false },
  createPublicSupabaseClient,
);
export const publicNoticias: NoticiaRepository = new SupabaseContentRepository(
  "noticias",
  noticiaMapper,
  { column: "fecha", ascending: false },
  createPublicSupabaseClient,
);
export const publicHoteles: HotelRepository = new SupabaseContentRepository(
  "hoteles",
  hotelMapper,
  asc,
  createPublicSupabaseClient,
);

/**
 * PUBLIC WRITE repositories for the anonymous website (contact/membership forms
 * and the public CV upload). They use the anonymous client because the sender
 * is a logged-out visitor — the authenticated client would try to read a Clerk
 * token that doesn't exist and the INSERT would fail. RLS (0003/0007) allows
 * `anon` to INSERT (only) into exactly these three tables.
 */
export const publicCandidatos: CandidatoRepository =
  new SupabaseContentRepository(
    "candidatos",
    candidatoMapper,
    { column: "created_at", ascending: false },
    createPublicSupabaseClient,
  );
export const publicSolicitudes: SolicitudRepository =
  new SupabaseContentRepository(
    "solicitudes",
    solicitudMapper,
    { column: "created_at", ascending: false },
    createPublicSupabaseClient,
  );
export const publicConsultas: ConsultaRepository =
  new SupabaseContentRepository(
    "consultas",
    consultaMapper,
    { column: "created_at", ascending: false },
    createPublicSupabaseClient,
  );
