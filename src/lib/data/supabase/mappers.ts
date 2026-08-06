import type {
  Actividad,
  BaseEntity,
  BlogPost,
  Candidato,
  ConsultaContacto,
  Hotel,
  Informe,
  Newsletter,
  Noticia,
  Socio,
  SolicitudAsociacion,
  Webinar,
} from "@/lib/types/domain";
import type { CreateInput, UpdateInput } from "@/lib/data/repositories";

/**
 * Row ↔ domain mappers for the Supabase DataLayer.
 *
 * Postgres columns are snake_case; the domain types are camelCase. These
 * mappers translate BOTH directions, EXPLICITLY, field by field. Explicit (not
 * a generic camel↔snake transform) on purpose: a mismapped field is a silent
 * data-loss bug (the write "succeeds" but drops the value), and the explicit
 * form both prevents that and documents the exact column contract.
 *
 * Contract per entity:
 *  - `fromRow`: a full DB row (snake_case) → domain entity (camelCase).
 *  - `toRow`:   a create/update payload (camelCase) → columns to write
 *               (snake_case). For updates the payload is partial, so `toRow`
 *               only emits keys that are present — never overwrites a column
 *               with undefined.
 *
 * `id`, `created_at`, `updated_at` are owned by the DB (defaults + trigger) and
 * are never written by `toRow`; they are read back by `fromRow`.
 */

/** A raw Supabase row: unknown-keyed until narrowed by each fromRow. */
type Row = Record<string, unknown>;

export interface EntityMapper<T extends BaseEntity> {
  fromRow(row: Row): T;
  toRow(input: CreateInput<T> | UpdateInput<T>): Row;
}

/** Helper: copy `value` under `key` only when it is defined. */
function put(target: Row, key: string, value: unknown): void {
  if (value !== undefined) target[key] = value;
}

// ---------------------------------------------------------------------------
// Actividad
// ---------------------------------------------------------------------------
export const actividadMapper: EntityMapper<Actividad> = {
  fromRow: (r) => ({
    id: r.id as string,
    titulo: r.titulo as string,
    slug: r.slug as string,
    descripcion: r.descripcion as string,
    imagen: (r.imagen as string | null) ?? undefined,
    cuerpo: (r.cuerpo as string | null) ?? undefined,
    fecha: (r.fecha as string | null) ?? undefined,
    lugar: (r.lugar as string | null) ?? undefined,
    inscripcionUrl: (r.inscripcion_url as string | null) ?? undefined,
    visibilidad: (r.visibilidad as Actividad["visibilidad"] | null) ?? "ambos",
    status: r.status as Actividad["status"],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }),
  toRow: (i) => {
    const row: Row = {};
    put(row, "titulo", i.titulo);
    put(row, "slug", i.slug);
    put(row, "descripcion", i.descripcion);
    put(row, "imagen", i.imagen);
    put(row, "cuerpo", i.cuerpo);
    put(row, "fecha", i.fecha);
    put(row, "lugar", i.lugar);
    put(row, "inscripcion_url", i.inscripcionUrl);
    put(row, "visibilidad", i.visibilidad);
    put(row, "status", i.status);
    return row;
  },
};

// ---------------------------------------------------------------------------
// Webinar
// ---------------------------------------------------------------------------
export const webinarMapper: EntityMapper<Webinar> = {
  fromRow: (r) => ({
    id: r.id as string,
    titulo: r.titulo as string,
    descripcion: r.descripcion as string,
    fecha: r.fecha as string,
    videoUrl: r.video_url as string,
    portadaUrl: (r.portada_url as string | null) ?? undefined,
    categoria: r.categoria as string,
    materialAdjuntoUrl: (r.material_adjunto_url as string | null) ?? undefined,
    status: r.status as Webinar["status"],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }),
  toRow: (i) => {
    const row: Row = {};
    put(row, "titulo", i.titulo);
    put(row, "descripcion", i.descripcion);
    put(row, "fecha", i.fecha);
    put(row, "video_url", i.videoUrl);
    put(row, "portada_url", i.portadaUrl);
    put(row, "categoria", i.categoria);
    put(row, "material_adjunto_url", i.materialAdjuntoUrl);
    put(row, "status", i.status);
    return row;
  },
};

// ---------------------------------------------------------------------------
// Informe
// ---------------------------------------------------------------------------
export const informeMapper: EntityMapper<Informe> = {
  fromRow: (r) => ({
    id: r.id as string,
    titulo: r.titulo as string,
    descripcion: r.descripcion as string,
    categoria: r.categoria as string,
    archivoUrl: r.archivo_url as string,
    portadaUrl: (r.portada_url as string | null) ?? undefined,
    fecha: r.fecha as string,
    status: r.status as Informe["status"],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }),
  toRow: (i) => {
    const row: Row = {};
    put(row, "titulo", i.titulo);
    put(row, "descripcion", i.descripcion);
    put(row, "categoria", i.categoria);
    put(row, "archivo_url", i.archivoUrl);
    put(row, "portada_url", i.portadaUrl);
    put(row, "fecha", i.fecha);
    put(row, "status", i.status);
    return row;
  },
};

