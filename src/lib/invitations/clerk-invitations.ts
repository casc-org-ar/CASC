import "server-only";
import { headers } from "next/headers";
import { clerkClient } from "@clerk/nextjs/server";
import { sendEmail } from "@/lib/email/resend";
import {
  asuntoInvitacion,
  htmlInvitacion,
  textoInvitacion,
} from "@/lib/email/templates/invitacion-socio";
import { maskEmail, securityLog } from "@/lib/security/security-log";
import type { InvitationService } from "@/lib/invitations/types";

/**
 * Invitation provider: Clerk issues the invitation, Resend delivers the email.
 *
 * Clerk owns the credential side — it mints the acceptance ticket and, on
 * sign-up, applies the pre-assigned role. But it does NOT send the message:
 * `notify: false` suppresses Clerk's own email so the Cámara controls the
 * wording and the design, which live in `templates/invitacion-socio`.
 *
 * The flow:
 *   1. Create the invitation in Clerk with `notify: false`. The response
 *      carries `url` — the acceptance link with the `__clerk_ticket`.
 *   2. Send our branded email through Resend with that link.
 *
 * `redirectUrl` points at the app's own /sign-up, so accepting opens the
 * in-app screen instead of Clerk's hosted Account Portal.
 *
 * Acceptance (flipping `invitacionStatus` to "aceptada" and linking
 * `clerk_user_id`) is handled by the `user.created` webhook, not here.
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
  async sendInvitation({ email, nombre, role }) {
    const client = await clerkClient();
    const invitation = await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${await appBaseUrl()}/sign-up`,
      publicMetadata: { role },
      // Suppress Clerk's own email — we send our own below. Without this the
      // member would receive TWO invitations: Clerk's default and ours.
      notify: false,
      // Resending to an address with a pending invitation should replace it
      // rather than error out.
      ignoreExisting: true,
    });

    const sentAt = invitation.createdAt
      ? new Date(invitation.createdAt).toISOString()
      : new Date().toISOString();

    // `url` is the acceptance link (carries the __clerk_ticket). Without it
    // there is nothing to put in the email, so don't pretend one was sent.
    if (!invitation.url) {
      securityLog("write.failed", {
        entity: "email",
        message: "Clerk no devolvió la URL de aceptación de la invitación",
        email: maskEmail(email),
      });
      return { ok: true, sentAt, email, emailSent: false };
    }

    const delivery = await sendEmail({
      to: email,
      subject: asuntoInvitacion(),
      html: htmlInvitacion({ invitationUrl: invitation.url, nombre }),
      text: textoInvitacion({ invitationUrl: invitation.url, nombre }),
    });

    // The invitation exists in Clerk either way, so `ok` stays true: the member
    // is invited and the admin can retry delivery with "Reenviar invitación".
    // `emailSent` is what tells the admin whether anything actually arrived.
    return { ok: true, sentAt, email, emailSent: delivery.ok };
  },
};
