"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import { ENCUESTA_SLUG_ACTUAL } from "@/lib/types/domain";
import {
  encuestaTextosSchema,
  parseOpciones,
} from "@/lib/validation/encuesta-textos-schema";

/**
 * Save the survey's wording.
 *
 * Editing texts NEVER touches stored answers: each one carries a snapshot of
 * the wording its author read (migration 0026), so a reworded question is
 * shown over new answers only. That is what makes this safe to run on a live
 * survey — without it, rewording would silently reinterpret what members
 * already said.
 */
export async function guardarTextos(formData: FormData): Promise<void> {
  const admin = await requireRole("admin");

  const textos = encuestaTextosSchema.parse({
    titulo: formData.get("titulo") ?? "",
    subtitulo: formData.get("subtitulo") ?? "",
    ctaTitulo: formData.get("ctaTitulo") ?? "",
    ctaDescripcion: formData.get("ctaDescripcion") ?? "",

    satisfaccionServicios: formData.get("satisfaccionServicios") ?? "",
    satisfaccionMin: formData.get("satisfaccionMin") ?? "",
    satisfaccionMax: formData.get("satisfaccionMax") ?? "",
    utilidadComunicacion: formData.get("utilidadComunicacion") ?? "",
    utilidadMin: formData.get("utilidadMin") ?? "",
    utilidadMax: formData.get("utilidadMax") ?? "",
    queMejorarias: formData.get("queMejorarias") ?? "",

    temasPrioritarios: formData.get("temasPrioritarios") ?? "",
    // One option per line — see `parseOpciones`.
    temasOpciones: parseOpciones(formData.get("temasOpciones")),
    participacionAcciones: formData.get("participacionAcciones") ?? "",
    canalesPreferidos: formData.get("canalesPreferidos") ?? "",
    canalesOpciones: parseOpciones(formData.get("canalesOpciones")),

    facilidadPortal: formData.get("facilidadPortal") ?? "",
    facilidadMin: formData.get("facilidadMin") ?? "",
    facilidadMax: formData.get("facilidadMax") ?? "",
    funcionalidadSugerida: formData.get("funcionalidadSugerida") ?? "",
    dispositivoPrincipal: formData.get("dispositivoPrincipal") ?? "",
  });

  await getDataLayer().encuestaTextos.save(
    ENCUESTA_SLUG_ACTUAL,
    textos,
    admin.email,
  );

  // Every surface that renders the survey's wording.
  revalidatePath("/socio");
  revalidatePath("/socio/encuesta");
  revalidatePath("/admin/encuesta");
  revalidatePath("/admin/encuesta/textos");
}
