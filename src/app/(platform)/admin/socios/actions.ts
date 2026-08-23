"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import { getInvitations } from "@/lib/invitations";
import { socioSchema } from "@/lib/validation/admin-schemas";
import type { UserRole } from "@/lib/types/domain";

/**
 * Server actions for the admin Socios (users) module. Members carry
 * `estado` (activo/inactivo) and `role` instead of a publication status, plus
 * an independent `invitacionStatus` for the onboarding flow.
 */

/**
 * Parse the admin-editable fields only. `invitacionStatus` is intentionally
 * NOT read from the form — it is owned by the invitation flow (create/resend
 * here, and Clerk's acceptance webhook later), never typed by the admin.
 */
function parseSocioForm(formData: FormData) {
  return socioSchema.parse({
    nombre: String(formData.get("nombre") ?? "").trim(),
    shopping: String(formData.get("shopping") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    cargo: String(formData.get("cargo") ?? ""),
    estado: String(formData.get("estado") ?? "activo"),
    role: String(formData.get("role") ?? "socio"),
  });
}

/** Result surfaced to the client so the manager can show the admin notification. */
export interface AltaResult {
  socioId: string;
  /**
   * Whether the invitation EMAIL actually went out. The Clerk invitation can be
   * created while delivery fails (Resend not configured, sending domain not
   * verified), so this tracks the email — telling the admin "invitación
   * enviada" when nothing was delivered leaves a member waiting for a link that
   * never arrives.
   */
  invitacionEnviada: boolean;
  email: string;
}

/**
 * Alta de socio: create the member (invitation pending), then fire the account
 * invitation and record that it was sent. Returns whether the invite went out
 * so the UI can notify the admin.
 */
export async function createSocio(formData: FormData): Promise<AltaResult> {
  await requireRole("admin");
  const parsed = parseSocioForm(formData);

  const socio = await getDataLayer().socios.create({
    ...parsed,
    invitacionStatus: "pendiente",
  });

  const result = await sendInvitationFor(
    socio.id,
    parsed.email,
    parsed.nombre,
    parsed.role,
  );
  revalidatePath("/admin/socios");
  return {
    socioId: socio.id,
    invitacionEnviada: result.emailSent,
    email: parsed.email,
  };
}

export async function updateSocio(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireRole("admin");
  // Editing member details must not reset onboarding progress, so
  // `invitacionStatus` is left untouched here.
  await getDataLayer().socios.update(id, parseSocioForm(formData));
  revalidatePath("/admin/socios");
}

export async function deleteSocio(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().socios.remove(id);
  revalidatePath("/admin/socios");
}

/**
 * Resend the account invitation to an existing member. Used when the socio
 * never registered (invitation still pending/enviada). Re-marks it "enviada"
 * with a fresh timestamp.
 */
export async function resendInvitation(id: string): Promise<AltaResult> {
  await requireRole("admin");
  const socio = await getDataLayer().socios.getById(id);
  if (!socio) throw new Error("Socio no encontrado");

  const result = await sendInvitationFor(
    socio.id,
    socio.email,
    socio.nombre,
    socio.role,
  );
  revalidatePath("/admin/socios");
  return {
    socioId: id,
    invitacionEnviada: result.emailSent,
    email: socio.email,
  };
}

/**
 * Send the invitation through the provider and persist the send on the socio.
 * Shared by alta and resend. The provider behind `getInvitations()` is the only
 * thing that changes between mock and real — this stays the same.
 *
 * Only an actually delivered email marks the socio as "enviada". The invitation
 * can exist in Clerk while the email fails (Resend not configured, sending
 * domain not verified); recording "enviada" then would show the admin a member
 * who was never reached, and hide that the invitation needs resending.
 */
async function sendInvitationFor(
  id: string,
  email: string,
  nombre: string,
  role: UserRole,
) {
  const result = await getInvitations().sendInvitation({ email, nombre, role });
  if (result.emailSent) {
    await getDataLayer().socios.update(id, {
      invitacionStatus: "enviada",
      invitacionEnviadaAt: result.sentAt,
    });
  }
  return result;
}
