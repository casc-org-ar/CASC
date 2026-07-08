import type { InvitationService } from "@/lib/invitations/types";
import { mockInvitations } from "@/lib/invitations/mock-invitations";

/**
 * Single entry point to the invitation service. The only place that picks an
 * implementation. Swap to a Clerk-backed service here later — server actions
 * are untouched.
 */
export function getInvitations(): InvitationService {
  return mockInvitations;
}

export type { InvitationService, InvitationResult } from "@/lib/invitations/types";
