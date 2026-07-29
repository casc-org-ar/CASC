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

  // Antivirus scan (VirusTotal when VIRUSTOTAL_API_KEY is set; otherwise a
  // no-op that relies on the layers above). Rejects flagged files.
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
 * Antivirus scan. Wired to VirusTotal (API v3) behind an env var:
 *
 *  - No VIRUSTOTAL_API_KEY set  → scanning is disabled, the file is treated as
 *    clean. This keeps local/dev and un-provisioned environments working; the
 *    other PDF layers (magic bytes, size, sanitized name, attachment download)
 *    still apply.
 *  - Key set → the file is uploaded, its analysis polled, and it is rejected if
 *    any engine flags it malicious.
 *
 * FAIL CLOSED (when enabled): unlike rate limiting, a scanner error/timeout
 * here rejects the upload. A possibly-malicious CV that couldn't be verified
 * should not reach a recruiter's machine — better to ask the user to retry.
 */
const VT_API = "https://www.virustotal.com/api/v3";
const VT_POLL_MS = 2000;
const VT_MAX_POLLS = 10; // ~20s ceiling

async function scanFile(file: File): Promise<{ clean: boolean }> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    // Scanning disabled — rely on the other PDF layers.
    return { clean: true };
  }

  try {
    // 1) Upload the file, get an analysis id.
    const form = new FormData();
    form.append("file", file);
    const up = await fetch(`${VT_API}/files`, {
      method: "POST",
      headers: { "x-apikey": apiKey },
      body: form,
    });
    if (!up.ok) return { clean: false }; // fail closed
    const analysisId = (await up.json())?.data?.id as string | undefined;
    if (!analysisId) return { clean: false };

    // 2) Poll the analysis until it completes.
    for (let i = 0; i < VT_MAX_POLLS; i++) {
      const res = await fetch(`${VT_API}/analyses/${analysisId}`, {
        headers: { "x-apikey": apiKey },
      });
      if (!res.ok) return { clean: false };
      const body = await res.json();
      const attr = body?.data?.attributes;
      if (attr?.status === "completed") {
        const malicious = Number(attr?.stats?.malicious ?? 0);
        const suspicious = Number(attr?.stats?.suspicious ?? 0);
        return { clean: malicious === 0 && suspicious === 0 };
      }
      await new Promise((r) => setTimeout(r, VT_POLL_MS));
    }
    // Timed out without a verdict → fail closed.
    return { clean: false };
  } catch {
    // Network/other error → fail closed (do not accept an unverified file).
    return { clean: false };
  }
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
