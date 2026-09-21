"use server";

import { revalidatePath } from "next/cache";
import {
  EncuestaNoDisponibleError,
  getEncuestaEstado,
} from "@/lib/data/encuesta-estado";
import { getDataLayer } from "@/lib/data";
import { securityLog } from "@/lib/security/security-log";
import { ENCUESTA_SLUG_ACTUAL } from "@/lib/types/domain";
import {
  construirTemas,
  encuestaSchema,
} from "@/lib/validation/encuesta-schema";

/**
 * Server action for the member satisfaction survey.
 *
 * Unlike the admin modules, this is not a CRUD surface: a member can only ever
 * CREATE their answer. There is no update and no delete action here, because
 * the survey is final once submitted — and the absence is enforced in the
 * database too (migration 0023 grants members no UPDATE policy), so a missing
 * action is not the only thing standing in the way.
 *
 * Authorization is NOT `requireRole("socio")`. That would reject admins, but
 * more importantly it answers the wrong question: what matters is not the role,
 * it is whether this caller has a `socios` row that still owes an answer.
 * `getEncuestaEstado` answers exactly that, and it is the same function the
 * home CTA consults — so the button and the action can never disagree.
 *
 * NOTE: a `"use server"` module may only export async functions. The error
 * class this throws therefore lives in `lib/data/encuesta-estado.ts`; defining
 * it here would silently strip every export from this file and break the
 * form's import at build time.
 */

export async function enviarEncuesta(formData: FormData): Promise<void> {
  // Server actions are public HTTP endpoints: whoever holds the action id can
  // POST to it. Re-checking here is what actually closes the door — hiding the
  // form after answering is a UI convenience, not a control.
  const { pendiente, socioId } = await getEncuestaEstado();

  if (!socioId || !pendiente) {
    // Worth recording: a submit with the survey already answered means either a
    // double submit (a slow connection, a refreshed tab) or someone replaying
    // the request — and the second is the one to be able to see in the logs.
    securityLog("encuesta.submit_denied", {
      motivo: socioId ? "ya-respondida" : "sin-socio",
    });
    throw new EncuestaNoDisponibleError();
  }

  const datos = encuestaSchema.parse({
    satisfaccionServicios: formData.get("satisfaccionServicios"),
    utilidadComunicacion: formData.get("utilidadComunicacion"),
    queMejorarias: formData.get("queMejorarias") ?? "",
    // Multi-choice fields post one entry per ticked box; `getAll` collects them.
    temasPrioritarios: construirTemas(formData),
    participacionAcciones: formData.get("participacionAcciones"),
    canalesPreferidos: formData.getAll("canalesPreferidos").map(String),
    facilidadPortal: formData.get("facilidadPortal"),
    funcionalidadSugerida: formData.get("funcionalidadSugerida") ?? "",
    dispositivoPrincipal: formData.get("dispositivoPrincipal"),
  });

  // `socioId` comes from the row RLS just authorized, never from the form: a
  // submitted id could name someone else's row. The insert policy would refuse
  // it anyway, but the value should never be client-controlled to begin with.
  await getDataLayer().encuesta.create({
    ...datos,
    socioId,
    encuestaSlug: ENCUESTA_SLUG_ACTUAL,
  });

  // The home CTA reads the answer state, so it has to be re-rendered — this is
  // what makes the invitation disappear for good.
  revalidatePath("/socio");
  revalidatePath("/socio/encuesta");
  revalidatePath("/admin/encuesta");
}
