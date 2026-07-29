"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import { noticiaSchema } from "@/lib/validation/admin-schemas";

/** Server actions for the admin Noticias module. Same pattern as the rest. */

/** Validate + normalize the form. Throws on invalid input (the form catches). */
function parseNoticiaForm(formData: FormData) {
  return noticiaSchema.parse({
    titulo: formData.get("titulo") ?? "",
    bajada: formData.get("bajada") ?? "",
    cuerpo: formData.get("cuerpo") ?? "",
    imagenUrl: formData.get("imagenUrl") ?? "",
    categoria: formData.get("categoria") ?? "",
    fecha: formData.get("fecha") ?? "",
    status: formData.get("status") ?? "borrador",
  });
}

export async function createNoticia(formData: FormData): Promise<void> {
  await requireRole("admin");
  await getDataLayer().noticias.create(parseNoticiaForm(formData));
  revalidatePath("/admin/noticias");
}

export async function updateNoticia(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireRole("admin");
  await getDataLayer().noticias.update(id, parseNoticiaForm(formData));
  revalidatePath("/admin/noticias");
}

export async function deleteNoticia(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().noticias.remove(id);
  revalidatePath("/admin/noticias");
}
