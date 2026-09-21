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
  const { pendiente, socioId, esAdmin } = await getEncuestaEstado();

  // An admin may submit, but only as a TEST answer: they have no member row,
  // so there is nobody for the answer to belong to. `esPrueba` is what keeps
  // it out of CASC's real results.
  if (!pendiente || (!socioId && !esAdmin)) {
    // Worth recording, and worth telling the cases apart: a second submit from
    // a member is usually a slow connection or a refreshed tab, while a submit
    // from an account with no member row and no admin rights is the one that
    // could be a replayed request.
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

  // `socioId` and `esPrueba` come from the session, NEVER from the form: a
  // submitted id could name someone else's row, and a submitted `esPrueba`
  // would let a member file their answer as a test (or an admin file a test as
  // real). The insert policies would refuse both, but neither value should be
  // client-controlled to begin with.
  // `createNoReturn`, NOT `create`: a returning insert re-reads the row it
  // just wrote, and that read goes through the SELECT policy. An admin's test
  // answer has `socio_id` null, which `encuesta_select_propia` cannot match,
  // so the write succeeded and the read-back came up empty — `.single()` then
  // threw and the form reported a failure for an answer that WAS saved.
  // Nothing here needs the stored row, so nothing should ask for it.
  await getDataLayer().encuesta.createNoReturn({
    ...datos,
    // `null` (no member row) becomes `undefined`, which is how the domain
    // spells "absent"; the mapper turns it back into an explicit SQL null.
    socioId: socioId ?? undefined,
    esPrueba: !socioId,
    encuestaSlug: ENCUESTA_SLUG_ACTUAL,
  });

  // The home CTA reads the answer state, so it has to be re-rendered — this is
  // what makes the invitation disappear for good.
  revalidatePath("/socio");
  revalidatePath("/socio/encuesta");
  revalidatePath("/admin/encuesta");
}