// ---------------------------------------------------------------------------
// Noticia
// ---------------------------------------------------------------------------
export const noticiaMapper: EntityMapper<Noticia> = {
  fromRow: (r) => ({
    id: r.id as string,
    titulo: r.titulo as string,
    bajada: r.bajada as string,
    cuerpo: r.cuerpo as string,
    imagenUrl: (r.imagen_url as string | null) ?? undefined,
    categoria: (r.categoria as string | null) ?? undefined,
    fecha: r.fecha as string,
    status: r.status as Noticia["status"],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }),
  toRow: (i) => {
    const row: Row = {};
    put(row, "titulo", i.titulo);
    put(row, "bajada", i.bajada);
    put(row, "cuerpo", i.cuerpo);
    put(row, "imagen_url", i.imagenUrl);
    put(row, "categoria", i.categoria);
    put(row, "fecha", i.fecha);
    put(row, "status", i.status);
    return row;
  },
};

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------
export const newsletterMapper: EntityMapper<Newsletter> = {
  fromRow: (r) => ({
    id: r.id as string,
    titulo: r.titulo as string,
    edicion: r.edicion as string,
    contenido: (r.contenido as string | null) ?? undefined,
    fecha: r.fecha as string,
    adjuntoUrl: (r.adjunto_url as string | null) ?? undefined,
    status: r.status as Newsletter["status"],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }),
  toRow: (i) => {
    const row: Row = {};
    put(row, "titulo", i.titulo);
    put(row, "edicion", i.edicion);
    put(row, "contenido", i.contenido);
    put(row, "fecha", i.fecha);
    put(row, "adjunto_url", i.adjuntoUrl);
    put(row, "status", i.status);
    return row;
  },
};

// ---------------------------------------------------------------------------
// BlogPost (text[] arrays: imagenes, tags)
// ---------------------------------------------------------------------------
export const blogMapper: EntityMapper<BlogPost> = {
  fromRow: (r) => ({
    id: r.id as string,
    titulo: r.titulo as string,
    slug: r.slug as string,
    bajada: r.bajada as string,
    cuerpo: r.cuerpo as string,
    portadaUrl: (r.portada_url as string | null) ?? undefined,
    imagenes: (r.imagenes as string[] | null) ?? undefined,
    videoUrl: (r.video_url as string | null) ?? undefined,
    autor: r.autor as string,
    tags: (r.tags as string[] | null) ?? [],
    visibilidad: (r.visibilidad as BlogPost["visibilidad"] | null) ?? "publico",
    fecha: r.fecha as string,
    status: r.status as BlogPost["status"],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }),
  toRow: (i) => {
    const row: Row = {};
    put(row, "titulo", i.titulo);
    put(row, "slug", i.slug);
    put(row, "bajada", i.bajada);
    put(row, "cuerpo", i.cuerpo);
    put(row, "portada_url", i.portadaUrl);
    put(row, "imagenes", i.imagenes);
    put(row, "video_url", i.videoUrl);
    put(row, "autor", i.autor);
    put(row, "tags", i.tags);
    put(row, "visibilidad", i.visibilidad);
    put(row, "fecha", i.fecha);
    put(row, "status", i.status);
    return row;
  },
};

// ---------------------------------------------------------------------------
// Hotel (text[] array: beneficios; numeric: estrellas)
// ---------------------------------------------------------------------------
export const hotelMapper: EntityMapper<Hotel> = {
  fromRow: (r) => ({
    id: r.id as string,
    nombre: r.nombre as string,
    estrellas: (r.estrellas as number | null) ?? undefined,
    ciudad: r.ciudad as string,
    direccion: (r.direccion as string | null) ?? undefined,
    telefono: (r.telefono as string | null) ?? undefined,
    web: (r.web as string | null) ?? undefined,
    logoUrl: (r.logo_url as string | null) ?? undefined,
    descuento: r.descuento as string,
    beneficios: (r.beneficios as string[] | null) ?? undefined,
    reservas: (r.reservas as string | null) ?? undefined,
    nota: (r.nota as string | null) ?? undefined,
    status: r.status as Hotel["status"],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }),
  toRow: (i) => {
    const row: Row = {};
    put(row, "nombre", i.nombre);
    put(row, "estrellas", i.estrellas);
    put(row, "ciudad", i.ciudad);
    put(row, "direccion", i.direccion);
    put(row, "telefono", i.telefono);
    put(row, "web", i.web);
    put(row, "logo_url", i.logoUrl);
    put(row, "descuento", i.descuento);
    put(row, "beneficios", i.beneficios);
    put(row, "reservas", i.reservas);
    put(row, "nota", i.nota);
    put(row, "status", i.status);
    return row;
  },
};

