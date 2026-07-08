"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import { getInvitations } from "@/lib/invitations";
import type { MemberState, UserRole } from "@/lib/types/domain";

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
  const cargo = String(formData.get("cargo") ?? "").trim();
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    shopping: String(formData.get("shopping") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    cargo: cargo || undefined,
    estado: (String(formData.get("estado") ?? "activo") === "inactivo"
      ? "inactivo"
      : "activo") as MemberState,
    role: (String(formData.get("role") ?? "socio") === "admin"
      ? "admin"
      : "socio") as UserRole,
  };
}

/** Result surfaced to the client so the manager can show the admin notification. */
export interface AltaResult {
  socioId: string;
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

  const result = await sendInvitationFor(socio.id, parsed.email, parsed.nombre);
  revalidatePath("/admin/socios");
  return { socioId: socio.id, invitacionEnviada: result.ok, email: parsed.email };
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

  const result = await sendInvitationFor(socio.id, socio.email, socio.nombre);
  revalidatePath("/admin/socios");
  return { socioId: id, invitacionEnviada: result.ok, email: socio.email };
}

/**
 * Send the invitation through the provider and persist the send on the socio.
 * Shared by alta and resend. When Clerk lands, only the provider behind
 * `getInvitations()` changes — this stays the same.
 */
async function sendInvitationFor(id: string, email: string, nombre: string) {
  const result = await getInvitations().sendInvitation({ email, nombre });
  if (result.ok) {
    await getDataLayer().socios.update(id, {
      invitacionStatus: "enviada",
      invitacionEnviadaAt: result.sentAt,
    });
  }
  return result;
}
