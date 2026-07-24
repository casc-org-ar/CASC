"use server";

import { getDataLayer } from "@/lib/data";
import type { SectorSolicitud } from "@/lib/types/domain";

/**
 * Public server actions for the site's inbound forms (membership requests and
 * contact enquiries).
 *
 * These are PUBLIC endpoints: anyone can call them, so every field is
 * validated and length-capped here at the boundary. They only ever WRITE —
 * nothing on the public site reads these records back. The CASC team manages
 * them from the admin panel.
 */

export interface FormState {
  ok: boolean;
  error?: string;
}

/** Cap free text so a hostile caller can't store unbounded payloads. */
const MAX = { corto: 120, medio: 200, largo: 2000 } as const;

const SECTORES: SectorSolicitud[] = [
  "Shopping center",
  "Proveedor de servicio",
  "Retailer",
];

function texto(
  formData: FormData,
  campo: string,
  max: number,
): string {
  return String(formData.get(campo) ?? "")
    .trim()
    .slice(0, max);
}

function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Membership request from /como-asociarse. */
export async function enviarSolicitudAsociacion(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const sector = texto(formData, "sector", MAX.corto) as SectorSolicitud;
  const empresa = texto(formData, "empresa", MAX.medio);
  const contacto = texto(formData, "contacto", MAX.medio);
  const email = texto(formData, "email", MAX.medio);

  if (!SECTORES.includes(sector)) {
    return { ok: false, error: "Elegí un sector válido." };
  }
  if (!empresa || !contacto || !email) {
    return { ok: false, error: "Completá los campos obligatorios." };
  }
  if (!emailValido(email)) {
    return { ok: false, error: "Ingresá un email válido." };
  }

  try {
    await getDataLayer().solicitudes.create({
      sector,
      empresa,
      contacto,
      cargo: texto(formData, "cargo", MAX.medio) || undefined,
      telefono: texto(formData, "telefono", MAX.corto) || undefined,
      email,
      mensaje: texto(formData, "mensaje", MAX.largo) || undefined,
      gestion: "nueva",
    });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "No pudimos enviar tu solicitud. Intentá de nuevo.",
    };
  }
}

/** General enquiry from /contacto. */
export async function enviarConsultaContacto(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const nombre = texto(formData, "nombre", MAX.medio);
  const email = texto(formData, "email", MAX.medio);
  const mensaje = texto(formData, "mensaje", MAX.largo);

  if (!nombre || !email || !mensaje) {
    return { ok: false, error: "Completá los campos obligatorios." };
  }
  if (!emailValido(email)) {
    return { ok: false, error: "Ingresá un email válido." };
  }

  try {
    await getDataLayer().consultas.create({
      nombre,
      empresa: texto(formData, "empresa", MAX.medio) || undefined,
      email,
      mensaje,
      gestion: "nueva",
    });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "No pudimos enviar tu consulta. Intentá de nuevo.",
    };
  }
}
