/**
 * Domain models for the CASC platform.
 *
 * Every persisted entity carries `id`, `createdAt`, `updatedAt`. Content
 * entities also carry a publication `status`. These types are the contract
 * that both the mock repositories (now) and the Supabase repositories
 * (later) must satisfy — UI code depends on these, never on an
 * implementation.
 */

/** Publication state for any content entity. */
export type PublicationStatus = "borrador" | "publicado";

/** Roles resolved by the auth layer. */
export type UserRole = "admin" | "socio";

/** Active/inactive state for member accounts (membership eje). */
export type MemberState = "activo" | "inactivo";

/**
 * Onboarding state of a member's account invitation (registration eje).
 * Independent from `MemberState`: a member can be an active membership while
 * their invitation is still pending. Driven by the invitation flow (Clerk
 * later): "pendiente" before an invite is sent, "enviada" once the link goes
 * out, "aceptada" once the member completes registration.
 */
export type InvitationStatus = "pendiente" | "enviada" | "aceptada";

/** Fields shared by every stored entity. */
export interface BaseEntity {
  id: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface Webinar extends BaseEntity {
  titulo: string;
  descripcion: string;
  fecha: string; // ISO date of the webinar
  videoUrl: string; // YouTube/Vimeo embed URL — never a stored file
  portadaUrl?: string; // cover image for the listing card
  categoria: string;
  materialAdjuntoUrl?: string;
  status: PublicationStatus;
}

export interface Informe extends BaseEntity {
  titulo: string;
  descripcion: string;
  categoria: string;
  archivoUrl: string; // PDF URL (Vercel Blob later)
  portadaUrl?: string; // cover image for the listing card
  fecha: string;
  status: PublicationStatus;
}

export interface Noticia extends BaseEntity {
  titulo: string;
  bajada: string;
  cuerpo: string;
  imagenUrl?: string;
  categoria?: string; // optional free-text tag; powers the socio-side filter
  fecha: string;
  status: PublicationStatus;
}

export interface Newsletter extends BaseEntity {
  titulo: string;
  edicion: string;
  /** Optional short summary shown on the card; the sent edition lives in the file. */
  contenido?: string;
  fecha: string;
  adjuntoUrl?: string; // uploaded file of the edition already sent (Vercel Blob later)
  status: PublicationStatus;
}

export interface BlogPost extends BaseEntity {
  titulo: string;
  slug: string; // URL-friendly identifier for the future public site
  bajada: string;
  cuerpo: string; // rich body (markdown/plain for now)
  portadaUrl?: string; // cover image
  imagenes?: string[]; // gallery images shown in the article body
  autor: string;
  tags: string[];
  fecha: string;
  status: PublicationStatus;
}

export interface Socio extends BaseEntity {
  nombre: string;
  shopping: string; // name of the shopping center
  email: string;
  cargo?: string;
  estado: MemberState;
  role: UserRole;
  /** Registration onboarding state (see InvitationStatus). Defaults to "pendiente". */
  invitacionStatus: InvitationStatus;
  /** ISO timestamp of the last invitation send; undefined until first sent. */
  invitacionEnviadaAt?: string;
}

/** The shape of the currently authenticated user. */
export interface CurrentUser {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
  shopping?: string;
}
