"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import type { PublicationStatus } from "@/lib/types/domain";

/**
 * Server actions for the admin Blog module. New entity — full CRUD. The
 * public rendering template comes later, when the public site exists.
 */

/** Turn a title into a URL-friendly slug. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // strip accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function parseBlogForm(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const portadaUrl = String(formData.get("portadaUrl") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  return {
    titulo,
    slug: slugInput ? slugify(slugInput) : slugify(titulo),
    bajada: String(formData.get("bajada") ?? "").trim(),
    cuerpo: String(formData.get("cuerpo") ?? "").trim(),
    portadaUrl: portadaUrl || undefined,
    autor: String(formData.get("autor") ?? "").trim(),
    tags: tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    fecha: String(formData.get("fecha") ?? ""),
    status: (String(formData.get("status") ?? "borrador") === "publicado"
      ? "publicado"
      : "borrador") as PublicationStatus,
  };
}

export async function createBlogPost(formData: FormData): Promise<void> {
  await requireRole("admin");
  await getDataLayer().blog.create(parseBlogForm(formData));
  revalidatePath("/admin/blog");
}

export async function updateBlogPost(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireRole("admin");
  await getDataLayer().blog.update(id, parseBlogForm(formData));
  revalidatePath("/admin/blog");
}

export async function deleteBlogPost(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().blog.remove(id);
  revalidatePath("/admin/blog");
}
