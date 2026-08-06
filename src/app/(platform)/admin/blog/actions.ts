"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import { blogSchema } from "@/lib/validation/admin-schemas";
import { toEmbedUrl } from "@/lib/utils/video-embed";

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

/** Parse the gallery, submitted as a JSON array of image URLs. */
function parseImagenes(formData: FormData): string[] | undefined {
  const raw = String(formData.get("imagenes") ?? "").trim();
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const urls = parsed.filter((x): x is string => typeof x === "string");
      return urls.length ? urls : undefined;
    }
  } catch {
    // Malformed input — ignore rather than fail the whole save.
  }
  return undefined;
}

function parseBlogForm(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  // Build with the module's transformations (slug, gallery, tags), then
  // validate the result — throws on invalid input (the form catches it).
  return blogSchema.parse({
    titulo,
    slug: slugInput ? slugify(slugInput) : slugify(titulo),
    bajada: String(formData.get("bajada") ?? "").trim(),
    cuerpo: String(formData.get("cuerpo") ?? "").trim(),
    portadaUrl: String(formData.get("portadaUrl") ?? "").trim(),
    imagenes: parseImagenes(formData),
    videoUrl: toEmbedUrl(String(formData.get("videoUrl") ?? "").trim()),
    autor: String(formData.get("autor") ?? "").trim(),
    tags: tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    visibilidad: String(formData.get("visibilidad") ?? "publico"),
    fecha: String(formData.get("fecha") ?? ""),
    status: String(formData.get("status") ?? "borrador"),
  });
}

/**
 * Revalidate every place an article can surface, so a new/edited/removed post
 * shows up immediately instead of a stale cached page. Blog + noticias are one
 * entity now, so an article can appear on the public site (home, /noticias and
 * its detail) AND in the socio panel, depending on its `visibilidad`.
 */
function revalidateArticleViews(): void {
  revalidatePath("/admin/blog");
  revalidatePath("/"); // home (últimas noticias)
  revalidatePath("/noticias"); // public list
  revalidatePath("/noticias", "layout"); // public detail pages [slug]
  revalidatePath("/socio"); // socio home feed
  revalidatePath("/socio/noticias"); // socio list
  revalidatePath("/socio/noticias", "layout"); // socio detail pages [slug]
}

export async function createBlogPost(formData: FormData): Promise<void> {
  await requireRole("admin");
  await getDataLayer().blog.create(parseBlogForm(formData));
  revalidateArticleViews();
}

export async function updateBlogPost(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireRole("admin");
  await getDataLayer().blog.update(id, parseBlogForm(formData));
  revalidateArticleViews();
}

export async function deleteBlogPost(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().blog.remove(id);
  revalidateArticleViews();
}
