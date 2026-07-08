"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import type { PublicationStatus } from "@/lib/types/domain";

/** Server actions for the admin Noticias module. Same pattern as the rest. */

function parseNoticiaForm(formData: FormData) {
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  return {
    titulo: String(formData.get("titulo") ?? "").trim(),
    bajada: String(formData.get("bajada") ?? "").trim(),
    cuerpo: String(formData.get("cuerpo") ?? "").trim(),
    imagenUrl: imagenUrl || undefined,
    categoria: categoria || undefined,
    fecha: String(formData.get("fecha") ?? ""),
    status: (String(formData.get("status") ?? "borrador") === "publicado"
      ? "publicado"
      : "borrador") as PublicationStatus,
  };
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
