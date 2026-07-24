"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import type { GestionStatus } from "@/lib/types/domain";

/**
 * Admin actions for inbound public enquiries. These records are created by the
 * public forms; the admin only updates their handling state or deletes them.
 */

export async function setSolicitudGestion(
  id: string,
  gestion: GestionStatus,
): Promise<void> {
  await requireRole("admin");
  await getDataLayer().solicitudes.update(id, { gestion });
  revalidatePath("/admin/solicitudes");
}

export async function deleteSolicitud(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().solicitudes.remove(id);
  revalidatePath("/admin/solicitudes");
}

export async function setConsultaGestion(
  id: string,
  gestion: GestionStatus,
): Promise<void> {
  await requireRole("admin");
  await getDataLayer().consultas.update(id, { gestion });
  revalidatePath("/admin/solicitudes");
}

export async function deleteConsulta(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().consultas.remove(id);
  revalidatePath("/admin/solicitudes");
}
