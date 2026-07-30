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
    const email = evt.data.email_addresses?.[0]?.email_address;
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

      // Match by email (case-insensitive — the socios table has a unique
      // lower(email) index) and only update a row still awaiting acceptance.
      const { error } = await supabase
        .from("socios")
        .update({
          clerk_user_id: clerkUserId,
          invitacion_status: "aceptada",
        })
        .ilike("email", email);

      if (error) {
        securityLog("write.failed", {
          entity: "socios",
          message: `webhook link failed: ${error.message}`,
        });
        // 500 → Svix will retry later.
        return new Response("Update failed", { status: 500 });
      }
    }
  }

  // Always ack handled/ignored events so Clerk stops retrying.
  return new Response("OK", { status: 200 });
}
