"use server";

import { z } from "zod";
import { getDataLayer } from "@/lib/data";
import {
  MAX_CV_BYTES,
  sanitizeCvFilename,
  validateCvFile,
} from "@/lib/security/pdf-upload";
import { areasInteres, skillsDisponibles } from "@/lib/data/bolsa-trabajo";
import { clerkEnabled } from "@/lib/auth/flag";
import { BUCKETS, uploadFile } from "@/lib/data/supabase/storage";
import { checkRateLimit } from "@/lib/security/rate-limit";
import type { Disponibilidad } from "@/lib/types/domain";

/**
 * Public server action for the Bolsa de Trabajo landing.
 *
 * This is the first PUBLIC action that writes to the DataLayer, so it is
 * deliberately defensive: no role is required (anyone can apply), but every
 * field is validated, the CV is checked with the PDF security layers, and
 * explicit data-storage consent is mandatory (ley 25.326). New candidates are
 * created as "borrador" so an admin moderates them before recruiters see them.
 */

export interface SubmitState {
  ok: boolean;
  error?: string;
}

const skillValues = new Set<string>(skillsDisponibles);
const disponibilidadValues: Disponibilidad[] = [
  "full-time",
  "part-time",
  "ambas",
];

function parseExperiencia(value: FormDataEntryValue | null): number | undefined {
  const n = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n) || n < 0 || n > 60) return undefined;
  return n;
}

/** Capped optional text: trimmed, length-limited, empty → undefined. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((s) => s || undefined)
    .optional();

/**
 * Text-field schema for a candidate submission. The CV file, skills dedupe and
 * numeric experience keep their bespoke handling below; this schema covers the
 * plain text fields — including capping the optional ones, which previously
 * went in unbounded.
 */
const candidatoTextSchema = z.object({
  nombre: z.string().trim().min(1).max(120),
  email: z.string().trim().min(1).max(200).email(),
  puestoBuscado: z.string().trim().min(1).max(200),
  areaInteres: z.enum(
    areasInteres as unknown as [string, ...string[]],
  ),
  telefono: optionalText(40),
  nivelEducativo: optionalText(120),
  ciudad: optionalText(120),
  provincia: optionalText(120),
});

export async function submitCandidato(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  // Throttle before doing any work (validation, storage) so an abuser can't
  // flood uploads. Fail open if the limiter is unavailable.
  if (!(await checkRateLimit("cv"))) {
    return {
      ok: false,
      error: "Hiciste demasiados envíos. Esperá unos minutos e intentá de nuevo.",
    };
  }

  // Validate all text fields at once with the schema (required, email format,
  // valid área, and length caps on optionals).
  const parsed = candidatoTextSchema.safeParse({
    nombre: formData.get("nombre") ?? "",
    email: formData.get("email") ?? "",
    puestoBuscado: formData.get("puestoBuscado") ?? "",
    areaInteres: formData.get("areaInteres") ?? "",
    telefono: formData.get("telefono") ?? "",
    nivelEducativo: formData.get("nivelEducativo") ?? "",
    ciudad: formData.get("ciudad") ?? "",
    provincia: formData.get("provincia") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error:
        "Revisá los campos obligatorios y que el email y el área sean válidos.",
    };
  }
  const { nombre, email, puestoBuscado, areaInteres } = parsed.data;
  const consentimiento = formData.get("consentimiento") === "on";

  if (!consentimiento) {
    return {
      ok: false,
      error:
        "Necesitamos tu consentimiento para almacenar y compartir tus datos.",
    };
  }

  // Skills: keep only known values, require at least one.
  // Skills from the checkboxes: keep only known values.
  const skillsSeleccionados = formData
    .getAll("skills")
    .map(String)
    .filter((s) => skillValues.has(s));

  // Free-text skills from the "Otros" field: split by comma, sanitize length.
  const skillsOtros = String(formData.get("skillsOtros") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length <= 40)
    .slice(0, 10);

  // Dedupe (case-insensitive) so a free-text entry can't duplicate a checkbox.
  const skills = Array.from(
    new Map(
      [...skillsSeleccionados, ...skillsOtros].map((s) => [s.toLowerCase(), s]),
    ).values(),
  );
  if (skills.length === 0) {
    return { ok: false, error: "Seleccioná al menos una habilidad." };
  }

  // CV file — required, validated through the security layers.
  const cv = formData.get("cv");
  if (!(cv instanceof File) || cv.size === 0) {
    return { ok: false, error: "Adjuntá tu CV en formato PDF." };
  }
  if (cv.size > MAX_CV_BYTES) {
    return { ok: false, error: "El CV supera el máximo de 5 MB." };
  }
  const validation = await validateCvFile(cv);
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }
  const cvNombre = sanitizeCvFilename(cv.name);

  // Store the file. With Supabase active, upload to the private `cvs` bucket
  // and keep the returned object PATH (not a URL — the bucket is private; the
  // app mints a signed URL on demand). With the mock, keep the placeholder path.
  let cvUrl: string;
  if (clerkEnabled()) {
    try {
      const currentYear = new Date().getFullYear().toString();
      const { path } = await uploadFile(BUCKETS.cvs, cv, {
        prefix: currentYear,
        extension: "pdf",
      });
      cvUrl = path;
    } catch {
      return {
        ok: false,
        error: "No pudimos guardar tu CV. Intentá de nuevo.",
      };
    }
  } else {
    cvUrl = `/mock/cv/${cvNombre}`;
  }

  // Optional fields.
  const disponibilidadRaw = String(formData.get("disponibilidad") ?? "");
  const disponibilidad = disponibilidadValues.includes(
    disponibilidadRaw as Disponibilidad,
  )
    ? (disponibilidadRaw as Disponibilidad)
    : undefined;

  try {
    await getDataLayer().candidatos.create({
      nombre,
      email,
      telefono: parsed.data.telefono,
      puestoBuscado,
      areaInteres,
      skills,
      aniosExperiencia: parseExperiencia(formData.get("aniosExperiencia")),
      nivelEducativo: parsed.data.nivelEducativo,
      disponibilidad,
      ciudad: parsed.data.ciudad,
      provincia: parsed.data.provincia,
      // Real storage: the private-bucket object path (mock: a placeholder).
      // The original filename is kept separately for the recruiter's download.
      cvUrl,
      cvNombre,
      consentimiento,
      // Pending admin moderation before recruiters can see it.
      status: "borrador",
    });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "No pudimos registrar tu postulación. Intentá de nuevo.",
    };
  }
}
