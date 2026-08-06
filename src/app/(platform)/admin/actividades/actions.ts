"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import { actividadSchema } from "@/lib/validation/admin-schemas";

/**
 * Server actions for the admin Actividades module. Activities are public
 * content (home + /actividades), so create/edit/delete revalidate both the
 * admin listing and every public view where an activity can appear.
 */

/** Turn a title into a URL-friendly slug (mirrors the blog module). */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseActividadForm(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  return actividadSchema.parse({
    titulo,
    slug: slugInput ? slugify(slugInput) : slugify(titulo),
    descripcion: String(formData.get("descripcion") ?? "").trim(),
    imagen: String(formData.get("imagen") ?? "").trim(),
    cuerpo: String(formData.get("cuerpo") ?? "").trim(),
    fecha: String(formData.get("fecha") ?? "").trim(),
    lugar: String(formData.get("lugar") ?? "").trim(),
    inscripcionUrl: String(formData.get("inscripcionUrl") ?? "").trim(),
    status: String(formData.get("status") ?? "borrador"),
  });
}

/** Revalidate the admin listing and every public view of activities. */
function revalidateActividadViews(): void {
  revalidatePath("/admin/actividades");
  revalidatePath("/"); // home carousel
  revalidatePath("/actividades"); // public list
  revalidatePath("/actividades", "layout"); // detail pages [slug]
}

export async function createActividad(formData: FormData): Promise<void> {
  await requireRole("admin");
  await getDataLayer().actividades.create(parseActividadForm(formData));
  revalidateActividadViews();
}

export async function updateActividad(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireRole("admin");
  await getDataLayer().actividades.update(id, parseActividadForm(formData));
  revalidateActividadViews();
}

export async function deleteActividad(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().actividades.remove(id);
  revalidateActividadViews();
}
