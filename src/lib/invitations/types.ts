/**
 * Invitation contract (the "port"). The mock implementation satisfies it now;
 * a Clerk-backed implementation satisfies it later. Callers (server actions)
 * invoke `sendInvitation` and never know which provider is behind it.
 *
 * When Clerk lands, the real implementation calls Clerk's Invitations API,
 * which emails the sign-up link and later fires a webhook on acceptance — that
 * webhook flips the socio's `invitacionStatus` to "aceptada". None of that
 * leaks here: the port stays identical.
 */
export interface InvitationResult {
  /** True when the provider accepted the request to send the invite. */
  ok: boolean;
  /** ISO timestamp the invite was sent (for the admin notification + record). */
  sentAt: string;
  /** The email the invite went to. */
  email: string;
}

export interface InvitationService {
  /**
   * Send (or resend) an account invitation to a member's email. In production
   * this triggers Clerk's invitation email; here it is mocked.
   */
  sendInvitation(input: {
    email: string;
    nombre: string;
  }): Promise<InvitationResult>;
}
