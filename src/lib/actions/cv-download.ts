"use server";

import { getAuth } from "@/lib/auth";
import { clerkEnabled } from "@/lib/auth/flag";
import { BUCKETS, signedUrl } from "@/lib/data/supabase/storage";

/**
 * Resolve a viewable URL for a candidate's CV. Shared by the socio and admin
 * bolsa-de-trabajo views.
 *
 * CVs live in a PRIVATE bucket, so the stored `cvUrl` is an object path, not a
 * navigable link. This action mints a short-lived signed URL on demand — and
 * only for an authenticated member. The path is never handed to the browser;
 * the client gets a temporary URL that expires in seconds and is served as a
 * download (ley 25.326: sensitive data stays behind access control).
 *
 * With the mock provider, `cvUrl` is already a navigable placeholder, so it is
 * returned as-is.
 */
export async function getCvUrl(cvPath: string): Promise<string | null> {
  // Any authenticated member (socio or admin) may view CVs; anonymous may not.
  const user = await getAuth().getCurrentUser();
  if (!user) return null;

  if (!clerkEnabled()) {
    return cvPath; // Mock: already a navigable placeholder.
  }

  return signedUrl(BUCKETS.cvs, cvPath, { download: true });
}
