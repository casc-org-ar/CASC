"use server";

import { getDataLayer } from "@/lib/data";
import {
  MAX_CV_BYTES,
  sanitizeCvFilename,
  validateCvFile,
} from "@/lib/security/pdf-upload";
import { areasInteres, skillsDisponibles } from "@/lib/data/bolsa-trabajo";
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

const areaValues = new Set<string>(areasInteres);
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

export async function submitCandidato(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const puestoBuscado = String(formData.get("puestoBuscado") ?? "").trim();
  const areaInteres = String(formData.get("areaInteres") ?? "").trim();
  const consentimiento = formData.get("consentimiento") === "on";

  // Required text fields.
  if (!nombre || !email || !puestoBuscado) {
    return { ok: false, error: "Completá los campos obligatorios." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Ingresá un email válido." };
  }
  if (!areaValues.has(areaInteres)) {
    return { ok: false, error: "Elegí un área de interés válida." };
  }
  if (!consentimiento) {
    return {
      ok: false,
      error:
        "Necesitamos tu consentimiento para almacenar y compartir tus datos.",
    };
  }

  // Skills: keep only known values, require at least one.
  const skills = formData
    .getAll("skills")
    .map(String)
    .filter((s) => skillValues.has(s));
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
      telefono: String(formData.get("telefono") ?? "").trim() || undefined,
      puestoBuscado,
      areaInteres,
      skills,
      aniosExperiencia: parseExperiencia(formData.get("aniosExperiencia")),
      nivelEducativo:
        String(formData.get("nivelEducativo") ?? "").trim() || undefined,
      disponibilidad,
      ciudad: String(formData.get("ciudad") ?? "").trim() || undefined,
      provincia: String(formData.get("provincia") ?? "").trim() || undefined,
      // Mock storage: keep a placeholder path plus the real (sanitized) name.
      // When real storage lands, replace with the uploaded file's URL.
      cvUrl: `/mock/cv/${cvNombre}`,
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
