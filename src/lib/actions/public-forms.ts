"use server";

import { z } from "zod";
import { getPublicWriteDataLayer } from "@/lib/data";
import { checkRateLimit } from "@/lib/security/rate-limit";

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
export async function enviarSolicitudAsociacion(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await checkRateLimit("form"))) {
    return { ok: false, error: "Demasiados envíos. Esperá unos minutos." };
  }

  const parsed = solicitudSchema.safeParse(
    fromForm(formData, [
      "sector",
      "empresa",
      "contacto",
      "email",
      "cargo",
      "telefono",
      "mensaje",
    ]),
  );
  if (!parsed.success) {
    return { ok: false, error: "Revisá los campos e intentá de nuevo." };
  }

  try {
    await getPublicWriteDataLayer().solicitudes.create({
      ...parsed.data,
      gestion: "nueva",
    });
    return { ok: true };
  } catch (err) {
    // Log the real cause to the server (never to the user); no personal data.
    console.error("[solicitud] insert failed:", err);
    return {
      ok: false,
      error: "No pudimos enviar tu solicitud. Intentá de nuevo.",
    };
  }
}

/** General enquiry from /contacto. */
export async function enviarConsultaContacto(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // DIAGNÓSTICO TEMPORAL (logs a Vercel, no al navegador). Quitar cuando el
  // formulario quede confirmado en producción.
  console.log("[consulta] action START");

  if (!(await checkRateLimit("form"))) {
    console.log("[consulta] blocked by rate limit");
    return { ok: false, error: "Demasiados envíos. Esperá unos minutos." };
  }

  const parsed = consultaSchema.safeParse(
    fromForm(formData, ["nombre", "email", "empresa", "mensaje"]),
  );
  if (!parsed.success) {
    console.log("[consulta] validation failed:", parsed.error.issues);
    return { ok: false, error: "Revisá los campos e intentá de nuevo." };
  }

  try {
    console.log("[consulta] about to insert via", getPublicWriteDataLayer);
    await getPublicWriteDataLayer().consultas.create({
      ...parsed.data,
      gestion: "nueva",
    });
    console.log("[consulta] insert OK");
    return { ok: true };
  } catch (err) {
    console.error("[consulta] insert failed:", err);
    return {
      ok: false,
      error: "No pudimos enviar tu consulta. Intentá de nuevo.",
    };
  }
}
