"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
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
    // An unchecked checkbox submits NO field, so presence means checked. Read
    // it as a boolean here rather than letting a missing field mean "leave as
    // is" — unchecking must actually clear the highlight.
    destacado: formData.get("destacado") !== null,
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

/**
 * Make `base` unique among the existing posts by appending `-2`, `-3`, … The
 * `slug` column is UNIQUE, so two articles whose titles slugify the same (e.g.
 * a re-posted headline) used to fail the insert with a generic error. `ownId`
 * excludes the post being edited, so saving it unchanged keeps its own slug.
 */
async function uniqueSlug(base: string, ownId?: string): Promise<string> {
  const posts = await getDataLayer().blog.list();
  const taken = new Set(
    posts.filter((p) => p.id !== ownId).map((p) => p.slug),
  );
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** Field labels for validation messages shown to the admin. */
const FIELD_LABELS: Record<string, string> = {
  titulo: "El título",
  slug: "El slug",
  bajada: "La bajada",
  cuerpo: "El cuerpo",
  portadaUrl: "El link de la portada",
  imagenes: "Las imágenes",
  videoUrl: "El link del video",
  autor: "El autor",
  tags: "Los tags",
  fecha: "La fecha",
};

/** Turn a save failure into a message the admin can act on. */
function saveErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    const issue = err.issues[0];
    const label = FIELD_LABELS[String(issue?.path[0])] ?? "Un campo";
    if (issue?.code === "too_big" && typeof issue.maximum === "number") {
      return `${label} supera el máximo de ${issue.maximum} caracteres.`;
    }
    return `${label} no es válido. Revisalo e intentá de nuevo.`;
  }
  return "No se pudo guardar el artículo. Intentá de nuevo.";
}

export type SaveBlogResult = { ok: true } | { ok: false; error: string };

export async function createBlogPost(
  formData: FormData,
): Promise<SaveBlogResult> {
  await requireRole("admin");
  try {
    const data = parseBlogForm(formData);
    data.slug = await uniqueSlug(data.slug);
    await getDataLayer().blog.create(data);
  } catch (err) {
    console.error("[admin/blog] create failed:", err);
    return { ok: false, error: saveErrorMessage(err) };
  }
  revalidateArticleViews();
  return { ok: true };
}

export async function updateBlogPost(
  id: string,
  formData: FormData,
): Promise<SaveBlogResult> {
  await requireRole("admin");
  try {
    const data = parseBlogForm(formData);
    data.slug = await uniqueSlug(data.slug, id);
    await getDataLayer().blog.update(id, data);
  } catch (err) {
    console.error("[admin/blog] update failed:", err);
    return { ok: false, error: saveErrorMessage(err) };
  }
  revalidateArticleViews();
  return { ok: true };
}

export async function deleteBlogPost(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().blog.remove(id);
  revalidateArticleViews();
}
