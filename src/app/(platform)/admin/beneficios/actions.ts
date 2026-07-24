"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import type { PublicationStatus } from "@/lib/types/domain";

/**
 * Server actions for the admin Beneficios (hoteles) module. Same shape as the
 * other content modules: parse the form, write to the repository, revalidate.
 * `beneficios` and `reservas` are stored as text; the optional perks list is
 * split from a textarea with one item per line.
 */

/** Split a textarea into a trimmed list, dropping blank lines. */
function parseLines(value: FormDataEntryValue | null): string[] | undefined {
  const lines = String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : undefined;
}

/** Parse the star rating, keeping it optional and within 1–5. */
function parseEstrellas(value: FormDataEntryValue | null): number | undefined {
  const n = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n) || n < 1 || n > 5) return undefined;
  return n;
}

function parseHotelForm(formData: FormData) {
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    estrellas: parseEstrellas(formData.get("estrellas")),
    ciudad: String(formData.get("ciudad") ?? "").trim(),
    direccion: String(formData.get("direccion") ?? "").trim() || undefined,
    telefono: String(formData.get("telefono") ?? "").trim() || undefined,
    web: String(formData.get("web") ?? "").trim() || undefined,
    logoUrl: String(formData.get("logoUrl") ?? "").trim() || undefined,
    descuento: String(formData.get("descuento") ?? "").trim(),
    beneficios: parseLines(formData.get("beneficios")),
    reservas: String(formData.get("reservas") ?? "").trim() || undefined,
    nota: String(formData.get("nota") ?? "").trim() || undefined,
    status: (String(formData.get("status") ?? "borrador") === "publicado"
      ? "publicado"
      : "borrador") as PublicationStatus,
  };
}

export async function createHotel(formData: FormData): Promise<void> {
  await requireRole("admin");
  await getDataLayer().hoteles.create(parseHotelForm(formData));
  revalidatePath("/admin/beneficios");
}

export async function updateHotel(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireRole("admin");
  await getDataLayer().hoteles.update(id, parseHotelForm(formData));
  revalidatePath("/admin/beneficios");
}

export async function deleteHotel(id: string): Promise<void> {
  await requireRole("admin");
  await getDataLayer().hoteles.remove(id);
  revalidatePath("/admin/beneficios");
}