// ---------------------------------------------------------------------------
// Socio
//
// `clerk_user_id` is deliberately NOT handled here: the domain `Socio` type
// doesn't expose it, and it's set by the invitation.accepted webhook (with
// service_role), never by the admin CRUD. `fromRow` ignores the column;
// `toRow` never writes it.
// ---------------------------------------------------------------------------
export const socioMapper: EntityMapper<Socio> = {
  fromRow: (r) => ({
    id: r.id as string,
    nombre: r.nombre as string,
    shopping: r.shopping as string,
    email: r.email as string,
    cargo: (r.cargo as string | null) ?? undefined,
    estado: r.estado as Socio["estado"],
    role: r.role as Socio["role"],
    invitacionStatus: r.invitacion_status as Socio["invitacionStatus"],
    invitacionEnviadaAt:
      (r.invitacion_enviada_at as string | null) ?? undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }),
  toRow: (i) => {
    const row: Row = {};
    put(row, "nombre", i.nombre);
    put(row, "shopping", i.shopping);
    put(row, "email", i.email);
    put(row, "cargo", i.cargo);
    put(row, "estado", i.estado);
    put(row, "role", i.role);
    put(row, "invitacion_status", i.invitacionStatus);
    put(row, "invitacion_enviada_at", i.invitacionEnviadaAt);
    return row;
  },
};

// ---------------------------------------------------------------------------
// Candidato (sensitive personal data; text[] skills; mandatory consentimiento)
// ---------------------------------------------------------------------------
export const candidatoMapper: EntityMapper<Candidato> = {
  fromRow: (r) => ({
    id: r.id as string,
    nombre: r.nombre as string,
    email: r.email as string,
    telefono: (r.telefono as string | null) ?? undefined,
    puestoBuscado: r.puesto_buscado as string,
    areaInteres: r.area_interes as string,
    skills: (r.skills as string[] | null) ?? [],
    aniosExperiencia: (r.anios_experiencia as number | null) ?? undefined,
    nivelEducativo: (r.nivel_educativo as string | null) ?? undefined,
    disponibilidad:
      (r.disponibilidad as Candidato["disponibilidad"] | null) ?? undefined,
    ciudad: (r.ciudad as string | null) ?? undefined,
    provincia: (r.provincia as string | null) ?? undefined,
    cvUrl: r.cv_url as string,
    cvNombre: (r.cv_nombre as string | null) ?? undefined,
    consentimiento: r.consentimiento as boolean,
    status: r.status as Candidato["status"],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }),
  toRow: (i) => {
    const row: Row = {};
    put(row, "nombre", i.nombre);
    put(row, "email", i.email);
    put(row, "telefono", i.telefono);
    put(row, "puesto_buscado", i.puestoBuscado);
    put(row, "area_interes", i.areaInteres);
    put(row, "skills", i.skills);
    put(row, "anios_experiencia", i.aniosExperiencia);
    put(row, "nivel_educativo", i.nivelEducativo);
    put(row, "disponibilidad", i.disponibilidad);
    put(row, "ciudad", i.ciudad);
    put(row, "provincia", i.provincia);
    put(row, "cv_url", i.cvUrl);
    put(row, "cv_nombre", i.cvNombre);
    put(row, "consentimiento", i.consentimiento);
    put(row, "status", i.status);
    return row;
  },
};

// ---------------------------------------------------------------------------
// SolicitudAsociación (uses `gestion`, not `status`)
// ---------------------------------------------------------------------------
export const solicitudMapper: EntityMapper<SolicitudAsociacion> = {
  fromRow: (r) => ({
    id: r.id as string,
    sector: r.sector as SolicitudAsociacion["sector"],
    empresa: r.empresa as string,
    contacto: r.contacto as string,
    cargo: (r.cargo as string | null) ?? undefined,
    telefono: (r.telefono as string | null) ?? undefined,
    email: r.email as string,
    mensaje: (r.mensaje as string | null) ?? undefined,
    gestion: r.gestion as SolicitudAsociacion["gestion"],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }),
  toRow: (i) => {
    const row: Row = {};
    put(row, "sector", i.sector);
    put(row, "empresa", i.empresa);
    put(row, "contacto", i.contacto);
    put(row, "cargo", i.cargo);
    put(row, "telefono", i.telefono);
    put(row, "email", i.email);
    put(row, "mensaje", i.mensaje);
    put(row, "gestion", i.gestion);
    return row;
  },
};

// ---------------------------------------------------------------------------
// ConsultaContacto (uses `gestion`, not `status`)
// ---------------------------------------------------------------------------
export const consultaMapper: EntityMapper<ConsultaContacto> = {
  fromRow: (r) => ({
    id: r.id as string,
    nombre: r.nombre as string,
    empresa: (r.empresa as string | null) ?? undefined,
    email: r.email as string,
    mensaje: r.mensaje as string,
    gestion: r.gestion as ConsultaContacto["gestion"],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }),
  toRow: (i) => {
    const row: Row = {};
    put(row, "nombre", i.nombre);
    put(row, "empresa", i.empresa);
    put(row, "email", i.email);
    put(row, "mensaje", i.mensaje);
    put(row, "gestion", i.gestion);
    return row;
  },
};
