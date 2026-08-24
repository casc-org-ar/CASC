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

/**
 * Where an editorial article is shown. Unifies blog + noticias into one entity:
 * "socios" only in the members panel, "publico" only on the public site,
 * "ambos" in both.
 */
export type Visibilidad = "socios" | "publico" | "ambos";

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

/**
 * A CASC activity / event (capacitación, congreso, foro, webinar público).
 * Shown on the public home carousel and the /actividades section, each with
 * its own detail page addressed by `slug`. Admin-managed like any content.
 */
export interface Actividad extends BaseEntity {
  titulo: string;
  slug: string; // URL-friendly id for /actividades/[slug]
  descripcion: string;
  imagen?: string; // cover image for the card
  cuerpo?: string; // extended write-up for the detail page
  fecha?: string; // display date, optional until confirmed
  /**
   * Real event date (ISO `YYYY-MM-DD`), used for ordering. `fecha` above is
   * free text the admin writes for display ("Del 8 al 10 de mayo"), so it
   * cannot be sorted; this is the sortable counterpart. Optional: an activity
   * without a confirmed date falls back to publication order.
   */
  fechaEvento?: string;
  lugar?: string; // venue or format ("Auditorio…", "Online")
  inscripcionUrl?: string; // external registration/info link
  /** Audience: members panel, public site, or both. Defaults to "ambos". */
  visibilidad: Visibilidad;
  status: PublicationStatus;
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

/**
 * An extra file shipped alongside a newsletter edition (the magazine, an
 * annexed report). Carries a label because the socio has to know what they are
 * downloading, which a bare URL cannot convey.
 */
export interface NewsletterAdjunto {
  titulo: string;
  /** Uploaded file path/URL or a pasted external link. */
  url: string;
}

export interface Newsletter extends BaseEntity {
  titulo: string;
  edicion: string;
  /** Optional short summary shown on the card; the sent edition lives in the file. */
  contenido?: string;
  fecha: string;
  adjuntoUrl?: string; // uploaded file of the edition already sent (Vercel Blob later)
  /** Extra files published with the edition, beyond the edition itself. */
  adjuntos?: NewsletterAdjunto[];
  status: PublicationStatus;
}

export interface BlogPost extends BaseEntity {
  titulo: string;
  slug: string; // URL-friendly identifier for the future public site
  bajada: string;
  cuerpo: string; // rich body (markdown/plain for now)
  portadaUrl?: string; // cover image
  imagenes?: string[]; // gallery images shown in the article body
  /** Optional embedded video (YouTube/Vimeo) shown in the article detail. */
  videoUrl?: string;
  autor: string;
  tags: string[];
  /** Audience: members panel, public site, or both. Defaults to "publico". */
  visibilidad: Visibilidad;
  /**
   * Promoted to the socio panel's highlights. Editor-chosen, and several
   * articles can carry it at once — the panel used to highlight whatever was
   * newest, which nobody selected and allowed only one.
   */
  destacado: boolean;
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

/**
 * A hotel offering a discount to CASC members. Shown in the members-only
 * benefits section and managed from the admin panel like any other content.
 */
export interface Hotel extends BaseEntity {
  nombre: string;
  /** Star rating, e.g. 4 or 5. */
  estrellas?: number;
  ciudad: string;
  direccion?: string;
  telefono?: string;
  web?: string;
  logoUrl?: string;
  /** The discount headline, e.g. "10% sobre tarifa pública". */
  descuento: string;
  /** Extra perks beyond the headline discount (breakfast, upgrades, etc.). */
  beneficios?: string[];
  /** How to book: free-text with email/phone/contact and any client code. */
  reservas?: string;
  /** Reminder shown to members, e.g. to mention they are a CASC associate. */
  nota?: string;
  status: PublicationStatus;
}

/** Availability a candidate offers. */
export type Disponibilidad = "full-time" | "part-time" | "ambas";

/**
 * A job-seeker who submitted their CV through the public Bolsa de Trabajo
 * landing. Recruiters (shopping centers) browse published candidates from the
 * platform; admins moderate them. `status` is used as a moderation gate:
 * "borrador" = pending review, "publicado" = visible to recruiters.
 *
 * Personal data (email, telefono, cvUrl) is only ever read inside the
 * authenticated platform — the public site writes candidates but never lists
 * them. `consentimiento` records the explicit data-storage consent (ley 25.326).
 */
export interface Candidato extends BaseEntity {
  // Datos básicos
  nombre: string;
  email: string;
  telefono?: string;
  // Perfil profesional
  puestoBuscado: string;
  /** Area of interest — one of the taxonomy values; powers a filter. */
  areaInteres: string;
  /** Skill tags — the key filter recruiters use. */
  skills: string[];
  aniosExperiencia?: number;
  nivelEducativo?: string;
  disponibilidad?: Disponibilidad;
  // Ubicación
  ciudad?: string;
  provincia?: string;
  // CV (mock upload for now; a stored URL/reference)
  cvUrl: string;
  /** Original CV filename, sanitized. Shown to recruiters on download. */
  cvNombre?: string;
  // Legal
  consentimiento: boolean;
  // Moderación
  status: PublicationStatus;
}

/**
 * How a public enquiry has been handled by the CASC team. Mirrors the
 * moderation idea of `PublicationStatus` but for inbound messages.
 */
export type GestionStatus = "nueva" | "en-proceso" | "resuelta";

/** Sector a membership applicant belongs to (matches the public form). */
export type SectorSolicitud =
  | "Shopping center"
  | "Proveedor de servicio"
  | "Retailer";

/**
 * A membership request submitted from the public "Cómo asociarse" form.
 * Written by the public site, read and managed only from the admin panel.
 */
export interface SolicitudAsociacion extends BaseEntity {
  sector: SectorSolicitud;
  empresa: string;
  contacto: string;
  cargo?: string;
  telefono?: string;
  email: string;
  mensaje?: string;
  /** Handling state for the CASC team. */
  gestion: GestionStatus;
}

/**
 * A general enquiry submitted from the public contact form. Same lifecycle as
 * a membership request, but without company/sector data.
 */
export interface ConsultaContacto extends BaseEntity {
  nombre: string;
  empresa?: string;
  email: string;
  mensaje: string;
  gestion: GestionStatus;
}

/** The shape of the currently authenticated user. */
export interface CurrentUser {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
  shopping?: string;
}
