import "server-only";
import type { InvitationService } from "@/lib/invitations/types";

/**
 * Mock invitation provider. Simulates the invitation by resolving successfully
 * after a beat, so the prototype runs with no Clerk keys and no Resend account.
 *
 * The real provider (`clerk-invitations`) splits the job in two:
 *   1. Clerk creates the invitation with `notify: false` — it mints the
 *      acceptance ticket but does NOT send any email.
 *   2. Resend delivers OUR branded template with that acceptance link.
 *   3. On sign-up, the `user.created` webhook flips the socio's
 *      `invitacionStatus` to "aceptada" and links their `clerk_user_id`.
 */
export const mockInvitations: InvitationService = {
  // `role` is accepted to satisfy the port; the mock doesn't act on it (no real
  // Clerk user is created). The Clerk implementation puts it in publicMetadata.
  async sendInvitation({ email }) {
    // Simulate provider latency so the UI's pending state is visible in the demo.
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      ok: true,
      sentAt: new Date().toISOString(),
      email,
      // No real delivery happens, but the demo should behave like a success.
      emailSent: true,
    };
  },
};
