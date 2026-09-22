"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { getDataLayer } from "@/lib/data";
import { securityLog } from "@/lib/security/security-log";

/**
 * Server actions for the admin Encuesta module.
 *
 * Only ONE action, and only for test answers: a member's answer is a record
 * CASC asked them for, and a delete button next to it invites erasing data
 * that cannot be got back — the member cannot re-answer either, since the
 * survey is once-only. Test rows are different: they are debris from checking
 * the form, and leaving them around means CASC's panel carries rows nobody
 * sent.
 *
 * Deleting a real answer is possible at the database level (the admin policy
 * allows it, for a habeas-data request) but deliberately has no button.
 */
export async function deleteRespuestaPrueba(id: string): Promise<void> {
  await requireRole("admin");

  // Re-read the row and refuse unless it is a test. The id comes from the
  // client, so "this is a test answer" is a claim to verify, not to trust:
  // swapping the id for a member's would otherwise delete their answer through
  // an action that promises it only touches tests.
  const respuesta = await getDataLayer().encuesta.getById(id);

  if (!respuesta) return; // Already gone — nothing to do, and no error to show.

  if (!respuesta.esPrueba) {
    securityLog("auth.role_denied", {
      required: "encuesta:delete-prueba",
      had: "respuesta-real",
    });
    throw new Error("Solo se pueden eliminar respuestas de prueba.");
  }

  await getDataLayer().encuesta.remove(id);
  revalidatePath("/admin/encuesta");
}
