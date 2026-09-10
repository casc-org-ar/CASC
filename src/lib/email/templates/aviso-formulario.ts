import "server-only";

/**
 * Internal notification sent to CASC whenever someone submits one of the public
 * forms — a membership request (/como-asociarse) or a general enquiry
 * (/contacto).
 *
 * Why it exists: submissions are stored in the platform and read from the
 * Solicitudes panel, which means the team has to log in and go looking to find
 * out that anything arrived. Before the platform, these forms landed in an
 * inbox. This restores that: the panel stays the record, the email is the alert.
 *
 * This message is NOT for the person who filled the form — it goes to the CASC
 * team, so it reads as an internal notice, not as a customer-facing reply. The
 * submitter's address travels in `Reply-To`, so answering from the inbox
 * reaches them directly.
 *
 * Markup follows the same constraints as the invitation template: tables and
 * inline styles, because casc.org.ar receives mail on Microsoft 365 and Outlook
 * for Windows renders through Word, which drops most modern CSS.
 */

/** Escape text interpolated into the HTML body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** One labelled value of the submission. Rows with no value are dropped. */
export interface CampoAviso {
  etiqueta: string;
  valor?: string;
}

export interface AvisoFormularioInput {
  /** What was submitted, e.g. "Solicitud de asociación". Used in the subject. */
  tipo: string;
  /** Who submitted it, for the subject line: company or person's name. */
  origen: string;
  /** The submitted fields, in the order they should be read. */
  campos: CampoAviso[];
  /** Where in the panel to manage it. */
  panelUrl: string;
}

/**
 * Subject line. It leads with the type and the sender so the team can triage
 * from the inbox list without opening anything.
 */
export function asuntoAviso({ tipo, origen }: AvisoFormularioInput): string {
  return `${tipo} — ${origen}`;
}

/** Rows that actually carry a value; optional fields are left out entirely. */
function camposConValor(campos: CampoAviso[]): Array<Required<CampoAviso>> {
  return campos
    .map((c) => ({ etiqueta: c.etiqueta, valor: (c.valor ?? "").trim() }))
    .filter((c) => c.valor.length > 0);
}

/**
 * Plain-text alternative. Sent alongside the HTML: it keeps the message out of
 * spam filters that penalise HTML-only mail, and it is what text-only clients
 * and screen readers fall back to.
 */
export function textoAviso({
  tipo,
  campos,
  panelUrl,
}: AvisoFormularioInput): string {
  const lineas = camposConValor(campos).map(
    (c) => `${c.etiqueta}: ${c.valor}`,
  );
  return `${tipo} recibida desde el sitio web.

${lineas.join("\n")}

Para gestionarla, entrá al panel:
${panelUrl}

—
Este aviso es automático. La solicitud queda registrada en la plataforma
aunque este correo no llegue.`;
}

export function htmlAviso({
  tipo,
  campos,
  panelUrl,
}: AvisoFormularioInput): string {
  const filas = camposConValor(campos)
    .map(
      (c) => `
              <tr>
                <td style="padding:10px 0; border-bottom:1px solid #E5E4E1; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#6B6B6B; width:150px; vertical-align:top;">
                  ${escapeHtml(c.etiqueta)}
                </td>
                <td style="padding:10px 0; border-bottom:1px solid #E5E4E1; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:#1A1A1A; vertical-align:top;">
                  ${escapeHtml(c.valor).replace(/\n/g, "<br />")}
                </td>
              </tr>`,
    )
    .join("");

  const url = escapeHtml(panelUrl);

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(tipo)} — CASC</title>
  </head>
  <body style="margin:0; padding:0; background-color:#DBDAD7; -webkit-font-smoothing:antialiased;">

    <div style="display:none; font-size:1px; color:#DBDAD7; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
      ${escapeHtml(tipo)} recibida desde el sitio web de CASC.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#DBDAD7;">
      <tr>
        <td align="center" style="padding:40px 16px;">

          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:100%; background-color:#FFFFFF;">

            <tr>
              <td style="padding:28px 32px 20px 32px; border-bottom:3px solid #1A1A1A;">
                <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#6B6B6B;">
                  Sitio web CASC
                </p>
                <h1 style="margin:6px 0 0 0; font-family:Arial,Helvetica,sans-serif; font-size:20px; font-weight:bold; color:#1A1A1A;">
                  ${escapeHtml(tipo)}
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 8px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${filas}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 32px 32px;">
                <p style="margin:0 0 16px 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:22px; color:#4A4A4A;">
                  Podés responder este correo para contactar directamente a quien
                  escribió, o gestionarlo desde la plataforma.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="background-color:#1B3A6B;">
                      <a href="${url}" style="display:inline-block; padding:12px 28px; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:bold; color:#FFFFFF; text-decoration:none;">
                        Ver en la plataforma
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px; background-color:#F5F4F2; border-top:1px solid #E5E4E1;">
                <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:18px; color:#6B6B6B;">
                  Aviso automático. La solicitud queda registrada en la
                  plataforma aunque este correo no llegue.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
</html>`;
}
