"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import { informeSchema } from "@/lib/validation/admin-schemas";

/**
 * Server actions for the admin Informes module. Same shape as Webinars —
 * write to the mock repository, revalidate the listing. The file upload is
 * mocked: we accept a URL string standing in for what Vercel Blob returns.
 */

function parseInformeForm(formData: FormData) {
  return informeSchema.parse({
    titulo: formData.get("titulo") ?? "",
    descripcion: formData.get("descripcion") ?? "",
    categoria: formData.get("categoria") ?? "",
    archivoUrl: formData.get("archivoUrl") ?? "",
    portadaUrl: formData.get("portadaUrl") ?? "",
    fecha: formData.get("fecha") ?? "",
    status: formData.get("status") ?? "borrador",
  });
}

export async function createInforme(formData: FormData): Promise<void> {
  await requireRole("admin");
  await getDataLayer().informes.create(parseInformeForm(formData));
  revalidatePath("/admin/informes");
}

export async function updateInforme(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireRole("admin");
  await getDataLayer().informes.update(id, parseInformeForm(formData));
  revalidatePath("/admin/informes");
}

export async function deleteInforme(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().informes.remove(id);
  revalidatePath("/admin/informes");
}
