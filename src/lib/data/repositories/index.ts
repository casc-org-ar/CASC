/**
 * Repository interfaces (the "ports" in a hexagonal architecture).
 *
 * UI and pages depend on these interfaces only. Two implementations live
 * behind them: `mock` (in-memory, used now) and `supabase` (added later).
 * Swapping implementations must never require touching a component.
 */

import type {
  Actividad,
  BaseEntity,
  BlogPost,
  Candidato,
  ConsultaContacto,
  EncuestaRespuesta,
  EncuestaTextos,
  Hotel,
  Informe,
  Newsletter,
  Noticia,
  Socio,
  SolicitudAsociacion,
  Webinar,
} from "@/lib/types/domain";

/**
 * Payload accepted when creating an entity: everything except the fields
 * the repository owns (`id`, `createdAt`, `updatedAt`).
 */
export type CreateInput<T extends BaseEntity> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
>;

/** Partial payload for updates. */
export type UpdateInput<T extends BaseEntity> = Partial<CreateInput<T>>;

/**
 * Generic CRUD contract shared by every content entity. Content entities
 * (webinars, informes, noticias, newsletters) all behave identically, so
 * they share one interface parameterized by the entity type.
 */
export interface ContentRepository<T extends BaseEntity> {
  list(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(input: CreateInput<T>): Promise<T>;
  /**
   * Insert without returning the created row. Needed for public/anonymous
   * writes (contact & membership forms, CV upload): those callers have INSERT
   * permission but no SELECT policy, so a returning insert would fail RLS on
   * the read-back. They don't need the row, so they use this.
   */
  createNoReturn(input: CreateInput<T>): Promise<void>;
  update(id: string, input: UpdateInput<T>): Promise<T>;
  remove(id: string): Promise<void>;
}

export type ActividadRepository = ContentRepository<Actividad>;
export type WebinarRepository = ContentRepository<Webinar>;
export type InformeRepository = ContentRepository<Informe>;
export type NoticiaRepository = ContentRepository<Noticia>;
export type NewsletterRepository = ContentRepository<Newsletter>;
export type BlogRepository = ContentRepository<BlogPost>;
export type HotelRepository = ContentRepository<Hotel>;
export type CandidatoRepository = ContentRepository<Candidato>;
export type SolicitudRepository = ContentRepository<SolicitudAsociacion>;
export type ConsultaRepository = ContentRepository<ConsultaContacto>;

/** Members need the same CRUD; kept as its own name for clarity/intent. */
export type SocioRepository = ContentRepository<Socio>;

/**
 * Survey answers. The full CRUD surface is exposed because the port is shared,
 * but who may call what is decided by RLS (migration 0023): a member can only
 * `create` their own row and `list` it back, never update or delete it. The
 * admin panel reads every row to export them.
 */
export type EncuestaRepository = ContentRepository<EncuestaRespuesta>;

/**
 * The survey's editable wording.
 *
 * Its own port, not a `ContentRepository`: there is at most ONE row per survey
 * and it is addressed by slug, not by a generated id. Forcing it into the CRUD
 * contract would mean exposing `create`/`remove`/`getById` that nothing can
 * sensibly call — and an id-shaped API invites a second row per survey, which
 * is exactly the state the primary key forbids.
 *
 * `get` returns null when CASC has never edited the wording; callers fall back
 * to `ENCUESTA_TEXTOS_ORIGINALES`. `save` is an upsert for the same reason:
 * the first edit creates the row, later ones replace it.
 */
export interface EncuestaTextosRepository {
  get(slug: string): Promise<EncuestaTextos | null>;
  save(
    slug: string,
    textos: EncuestaTextos,
    editadoPor?: string,
  ): Promise<void>;
}

/**
 * The full data layer surface. Consumers ask for this bundle and never
 * construct concrete repositories themselves.
 */
export interface DataLayer {
  actividades: ActividadRepository;
  webinars: WebinarRepository;
  informes: InformeRepository;
  noticias: NoticiaRepository;
  newsletters: NewsletterRepository;
  blog: BlogRepository;
  hoteles: HotelRepository;
  candidatos: CandidatoRepository;
  solicitudes: SolicitudRepository;
  consultas: ConsultaRepository;
  socios: SocioRepository;
  encuesta: EncuestaRepository;
  encuestaTextos: EncuestaTextosRepository;
}
