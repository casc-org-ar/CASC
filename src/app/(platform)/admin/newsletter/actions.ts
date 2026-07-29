"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import { newsletterSchema } from "@/lib/validation/admin-schemas";

/** Server actions for the admin Newsletter module. Same pattern as the rest. */

function parseNewsletterForm(formData: FormData) {
  return newsletterSchema.parse({
    titulo: formData.get("titulo") ?? "",
    edicion: formData.get("edicion") ?? "",
    contenido: formData.get("contenido") ?? "",
    adjuntoUrl: formData.get("adjuntoUrl") ?? "",
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
