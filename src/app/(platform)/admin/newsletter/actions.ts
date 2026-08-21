"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import { newsletterSchema } from "@/lib/validation/admin-schemas";

/** Server actions for the admin Newsletter module. Same pattern as the rest. */

/**
 * Parse the extra attachments, submitted as a JSON array of {titulo, url}.
 * Same hidden-input convention the blog gallery uses. Malformed input is
 * ignored rather than failing the save; the schema does the real validation.
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

function parseNewsletterForm(formData: FormData) {
  return newsletterSchema.parse({
    titulo: formData.get("titulo") ?? "",
    edicion: formData.get("edicion") ?? "",
    contenido: formData.get("contenido") ?? "",
    adjuntoUrl: formData.get("adjuntoUrl") ?? "",
    adjuntos: parseAdjuntos(formData),
    fecha: formData.get("fecha") ?? "",
    status: formData.get("status") ?? "borrador",
  });
}

export async function createNewsletter(formData: FormData): Promise<void> {
  await requireRole("admin");
  await getDataLayer().newsletters.create(parseNewsletterForm(formData));
  revalidatePath("/admin/newsletter");
}

export async function updateNewsletter(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireRole("admin");
  await getDataLayer().newsletters.update(id, parseNewsletterForm(formData));
  revalidatePath("/admin/newsletter");
}

export async function deleteNewsletter(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().newsletters.remove(id);
  revalidatePath("/admin/newsletter");
}
