"use server";

import { z } from "zod";
import { getPublicWriteDataLayer } from "@/lib/data";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { securityLog } from "@/lib/security/security-log";

/**
 * Public server actions for the site's inbound forms (membership requests and
 * contact enquiries).
 *
 * These are PUBLIC endpoints: anyone can call them (server actions are public
 * HTTP endpoints), so every field is validated with a schema at the boundary
 * before anything is written. They only ever WRITE — nothing on the public site
 * reads these back. The CASC team manages them from the admin panel.
 *
 * Validation uses Zod: length caps stop unbounded payloads, `.email()` rejects
 * malformed addresses, and `.trim()` normalizes. Unknown/extra fields are
 * ignored (not merged into the record), and a failed parse returns a friendly
 * message instead of throwing.
 */

export interface FormState {
  ok: boolean;
  error?: string;
  /**
   * The raw values the user submitted, echoed back on failure so the form can
   * re-populate its fields instead of clearing them (better UX on error).
   * Undefined on success or first render.
   */
  values?: Record<string, string>;
}

/** Read the given fields from FormData as raw strings, for echoing back. */
function rawValues(formData: FormData, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of keys) out[key] = String(formData.get(key) ?? "");
  return out;
}

/** Field length caps — a hostile caller can't store unbounded text. */
const MAX = { corto: 120, medio: 200, largo: 2000 } as const;

/** Optional free-text field: trimmed, capped, empty becomes undefined. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((s) => s || undefined)
    .optional();

const emailField = z.string().trim().min(1).max(MAX.medio).email();

const solicitudSchema = z.object({
  sector: z.enum(["Shopping center", "Proveedor de servicio", "Retailer"]),
  empresa: z.string().trim().min(1).max(MAX.medio),
  contacto: z.string().trim().min(1).max(MAX.medio),
  email: emailField,
  cargo: optionalText(MAX.medio),
  telefono: optionalText(MAX.corto),
  mensaje: optionalText(MAX.largo),
});

const consultaSchema = z.object({
  nombre: z.string().trim().min(1).max(MAX.medio),
  email: emailField,
  empresa: optionalText(MAX.medio),
  mensaje: z.string().trim().min(1).max(MAX.largo),
});

/** Pull the schema's fields out of FormData into a plain object for parsing. */
function fromForm(formData: FormData, keys: string[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const key of keys) obj[key] = formData.get(key) ?? "";
  return obj;
}

/** Membership request from /como-asociarse. */
const SOLICITUD_FIELDS = [
  "sector",
  "empresa",
  "contacto",
  "email",
  "cargo",
  "telefono",
  "mensaje",
];

export async function enviarSolicitudAsociacion(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Captured up front so every failure path can echo the user's input back.
  const values = rawValues(formData, SOLICITUD_FIELDS);

  if (!(await checkRateLimit("form"))) {
    return { ok: false, error: "Demasiados envíos. Esperá unos minutos.", values };
  }

  const parsed = solicitudSchema.safeParse(fromForm(formData, SOLICITUD_FIELDS));
  if (!parsed.success) {
    return { ok: false, error: "Revisá los campos e intentá de nuevo.", values };
  }

  try {
    await getPublicWriteDataLayer().solicitudes.createNoReturn({
      ...parsed.data,
      gestion: "nueva",
    });
    return { ok: true };
  } catch (err) {
    // Log the real cause to the server (never to the user); no personal data.
    securityLog("write.failed", {
      entity: "solicitudes",
      message: err instanceof Error ? err.message : "unknown",
    });
    return {
      ok: false,
      error: "No pudimos enviar tu solicitud. Intentá de nuevo.",
      values,
    };
  }
}

/** General enquiry from /contacto. */
const CONSULTA_FIELDS = ["nombre", "email", "empresa", "mensaje"];

export async function enviarConsultaContacto(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = rawValues(formData, CONSULTA_FIELDS);

  if (!(await checkRateLimit("form"))) {
    return { ok: false, error: "Demasiados envíos. Esperá unos minutos.", values };
  }

  const parsed = consultaSchema.safeParse(fromForm(formData, CONSULTA_FIELDS));
  if (!parsed.success) {
    return { ok: false, error: "Revisá los campos e intentá de nuevo.", values };
  }

  try {
    await getPublicWriteDataLayer().consultas.createNoReturn({
      ...parsed.data,
      gestion: "nueva",
    });
    return { ok: true };
  } catch (err) {
    securityLog("write.failed", {
      entity: "consultas",
      message: err instanceof Error ? err.message : "unknown",
    });
    return {
      ok: false,
      error: "No pudimos enviar tu consulta. Intentá de nuevo.",
      values,
    };
  }
}
