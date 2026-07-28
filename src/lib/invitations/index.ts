import type { InvitationService } from "@/lib/invitations/types";
import { mockInvitations } from "@/lib/invitations/mock-invitations";
import { clerkInvitations } from "@/lib/invitations/clerk-invitations";
import { clerkEnabled } from "@/lib/auth/flag";

/**
 * Single entry point to the invitation service. The only place that picks an
 * implementation. Selected by the same flag as auth so the whole stack is
 * consistent: real Clerk invitations when Clerk is on, mock otherwise.
 */
export function getInvitations(): InvitationService {
  return clerkEnabled() ? clerkInvitations : mockInvitations;
}

export type { InvitationService, InvitationResult } from "@/lib/invitations/types";
