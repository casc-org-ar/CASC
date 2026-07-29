"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import { webinarSchema } from "@/lib/validation/admin-schemas";

/**
 * Server actions for the admin Webinars module. They write through the
 * DataLayer and revalidate the listing so changes reflect live.
 */

/** Validate + normalize the form. Throws on invalid input (the form catches). */
function parseWebinarForm(formData: FormData) {
  return webinarSchema.parse({
    titulo: formData.get("titulo") ?? "",
    descripcion: formData.get("descripcion") ?? "",
    fecha: formData.get("fecha") ?? "",
    videoUrl: formData.get("videoUrl") ?? "",
    portadaUrl: formData.get("portadaUrl") ?? "",
    categoria: formData.get("categoria") ?? "",
    materialAdjuntoUrl: formData.get("materialAdjuntoUrl") ?? "",
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
