import "server-only";
import { headers } from "next/headers";
import { clerkClient } from "@clerk/nextjs/server";
import type { InvitationService } from "@/lib/invitations/types";

/**
 * Clerk-backed invitation provider. Satisfies the same `InvitationService`
 * port as the mock — server actions don't change.
 *
 * What it does:
 *   1. Creates a Clerk invitation for the member's email.
 *   2. Pre-assigns the app role via `publicMetadata.role`. When the member
 *      accepts and signs up, that metadata lands on their Clerk user, so the
 *      role is set WITHOUT the admin touching the dashboard.
 *   3. Points `redirectUrl` at the app's own /sign-up so the invitation opens
 *      the branded, in-app acceptance screen (with the `__clerk_ticket`),
 *      instead of Clerk's hosted Account Portal.
 *
 * Acceptance (flipping the socio's invitacionStatus to "aceptada" and linking
 * their clerk_user_id) is handled later by the `invitation.accepted` webhook —
 * out of scope for this port.
 */

/**
 * Absolute base URL of the app; Clerk requires an absolute redirectUrl.
 * Prefers NEXT_PUBLIC_APP_URL, then derives it from the request headers (host +
 * proto, which Vercel sets), so a missing env var no longer 500s the alta de
 * socio. Falls back to the production domain as a last resort.
 */
async function appBaseUrl(): Promise<string> {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const h = await headers();
  const host = h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
  }
  return "https://casc.org.ar";
}

export const clerkInvitations: InvitationService = {
  async sendInvitation({ email, role }) {
    const client = await clerkClient();
    const invitation = await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${await appBaseUrl()}/sign-up`,
      publicMetadata: { role },
      // Resending to an address with a pending invitation should replace it
      // rather than error out.
      ignoreExisting: true,
    });

    return {
      ok: true,
      sentAt: invitation.createdAt
        ? new Date(invitation.createdAt).toISOString()
        : new Date().toISOString(),
      email,
    };
  },
};
