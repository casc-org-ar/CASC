import "server-only";
import type { InvitationService } from "@/lib/invitations/types";

/**
 * Mock invitation provider. Simulates sending Clerk's invitation email by
 * resolving successfully after a beat. Replaced wholesale by a Clerk-backed
 * implementation later — callers never change.
 *
 * The real provider will:
 *   1. Call Clerk's `invitations.createInvitation({ emailAddress, redirectUrl })`.
 *   2. Clerk emails the sign-up link.
 *   3. On sign-up, Clerk fires an `invitation.accepted` webhook that flips the
 *      socio's `invitacionStatus` to "aceptada".
 */
export const mockInvitations: InvitationService = {
  async sendInvitation({ email }) {
    // Simulate provider latency so the UI's pending state is visible in the demo.
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      ok: true,
      sentAt: new Date().toISOString(),
      email,
    };
  },
};
