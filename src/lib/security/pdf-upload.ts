import "server-only";

/**
 * Server-side validation for CV uploads (Bolsa de Trabajo).
 *
 * Uploading a PDF from an unknown visitor is a real attack surface: a malicious
 * file could carry embedded scripts or exploits that fire when a recruiter
 * opens it. This module applies layered, dependency-free checks that run in the
 * prototype today. The one layer that needs infrastructure — antivirus scanning
 * — is stubbed with a clear integration point for when real storage lands.
 *
 * Layers implemented here:
 *  1. Real type by magic bytes (%PDF-), not the extension or Content-Type.
 *  2. Size limit.
 *  3. Filename sanitization (no path traversal, safe characters only).
 *
 * The caller must additionally serve stored CVs with
 * `Content-Disposition: attachment` so a browser downloads them instead of
 * rendering/executing inline.
 */

/** Max CV size. Small enough to curb abuse, large enough for a real résumé. */
export const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB

/** PDF magic number: every valid PDF starts with these bytes ("%PDF-"). */
const PDF_MAGIC = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]);

export interface PdfValidationResult {
  ok: boolean;
  /** User-facing reason when `ok` is false. */
  error?: string;
}

/** True when the buffer begins with the PDF magic number. */
function hasPdfMagic(bytes: Uint8Array): boolean {
  if (bytes.length < PDF_MAGIC.length) return false;
  return PDF_MAGIC.every((b, i) => bytes[i] === b);
}

/**
 * Validate an uploaded CV file. Reads only the header for the magic-byte check,
 * so it does not hold the whole file twice.
 */
export async function validateCvFile(file: File): Promise<PdfValidationResult> {
  if (file.size === 0) {
    return { ok: false, error: "El archivo está vacío." };
  }
  if (file.size > MAX_CV_BYTES) {
    return {
      ok: false,
      error: "El archivo supera el máximo de 5 MB.",
    };
  }

  // Read just the first bytes to confirm it really is a PDF.
  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (!hasPdfMagic(header)) {
    return {
      ok: false,
      error: "El archivo no es un PDF válido.",
    };
  }

  // TODO(storage): when CVs are stored for real (e.g. Vercel Blob), run
  // `scanFile(file)` here and reject the upload if it does not pass. The
  // function is stubbed below so wiring an antivirus service is a one-line
  // change and the flow above never needs rewriting.
  const scan = await scanFile(file);
  if (!scan.clean) {
    return {
      ok: false,
      error: "El archivo no superó el control de seguridad.",
    };
  }

  return { ok: true };
}

/**
 * Antivirus scan seam. In the prototype there is no real storage or scanner,
 * so this returns clean. Replace the body with a call to a scanner (ClamAV,
 * Cloudmersive, VirusTotal, …) once uploads are persisted for real.
 */
async function scanFile(file: File): Promise<{ clean: boolean }> {
  // Prototype stub: no scanner is wired yet, so treat any real file as clean.
  // Replace this body with the antivirus call once uploads are persisted.
  return { clean: file.size >= 0 };
}

/**
 * Sanitize an uploaded filename so it is safe to store and show. Strips any
 * directory components (path traversal), keeps a conservative character set,
 * and forces the `.pdf` extension.
 */
export function sanitizeCvFilename(name: string): string {
  // Drop any path, keep the basename only.
  const base = name.split(/[\\/]/).pop() ?? "cv.pdf";
  // Replace anything outside a safe set, collapse repeats.
  const safe = base
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  const withoutExt = safe.replace(/\.pdf$/i, "") || "cv";
  return `${withoutExt}.pdf`;
}
