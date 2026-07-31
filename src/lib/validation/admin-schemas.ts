import { z } from "zod";

/**
 * Zod schemas for the admin content forms.
 *
 * Admin actions are still public HTTP endpoints (a server action can be invoked
 * directly), so even though `requireRole("admin")` gates them, the payload is
 * validated here as defense in depth — and to stop an admin's own mistake
 * (empty title, oversized text) from writing corrupt data.
 *
 * A failed `.parse()` throws; the admin forms already wrap their action in a
 * try/catch that surfaces a toast, so an invalid submit shows an error instead
 * of saving bad data.
 */

/** Length caps shared across content fields. */
const LIMITS = { titulo: 200, corto: 200, medio: 500, largo: 20000 } as const;

const status = z.enum(["borrador", "publicado"]);
const req = (max: number) => z.string().trim().min(1).max(max);
const opt = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((s) => s || undefined)
    .optional();
/** A date field (YYYY-MM-DD from the form's date input). */
const fecha = z.string().trim().min(1).max(40);
/** URL-ish fields kept as text (the app stores paths and external URLs). */
const reqUrl = req(1000); // required: never undefined
const optUrl = opt(1000); // optional: empty → undefined

export const webinarSchema = z.object({
  titulo: req(LIMITS.titulo),
  descripcion: req(LIMITS.largo),
  fecha,
  videoUrl: reqUrl,
  portadaUrl: optUrl,
  categoria: req(LIMITS.corto),
  materialAdjuntoUrl: optUrl,
  status,
});

export const informeSchema = z.object({
  titulo: req(LIMITS.titulo),
  descripcion: req(LIMITS.largo),
  categoria: req(LIMITS.corto),
  archivoUrl: reqUrl,
  portadaUrl: optUrl,
  fecha,
  status,
});

export const noticiaSchema = z.object({
  titulo: req(LIMITS.titulo),
  bajada: req(LIMITS.medio),
  cuerpo: req(LIMITS.largo),
  imagenUrl: optUrl,
  categoria: opt(LIMITS.corto),
  fecha,
  status,
});

export const newsletterSchema = z.object({
  titulo: req(LIMITS.titulo),
  edicion: req(LIMITS.corto),
  contenido: opt(LIMITS.largo),
  adjuntoUrl: optUrl,
  fecha,
  status,
});

export const blogSchema = z.object({
  titulo: req(LIMITS.titulo),
  slug: req(LIMITS.corto),
  bajada: req(LIMITS.medio),
  cuerpo: req(LIMITS.largo),
  portadaUrl: optUrl,
  imagenes: z.array(z.string().max(1000)).max(30).optional(),
  autor: req(LIMITS.corto),
  tags: z.array(z.string().trim().max(60)).max(30),
  // Audience selector. Defaults to "publico" so a payload without the field
  // (older form, direct action call) keeps the pre-unification behaviour.
  visibilidad: z.enum(["socios", "publico", "ambos"]).default("publico"),
  fecha,
  status,
});

export const hotelSchema = z.object({
  nombre: req(LIMITS.corto),
  estrellas: z.number().int().min(1).max(5).optional(),
  ciudad: req(LIMITS.corto),
  direccion: opt(LIMITS.medio),
  telefono: opt(LIMITS.corto),
  web: opt(LIMITS.corto),
  logoUrl: optUrl,
  descuento: req(LIMITS.medio),
  beneficios: z.array(z.string().trim().max(300)).max(30).optional(),
  reservas: opt(LIMITS.medio),
  nota: opt(LIMITS.medio),
  status,
});

export const socioSchema = z.object({
  nombre: req(LIMITS.corto),
  shopping: req(LIMITS.corto),
  email: z.string().trim().min(1).max(200).email(),
  cargo: opt(LIMITS.corto),
  estado: z.enum(["activo", "inactivo"]),
  role: z.enum(["admin", "socio"]),
});
