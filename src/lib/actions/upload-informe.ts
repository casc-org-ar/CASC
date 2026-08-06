"use server";

import { requireRole } from "@/lib/auth/guard";
import { uploadFile } from "@/lib/data/supabase/storage";

/**
 * Upload an informe PDF chosen in the admin form. Runs on the server: requires
 * an admin session, pushes the file to the PRIVATE `informes` bucket, and
 * returns the stored object PATH (not a URL) — informes are members-only, so
 * the app serves them via short-lived signed URLs, never a public link.
 *
 * Replaces the prototype's mocked `/mock/<name>.pdf` path that never actually
 * uploaded, so the PDF never rendered.
 */

const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20 MB — reports can be large

export type UploadInformeResult =
  | { ok: true; path: string }
  | { ok: false; error: string };

export async function uploadInformePdf(
  formData: FormData,
): Promise<UploadInformeResult> {
  try {
    await requireRole("admin");
  } catch {
    return { ok: false, error: "No autorizado." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No se recibió ningún archivo." };
  }
  if (file.type !== "application/pdf") {
    return { ok: false, error: "El archivo debe ser un PDF." };
  }
  if (file.size > MAX_PDF_BYTES) {
    return { ok: false, error: "El PDF supera el máximo de 20 MB." };
  }

  try {
    const { path } = await uploadFile("informes", file, {
      prefix: new Date().getFullYear().toString(),
      extension: "pdf",
    });
    return { ok: true, path };
  } catch {
    return { ok: false, error: "No pudimos subir el PDF. Intentá de nuevo." };
  }
}
