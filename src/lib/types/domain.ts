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
 * Type of associate. Decides which platform sections a member can reach:
 * Informes and Estadísticas are reserved for shopping centers. The values
 * mirror the categories CASC already uses in the public asociados directory
 * and in the membership request form, so there is ONE taxonomy system-wide.
 */
export type SocioCategoria = "shopping" | "proveedor" | "retailer";

/**
 * Display labels for each category, in the order the admin form offers them.
 * Kept beside the type so a new category cannot be added without giving it a
 * label, and so the form and the socios table always read the same wording.
 */
export const SOCIO_CATEGORIAS: ReadonlyArray<{
  value: SocioCategoria;
  label: string;
}> = [
  { value: "shopping", label: "Shopping center" },
  { value: "proveedor", label: "Proveedor de servicios" },
  { value: "retailer", label: "Retailer" },
];

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
  /**
   * @deprecated Superseded by `adjuntos` (migration 0023). Still read as a
   * fallback for webinars saved before the list existed; never written.
   */
  materialAdjuntoUrl?: string;
  /** Files published with the webinar: deck, annexed report, etc. */
  adjuntos?: ArchivoAdjunto[];
  status: PublicationStatus;
}

export interface Informe extends BaseEntity {
  titulo: string;
  descripcion: string;
  /** Free-text tag ("Estadísticas", "Investigación de mercados"). */
  categoria: string;
  archivoUrl: string; // PDF URL (Vercel Blob later)
  portadaUrl?: string; // cover image for the listing card
  fecha: string;
  /**
   * Which member categories may see this report. Chosen per report from the
   * admin panel — the section used to be reserved for shopping centers as a
   * whole, so opening one report to providers meant opening all of them.
   *
   * NOT the same as `categoria` above, which is an editorial tag: this is the
   * audience. An empty list means nobody sees it, which is how a report is
   * taken out of circulation without unpublishing it.
   */
  categorias: SocioCategoria[];
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
 * A file published alongside a piece of content (a newsletter's magazine, a
 * webinar's deck or annexed report). Carries a label because the socio has to
 * know what they are downloading, which a bare URL cannot convey.
 */
export interface ArchivoAdjunto {
  titulo: string;
  /** Uploaded file path/URL or a pasted external link. */
  url: string;
}

/** @deprecated Use {@link ArchivoAdjunto} — kept so existing imports resolve. */
export type NewsletterAdjunto = ArchivoAdjunto;

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
  /** Type of associate; drives which sections this member sees. */
  categoria: SocioCategoria;
  /**
   * The linked Clerk user, once the member accepted their invitation.
   * READ-ONLY here: it is written by the `user.created` webhook, never by the
   * admin CRUD (`toRow` does not emit it). Exposed because changing a member's
   * role has to push that role to Clerk, and this is who to push it to.
   * Undefined while the invitation is still pending.
   */
  clerkUserId?: string;
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

/**
 * Satisfaction survey answered by members.
 *
 * ONE fixed survey, not a survey engine: the questions are known, so they are
 * typed columns instead of a generic question/answer schema. That lets the
 * database validate each answer (enums + 1-5 checks) and keeps the CSV export
 * on stable columns.
 *
 * Immutable once submitted — see migration 0023, which grants members INSERT
 * and SELECT on their own row and no UPDATE at all.
 */

/** Identifier of the current survey. Bump it to run a new one (see 0023). */
export const ENCUESTA_SLUG_ACTUAL = "satisfaccion-2026";

/** 1-5 rating used by the three scale questions. */
export type EscalaRespuesta = 1 | 2 | 3 | 4 | 5;

/** "¿Participarías de próximas acciones comerciales conjuntas?" */
export type ParticipacionAcciones = "si" | "no" | "depende";

/** "¿Abrís el portal desde el celular o desktop?" */
export type DispositivoPrincipal = "celular" | "desktop";

/**
 * Labels for the closed-choice questions whose answers are ENUM COLUMNS, so
 * their options cannot be edited — adding one would need a migration. The
 * editable lists (topics, channels) live in `EncuestaTextos` instead, because
 * their columns are `text[]` and take whatever CASC offers.
 */
export const PARTICIPACION_LABEL: Record<ParticipacionAcciones, string> = {
  si: "Sí",
  no: "No",
  depende: "Depende",
};

export const DISPOSITIVO_LABEL: Record<DispositivoPrincipal, string> = {
  celular: "Celular",
  desktop: "Desktop",
};

/**
 * The editable wording of the survey.
 *
 * The nine questions and their types are FIXED — they are typed columns on
 * `encuesta_respuestas`. What CASC edits from the panel is how each one reads
 * and which options the choice questions offer. Adding or removing a question
 * is a different thing (a survey engine) and deliberately out of scope: there
 * would be nowhere to store its answers.
 *
 * Stored as one document per survey (migration 0026), and copied onto each
 * answer as it is submitted — see `EncuestaRespuesta.textos`.
 */
export interface EncuestaTextos {
  /** Page heading and the line under it. */
  titulo: string;
  subtitulo: string;
  /** The home banner that invites members to answer. */
  ctaTitulo: string;
  ctaDescripcion: string;

  // Eje 1 — Satisfacción general
  satisfaccionServicios: string;
  satisfaccionMin: string;
  satisfaccionMax: string;
  utilidadComunicacion: string;
  utilidadMin: string;
  utilidadMax: string;
  queMejorarias: string;

  // Eje 2 — Prioridades y participación
  temasPrioritarios: string;
  /** Offered topics. The form always adds a free-text "Otro" beside them. */
  temasOpciones: string[];
  participacionAcciones: string;
  canalesPreferidos: string;
  /** Offered channels. */
  canalesOpciones: string[];

  // Eje 3 — Portal
  facilidadPortal: string;
  facilidadMin: string;
  facilidadMax: string;
  funcionalidadSugerida: string;
  dispositivoPrincipal: string;
}

/**
 * The survey as it was originally worded.
 *
 * Two jobs: it seeds `encuesta_textos` on first edit, and it stands in for
 * answers stored before the texts became editable — those carry no snapshot,
 * and this is the wording their authors actually read. Changing these strings
 * would therefore rewrite history; edit from the admin panel instead.
 */
export const ENCUESTA_TEXTOS_ORIGINALES: EncuestaTextos = {
  titulo: "Encuesta a socios",
  subtitulo:
    "Tres minutos para ayudarnos a mejorar los servicios de la Cámara. Tus respuestas llegan directo al equipo de la CASC.",
  ctaTitulo: "Queremos escucharte",
  ctaDescripcion:
    "Respondé la encuesta a socios y ayudanos a mejorar los servicios de la Cámara. Son 3 minutos y se completa una sola vez.",

  satisfaccionServicios:
    "¿Qué tan satisfecho/a estás con los servicios de la CASC?",
  satisfaccionMin: "Nada satisfecho/a",
  satisfaccionMax: "Muy satisfecho/a",
  utilidadComunicacion:
    "¿Qué tan útil te resulta la información/comunicación que recibís de la Cámara?",
  utilidadMin: "Nada útil",
  utilidadMax: "Muy útil",
  queMejorarias: "¿Qué mejorarías?",

  temasPrioritarios: "¿Qué temas te gustaría que la CASC priorice este año?",
  temasOpciones: [
    "Legal/SADAIC",
    "Marketing conjunto",
    "Capacitaciones",
    "Networking",
  ],
  participacionAcciones:
    "¿Participarías de próximas acciones comerciales conjuntas?",
  canalesPreferidos: "¿Cómo preferís recibir novedades de la Cámara?",
  canalesOpciones: ["Email", "WhatsApp", "Portal", "Redes"],

  facilidadPortal: "¿Qué tan fácil es encontrar lo que buscás en el portal?",
  facilidadMin: "Muy difícil",
  facilidadMax: "Muy fácil",
  funcionalidadSugerida: "¿Qué funcionalidad te gustaría que se agregue?",
  dispositivoPrincipal:
    "¿Abrís el portal desde el celular o desktop, principalmente?",
};

export interface EncuestaRespuesta extends BaseEntity {
  /**
   * The `socios` row that answered — not the Clerk id (see migration 0024).
   * Undefined only on test answers (`esPrueba`), which come from an admin
   * account and therefore from no member row at all.
   */
  socioId?: string;
  /**
   * Sent from an admin account to try the form out, not a real answer.
   * Kept apart from the real ones everywhere it matters: the panel's averages
   * and distributions ignore them, and the CSV marks them.
   *
   * An explicit flag rather than inferring it from a missing `socioId`: that
   * would be reading a coincidence as a statement, and any future reason for
   * a member-less answer would start hiding real data.
   */
  esPrueba: boolean;
  /** Which survey this answers. Defaults to `ENCUESTA_SLUG_ACTUAL`. */
  encuestaSlug: string;
  /**
   * The wording this member actually read, copied in as they submitted.
   *
   * CASC can reword a question after people have answered it. Without this,
   * an old answer would be shown — and exported — under a question its author
   * never saw, which is putting words in their mouth. The snapshot keeps every
   * answer readable against the text it was given.
   *
   * Undefined on answers stored before the texts became editable (migration
   * 0026); those correspond to `ENCUESTA_TEXTOS_ORIGINALES`.
   */
  textos?: EncuestaTextos;

  // Eje 1 — Satisfacción general
  satisfaccionServicios: EscalaRespuesta;
  utilidadComunicacion: EscalaRespuesta;
  /** Open question, optional by design. */
  queMejorarias?: string;

  // Eje 2 — Prioridades y participación
  /** Values from the survey's `temasOpciones`, plus any free-text "Otro". */
  temasPrioritarios: string[];
  participacionAcciones: ParticipacionAcciones;
  /** Values from the survey's `canalesOpciones`; more than one is allowed. */
  canalesPreferidos: string[];

  // Eje 3 — Portal
  facilidadPortal: EscalaRespuesta;
  /** Open question, optional by design. */
  funcionalidadSugerida?: string;
  dispositivoPrincipal: DispositivoPrincipal;
}

/** The shape of the currently authenticated user. */
export interface CurrentUser {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
  shopping?: string;
  /**
   * Type of associate, for members only. Undefined for admins (who have no
   * socios row) and while the member's row is not linked to their Clerk user
   * yet. Section visibility treats "undefined" as the most restrictive case,
   * never as a free pass — see `getNavForUser`.
   */
  categoria?: SocioCategoria;
}
