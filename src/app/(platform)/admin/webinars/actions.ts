"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import { webinarSchema } from "@/lib/validation/admin-schemas";
import { toEmbedUrl } from "@/lib/utils/video-embed";

/**
 * Server actions for the admin Webinars module. They write through the
 * DataLayer and revalidate the listing so changes reflect live.
 */

/**
 * Parse the attachments, submitted as a JSON array of {titulo, url}. Same
 * hidden-input convention the newsletter and blog gallery use. Malformed input
 * is ignored rather than failing the save; the schema does the real validation.
 */
function parseAdjuntos(formData: FormData): unknown {
  const raw = String(formData.get("adjuntos") ?? "").trim();
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/** Validate + normalize the form. Throws on invalid input (the form catches). */
function parseWebinarForm(formData: FormData) {
  return webinarSchema.parse({
    titulo: formData.get("titulo") ?? "",
    descripcion: formData.get("descripcion") ?? "",
    fecha: formData.get("fecha") ?? "",
    // Normalize any YouTube/Vimeo link to its embeddable form so a normal
    // watch URL doesn't get "refused to connect" in the iframe.
    videoUrl: toEmbedUrl(String(formData.get("videoUrl") ?? "")),
    portadaUrl: formData.get("portadaUrl") ?? "",
    categoria: formData.get("categoria") ?? "",
    adjuntos: parseAdjuntos(formData),
    status: formData.get("status") ?? "borrador",
  });
}

export async function createWebinar(formData: FormData): Promise<void> {
  await requireRole("admin");
  await getDataLayer().webinars.create(parseWebinarForm(formData));
  revalidatePath("/admin/webinars");
}

export async function updateWebinar(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireRole("admin");
  await getDataLayer().webinars.update(id, parseWebinarForm(formData));
  revalidatePath("/admin/webinars");
}

export async function deleteWebinar(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().webinars.remove(id);
  revalidatePath("/admin/webinars");
}
