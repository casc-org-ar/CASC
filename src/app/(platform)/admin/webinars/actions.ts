"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import type { PublicationStatus } from "@/lib/types/domain";

/**
 * Server actions for the admin Webinars module. They write to the mock
 * repository and revalidate the listing so the demo reflects changes live.
 * When Supabase lands, these are untouched — the repository swaps behind them.
 */

/** Extract webinar fields from a submitted form. */
function parseWebinarForm(formData: FormData) {
  const materialAdjuntoUrl = String(
    formData.get("materialAdjuntoUrl") ?? "",
  ).trim();
  const portadaUrl = String(formData.get("portadaUrl") ?? "").trim();
  return {
    titulo: String(formData.get("titulo") ?? "").trim(),
    descripcion: String(formData.get("descripcion") ?? "").trim(),
    fecha: String(formData.get("fecha") ?? ""),
    videoUrl: String(formData.get("videoUrl") ?? "").trim(),
    portadaUrl: portadaUrl || undefined,
    categoria: String(formData.get("categoria") ?? "").trim(),
    materialAdjuntoUrl: materialAdjuntoUrl || undefined,
    status: (String(formData.get("status") ?? "borrador") ===
    "publicado"
      ? "publicado"
      : "borrador") as PublicationStatus,
  };
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
