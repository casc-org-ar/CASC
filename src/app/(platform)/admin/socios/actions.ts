"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import type { MemberState, UserRole } from "@/lib/types/domain";

/**
 * Server actions for the admin Socios (users) module. Members carry
 * `estado` (activo/inactivo) and `role` instead of a publication status.
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

export async function createSocio(formData: FormData): Promise<void> {
  await requireRole("admin");
  await getDataLayer().socios.create(parseSocioForm(formData));
  revalidatePath("/admin/socios");
}

export async function updateSocio(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireRole("admin");
  await getDataLayer().socios.update(id, parseSocioForm(formData));
  revalidatePath("/admin/socios");
}

export async function deleteSocio(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().socios.remove(id);
  revalidatePath("/admin/socios");
}
