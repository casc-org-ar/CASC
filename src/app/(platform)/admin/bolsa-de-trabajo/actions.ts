"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import type { PublicationStatus } from "@/lib/types/domain";

/**
 * Admin actions for the Bolsa de Trabajo. Candidates are created from the
 * public landing, so there is no admin "create" here — the admin moderates
 * (publish/unpublish), lightly edits, and deletes.
 */

/** Publish or unpublish a candidate (the moderation gate for recruiters). */
export async function setCandidatoStatus(
  id: string,
  status: PublicationStatus,
): Promise<void> {
  await requireRole("admin");
  await getDataLayer().candidatos.update(id, { status });
  revalidatePath("/admin/bolsa-de-trabajo");
}

/** Edit the moderation-relevant fields of a candidate. */
export async function updateCandidato(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireRole("admin");
  const skills = formData
    .getAll("skills")
    .map(String)
    .map((s) => s.trim())
    .filter(Boolean);

  await getDataLayer().candidatos.update(id, {
    nombre: String(formData.get("nombre") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim() || undefined,
    puestoBuscado: String(formData.get("puestoBuscado") ?? "").trim(),
    areaInteres: String(formData.get("areaInteres") ?? "").trim(),
    ...(skills.length > 0 ? { skills } : {}),
    ciudad: String(formData.get("ciudad") ?? "").trim() || undefined,
    provincia: String(formData.get("provincia") ?? "").trim() || undefined,
    status: (String(formData.get("status") ?? "borrador") === "publicado"
      ? "publicado"
      : "borrador") as PublicationStatus,
  });
  revalidatePath("/admin/bolsa-de-trabajo");
}

export async function deleteCandidato(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().candidatos.remove(id);
  revalidatePath("/admin/bolsa-de-trabajo");
}
