"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import type { PublicationStatus } from "@/lib/types/domain";

/**
 * Server actions for the admin Informes module. Same shape as Webinars —
 * write to the mock repository, revalidate the listing. The file upload is
 * mocked: we accept a URL string standing in for what Vercel Blob returns.
 */

function parseInformeForm(formData: FormData) {
  return {
    titulo: String(formData.get("titulo") ?? "").trim(),
    descripcion: String(formData.get("descripcion") ?? "").trim(),
    categoria: String(formData.get("categoria") ?? "").trim(),
    archivoUrl: String(formData.get("archivoUrl") ?? "").trim(),
    fecha: String(formData.get("fecha") ?? ""),
    status: (String(formData.get("status") ?? "borrador") === "publicado"
      ? "publicado"
      : "borrador") as PublicationStatus,
  };
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
