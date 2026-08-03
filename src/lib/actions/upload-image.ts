"use server";

import { requireRole } from "@/lib/auth/guard";
import { uploadPublicImage } from "@/lib/data/supabase/storage";

/**
 * Upload a content cover image chosen in an admin form. Runs on the server:
 * requires an admin session, pushes the file to the public `portadas` bucket,
 * and returns its permanent public URL for the form to store.
 *
 * Shared by every content form (blog, webinars, informes, beneficios) via
 * FileOrLinkField, replacing the prototype's mocked `/mock/<name>` path that
 * never actually uploaded anything (so the image never rendered).
 *
 * Limits mirror the form's intent: images only, capped size. On any failure it
 * returns `{ ok: false }` with a friendly message — never throws to the client.
 */

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export type UploadImageResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function uploadContentImage(
  formData: FormData,
): Promise<UploadImageResult> {
  try {
    await requireRole("admin");
  } catch {
    return { ok: false, error: "No autorizado." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No se recibió ninguna imagen." };
  }
  if (!ALLOWED.has(file.type)) {
    return {
      ok: false,
      error: "Formato no permitido. Usá JPG, PNG, WebP, GIF o AVIF.",
    };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "La imagen supera el máximo de 8 MB." };
  }

  try {
    const { url } = await uploadPublicImage(file, {
      prefix: new Date().getFullYear().toString(),
      extension: EXTENSION[file.type] ?? "bin",
    });
    return { ok: true, url };
  } catch {
    return { ok: false, error: "No pudimos subir la imagen. Intentá de nuevo." };
  }
}
