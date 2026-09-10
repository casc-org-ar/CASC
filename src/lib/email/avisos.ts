import "server-only";
import { sendEmail } from "@/lib/email/resend";
import {
  asuntoAviso,
  htmlAviso,
  textoAviso,
  type AvisoFormularioInput,
} from "@/lib/email/templates/aviso-formulario";
import { securityLog } from "@/lib/security/security-log";

/**
 * Notify CASC that a public form was submitted.
 *
 * Both public forms store the submission first and call this afterwards. The
 * order matters and is not an accident: the database is the record, the email
 * is the alert. A submission that was saved but not announced is a delayed
 * notice; one that was announced but not saved is lost data.
 *
 * This NEVER throws and never returns a failure to the caller. A form that
 * answered "no pudimos enviar tu consulta" because the mailer was down would be
 * lying to the visitor — their message is already stored, and telling them to
 * submit again produces duplicates. Delivery problems go to the security log,
 * where they are visible without being in the visitor's way.
 */

/** Where the CASC team receives the notifications. */
const DESTINO_POR_DEFECTO = "casc@casc.org.ar";

/**
 * Recipient of the notifications. Configurable so a staging deployment can
 * point somewhere else without touching code, and so CASC can change the inbox
 * without a release. Falls back to the address CASC asked for.
 */
function destino(): string {
  return process.env.AVISOS_EMAIL_TO?.trim() || DESTINO_POR_DEFECTO;
}

/** Base URL for the "ver en la plataforma" link. */
function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://casc.org.ar";
}

/**
 * Send one notification. Awaited by the caller, but its outcome is deliberately
 * not part of the form's result.
 *
 * `responderA` becomes the message's Reply-To, so hitting Reply in the inbox
 * answers the person who wrote in. It must be an address a schema has already
 * validated: raw input in a mail header is a header-injection vector.
 */
async function enviarAviso(
  aviso: AvisoFormularioInput,
  responderA?: string,
): Promise<void> {
  try {
    const result = await sendEmail({
      to: destino(),
      subject: asuntoAviso(aviso),
      html: htmlAviso(aviso),
      text: textoAviso(aviso),
      replyTo: responderA,
    });
    if (!result.ok) {
      // `sendEmail` already logged the provider's reason; this records which
      // notification was affected, without carrying personal data into the log.
      securityLog("write.failed", {
        entity: "aviso-formulario",
        message: `no se pudo avisar: ${aviso.tipo}`,
      });
    }
  } catch (cause) {
    // Belt and braces: `sendEmail` catches its own network errors, so reaching
    // here means something unexpected. It still must not reach the visitor.
    securityLog("write.failed", {
      entity: "aviso-formulario",
      message: cause instanceof Error ? cause.message : "error desconocido",
    });
  }
}

export interface AvisoSolicitudInput {
  sector: string;
  empresa: string;
  contacto: string;
  email: string;
  cargo?: string;
  telefono?: string;
  mensaje?: string;
}

/** Membership request from /como-asociarse. */
export async function avisarSolicitudAsociacion(
  datos: AvisoSolicitudInput,
): Promise<void> {
  await enviarAviso(
    {
      tipo: "Solicitud de asociación",
      origen: datos.empresa,
      campos: [
        { etiqueta: "Empresa", valor: datos.empresa },
        { etiqueta: "Sector", valor: datos.sector },
        { etiqueta: "Contacto", valor: datos.contacto },
        { etiqueta: "Cargo", valor: datos.cargo },
        { etiqueta: "Email", valor: datos.email },
        { etiqueta: "Teléfono", valor: datos.telefono },
        { etiqueta: "Mensaje", valor: datos.mensaje },
      ],
      panelUrl: `${appUrl()}/admin/solicitudes`,
    },
    datos.email,
  );
}

export interface AvisoConsultaInput {
  nombre: string;
  email: string;
  empresa?: string;
  mensaje: string;
}

/** General enquiry from /contacto. */
export async function avisarConsultaContacto(
  datos: AvisoConsultaInput,
): Promise<void> {
  await enviarAviso(
    {
      tipo: "Consulta de contacto",
      origen: datos.nombre,
      campos: [
        { etiqueta: "Nombre", valor: datos.nombre },
        { etiqueta: "Empresa", valor: datos.empresa },
        { etiqueta: "Email", valor: datos.email },
        { etiqueta: "Mensaje", valor: datos.mensaje },
      ],
      panelUrl: `${appUrl()}/admin/solicitudes`,
    },
    datos.email,
  );
}
