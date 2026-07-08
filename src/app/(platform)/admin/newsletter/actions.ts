"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import type { PublicationStatus } from "@/lib/types/domain";

/** Server actions for the admin Newsletter module. Same pattern as the rest. */

function parseNewsletterForm(formData: FormData) {
  const adjuntoUrl = String(formData.get("adjuntoUrl") ?? "").trim();
  return {
    titulo: String(formData.get("titulo") ?? "").trim(),
    edicion: String(formData.get("edicion") ?? "").trim(),
    contenido: String(formData.get("contenido") ?? "").trim() || undefined,
    adjuntoUrl: adjuntoUrl || undefined,
    fecha: String(formData.get("fecha") ?? ""),
    status: (String(formData.get("status") ?? "borrador") === "publicado"
      ? "publicado"
      : "borrador") as PublicationStatus,
  };
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
