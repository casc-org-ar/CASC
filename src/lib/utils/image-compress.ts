/**
 * Client-side image compression, run BEFORE uploading to Supabase Storage.
 *
 * Content covers don't need to be huge: a 1600px-wide WebP at ~80% quality
 * looks sharp in cards and article detail while weighing a fraction of a phone
 * photo (a 6 MB JPEG typically lands around 150–300 KB). Compressing here saves
 * both storage and upload bandwidth — a raw upload would fill the free-tier
 * bucket quickly.
 *
 * Uses only the browser Canvas API (no dependencies). Falls back to the
 * original file if anything goes wrong (e.g. an unsupported type like SVG, or a
 * decode error) so a submission is never blocked by compression.
 */

/**
 * Max ORIGINAL file size accepted before uploading, matching the server's
 * Server Actions body limit (6 MB in next.config). Forms use this to reject an
 * oversized file up front with a clear message.
 */
export const MAX_UPLOAD_MB = 6;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

/** Balanced defaults: sharp on screen, small on disk. */
const MAX_EDGE = 1600; // longest side, in px
const QUALITY = 0.8; // WebP quality (0–1)
const OUTPUT_TYPE = "image/webp";
/** Step quality down until the result is at most this size (well under the
 * server's body limit). A detailed 1600px image can still be large at q0.8. */
const TARGET_MAX_BYTES = 1.2 * 1024 * 1024; // 1.2 MB

/** Types we can safely re-encode. SVGs and others pass through untouched. */
const COMPRESSIBLE = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export async function compressImage(file: File): Promise<File> {
  if (!COMPRESSIBLE.has(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;

    // Scale down so the longest edge is at most MAX_EDGE; never upscale.
    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close();

    const encode = (q: number) =>
      new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, OUTPUT_TYPE, q),
      );

    // Encode at the default quality, then step it down if the result is still
    // heavy, so a very detailed image can't blow past the server's body limit.
    let blob = await encode(QUALITY);
    for (const q of [0.65, 0.5, 0.4]) {
      if (blob && blob.size <= TARGET_MAX_BYTES) break;
      blob = await encode(q);
    }
    if (!blob) return file;

    // If compression didn't actually help (e.g. an already-tiny image), keep
    // whichever is smaller.
    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], newName, { type: OUTPUT_TYPE });
  } catch {
    // Any failure → upload the original untouched.
    return file;
  }
}
