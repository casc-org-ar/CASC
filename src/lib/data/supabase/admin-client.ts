import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase ADMIN client — uses the SERVICE ROLE key, which BYPASSES RLS.
 *
 * Reserved for trusted server-side jobs that run WITHOUT a user session and
 * must write rows no RLS policy would allow — specifically the Clerk
 * `invitation/user` webhook, which links a socio's `clerk_user_id` and flips
 * their invitation status when they accept.
 *
 * NEVER import this from client code or from anything reachable by the browser.
 * The service role key is the master key: with it, RLS is off. It lives only in
 * server env (SUPABASE_SERVICE_ROLE_KEY) and never ships to the client.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Null when not configured; callers must handle that (e.g. skip the webhook). */
export function createAdminSupabaseClient() {
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
