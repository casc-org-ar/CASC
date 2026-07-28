import "server-only";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Supabase client factory (server-side).
 *
 * Authentication model: Clerk is the identity provider, Supabase is the data
 * store. We do NOT use Supabase Auth. Instead, each request carries the Clerk
 * session token via the native third-party-auth integration: `accessToken()`
 * returns the Clerk-signed JWT, Supabase verifies it, and the RLS policies in
 * migration 0004 read the user's identity/role straight from that token's
 * claims (`auth.jwt()`).
 *
 * This is the whole security hinge: with no token, `auth.jwt()` is null, every
 * RLS `using` clause is false, and queries return empty (never an error). So a
 * missing token surfaces as "no data", not a crash — which is exactly why the
 * token wiring must be correct here and verified with an adversarial test.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are required.",
  );
}

/**
 * A Supabase client scoped to the current Clerk session. Anonymous callers
 * (public site) get a client with no token — RLS then only allows what the
 * `anon` policies permit (e.g. INSERT candidatos). Authenticated members get
 * their Clerk token, so RLS resolves their role.
 */
export function createSupabaseClient() {
  return createClient(supabaseUrl!, supabaseKey!, {
    async accessToken() {
      const { getToken } = await auth();
      return (await getToken()) ?? null;
    },
  });
}

/**
 * An ANONYMOUS Supabase client — no Clerk token. For public-site reads of
 * published content (news, blog, hotel benefits), where there is no logged-in
 * user and, crucially, no HTTP request at all during static generation
 * (generateStaticParams). Because it never calls Clerk's `auth()`, it works at
 * build time; because it carries no token, RLS treats it as `anon`, so it can
 * only read what the public policies allow (status = 'publicado', migration
 * 0009). It must never be used for member/admin data.
 */
export function createPublicSupabaseClient() {
  return createClient(supabaseUrl!, supabaseKey!);
}
