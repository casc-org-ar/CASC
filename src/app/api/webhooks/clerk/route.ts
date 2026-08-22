import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { createAdminSupabaseClient } from "@/lib/data/supabase/admin-client";
import { securityLog } from "@/lib/security/security-log";

/**
 * Clerk webhook endpoint.
 *
 * On `user.created` (a socio accepting their invitation and signing up), links
 * their Clerk user to the pre-existing `socios` row by email and flips the
 * invitation status to "aceptada". Until now the admin saw "enviada" forever;
 * this closes the loop automatically.
 *
 * Why the admin (service-role) client: this runs with NO user session (Clerk
 * calls it server-to-server), and it writes `clerk_user_id` — a column the RLS
 * policies never expose to a normal client. So it must bypass RLS.
 *
 * Security: every request is signature-verified with `verifyWebhook` (uses
 * CLERK_WEBHOOK_SIGNING_SECRET). Unverified requests are rejected. The route is
 * made public in proxy.ts so Clerk's middleware doesn't 401 it.
 */
export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch {
    // Bad/absent signature → reject (do not trust the payload).
    return new Response("Verification failed", { status: 400 });
  }

  if (evt.type === "user.created") {
    // Use the PRIMARY email, not `email_addresses[0]`. A Clerk user can hold
    // several addresses and the array order is not the primary one, while
    // `getCurrentUser()` (clerk-auth.ts) reads `primaryEmailAddress`. Reading a
    // different address on each side links the socio row to one email and then
    // looks it up by another — the row is never found and an active member is
    // bounced to /cuenta-inactiva. Both sides must resolve the same address.
    const emails = evt.data.email_addresses ?? [];
    const email =
      emails.find((e) => e.id === evt.data.primary_email_address_id)
        ?.email_address ?? emails[0]?.email_address;
    const clerkUserId = evt.data.id;

    if (email && clerkUserId) {
      const supabase = createAdminSupabaseClient();
      if (!supabase) {
        // Not configured (no service role key). Log and ack so Clerk doesn't
        // retry forever; the link can be reconciled later.
        securityLog("write.failed", {
          entity: "socios",
          message: "admin client unavailable (missing service role key)",
        });
        return new Response("OK", { status: 200 });
      }

      // Exact match on the normalized email. `ilike` was wrong here: it treats
      // `%` and `_` in the value as wildcards, so "juan_perez@x.com" would also
      // match "juanXperez@x.com" — and a value like "%@%" would match EVERY
      // member, linking one Clerk user over unrelated rows. `eq` has no pattern
      // semantics, and since emails are stored lowercased (migration 0019) it
      // is also the exact comparison the unique lower(email) index expects.
      const { data: linked, error } = await supabase
        .from("socios")
        .update({
          clerk_user_id: clerkUserId,
          invitacion_status: "aceptada",
        })
        .eq("email", email.trim().toLowerCase())
        .select("id");

      if (error) {
        securityLog("write.failed", {
          entity: "socios",
          message: `webhook link failed: ${error.message}`,
        });
        // 500 → Svix will retry later.
        return new Response("Update failed", { status: 500 });
      }

      // Matching no row is not a DB error, but it IS the failure that strands a
      // member: they signed up with an address that has no socios record (an
      // admin invited a different one, or the row was removed), so RLS will
      // never return their row and they land on /cuenta-en-activacion forever.
      // Retrying cannot fix a missing row, so ack and log for reconciliation
      // instead of letting it fail silently.
      if (!linked || linked.length === 0) {
        securityLog("write.failed", {
          entity: "socios",
          message: `webhook link matched no socio for the signed-up email (clerk_user_id: ${clerkUserId})`,
        });
      }
    }
  }

  // Always ack handled/ignored events so Clerk stops retrying.
  return new Response("OK", { status: 200 });
}
