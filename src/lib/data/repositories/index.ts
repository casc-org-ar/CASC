/**
 * Repository interfaces (the "ports" in a hexagonal architecture).
 *
 * UI and pages depend on these interfaces only. Two implementations live
 * behind them: `mock` (in-memory, used now) and `supabase` (added later).
 * Swapping implementations must never require touching a component.
 */

import type {
  BaseEntity,
  BlogPost,
  Informe,
  Newsletter,
  Noticia,
  Socio,
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
  update(id: string, input: UpdateInput<T>): Promise<T>;
  remove(id: string): Promise<void>;
}

export type WebinarRepository = ContentRepository<Webinar>;
export type InformeRepository = ContentRepository<Informe>;
export type NoticiaRepository = ContentRepository<Noticia>;
export type NewsletterRepository = ContentRepository<Newsletter>;
export type BlogRepository = ContentRepository<BlogPost>;

/** Members need the same CRUD; kept as its own name for clarity/intent. */
export type SocioRepository = ContentRepository<Socio>;

/**
 * The full data layer surface. Consumers ask for this bundle and never
 * construct concrete repositories themselves.
 */
export interface DataLayer {
  webinars: WebinarRepository;
  informes: InformeRepository;
  noticias: NoticiaRepository;
  newsletters: NewsletterRepository;
  blog: BlogRepository;
  socios: SocioRepository;
}
