import "server-only";
import { createSupabaseClient } from "@/lib/data/supabase/client";

/**
 * Supabase Storage helpers.
 *
 * Files (CVs, informe PDFs, cover images) live in PRIVATE buckets. What we
 * store in the database is the object PATH, never a public URL — a private
 * bucket has none. To let an authorized member view a file, the server mints a
 * short-lived SIGNED URL on demand (`signedUrl`). This keeps sensitive data
 * (CVs, ley 25.326) behind access control: no permanent link exists to leak.
 *
 * Uploads and downloads go through the Clerk-authenticated client, so the
 * storage RLS policies (migration 0008) decide who may write/read — same
 * defense-in-depth model as the tables.
 */

/** Bucket names. Keep in sync with migration 0008. */
export const BUCKETS = {
  cvs: "cvs",
  informes: "informes",
  portadas: "portadas",
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

/** How long a generated signed URL stays valid. */
const SIGNED_URL_TTL_SECONDS = 60;

export interface UploadResult {
  /** The object path stored in the DB (e.g. "cvs/2026/uuid.pdf"). */
  path: string;
}

/**
 * Upload a content image to the PUBLIC `portadas` bucket and return its
 * permanent public URL — the value stored in the DB and rendered everywhere,
 * including the public site. Unlike `uploadFile` (private buckets → signed
 * URLs), a public bucket exposes a stable `…/object/public/portadas/<path>`
 * URL that any visitor can load, which is what card/cover images need.
 *
 * Writes still require an admin session (storage RLS from migration 0008);
 * "public" only means the objects are READABLE without a token.
 */
export async function uploadPublicImage(
  file: File,
  opts: { extension: string; prefix?: string },
): Promise<{ url: string }> {
  const supabase = createSupabaseClient();
  const name = `${crypto.randomUUID()}.${opts.extension}`;
  const path = opts.prefix ? `${opts.prefix}/${name}` : name;

  const { error } = await supabase.storage
    .from(BUCKETS.portadas)
    .upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    throw new Error(`Image upload to 'portadas' failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKETS.portadas).getPublicUrl(path);
  return { url: data.publicUrl };
}

/**
 * Upload a file to a private bucket under a collision-free path. Returns the
 * stored path — the caller persists THIS, not a URL.
 *
 * `prefix` groups objects (e.g. a year); the filename is randomized so an
 * uploaded name can never collide or leak the original on the path.
 */
export async function uploadFile(
  bucket: BucketName,
  file: File,
  opts: { prefix?: string; extension: string },
): Promise<UploadResult> {
  const supabase = createSupabaseClient();
  const name = `${crypto.randomUUID()}.${opts.extension}`;
  const path = opts.prefix ? `${opts.prefix}/${name}` : name;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(`Storage upload to '${bucket}' failed: ${error.message}`);
  }
  return { path };
}

/**
 * Mint a short-lived signed URL for a stored object. Returns null if the object
 * is missing or access is denied by storage RLS. CVs must additionally be
 * served as a download (Content-Disposition: attachment) — pass `download`.
 */
export async function signedUrl(
  bucket: BucketName,
  path: string,
  opts: { download?: boolean | string } = {},
): Promise<string | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS, {
      download: opts.download ?? false,
    });

  if (error || !data) return null;
  return data.signedUrl;
}
