import "server-only";

/**
 * Invitation email, rendered by us and delivered through Resend.
 *
 * Clerk creates the invitation and returns the acceptance URL, but does NOT
 * send the message (`notify: false`): the Cámara owns the wording and the
 * design, so the email is built here instead of in Clerk's template editor.
 *
 * Why the markup looks dated: email clients are not browsers. The layout uses
 * tables and inline styles because Outlook for Windows renders through Word and
 * drops most modern CSS, and `casc.org.ar` receives mail on Microsoft 365, so a
 * large share of members open it there. Gmail also strips <style> blocks in
 * several contexts, which is why nothing relies on a stylesheet.
 *
 * The header carries the real logo as a PNG. Clients block remote images by
 * default, so the `alt` text is styled to read as the brand name when the
 * image does not load — the header degrades to legible text instead of an
 * empty box.
 *
 * Palette and typography follow marca/CASC_Manual_de_Marca.md — black, grey and
 * white, with the institutional blue reserved for the action button.
 */

/**
 * Absolute URL of the logo. Email clients have no page to resolve a relative
 * path against, so it must be fully qualified and publicly reachable — the file
 * ships in `public/assets/brand/`. PNG, not the site's WebP: Outlook for
 * Windows does not render WebP and would show a broken image.
 */
const LOGO_URL = "https://casc.org.ar/assets/brand/casc-logo-email.png";

/** Escape text interpolated into the HTML body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface InvitacionEmailInput {
  /** Clerk's acceptance URL — carries the `__clerk_ticket`. */
  invitationUrl: string;
  /** Member's name, when known; the greeting falls back to a plain "Hola". */
  nombre?: string;
}

export function asuntoInvitacion(): string {
  return "Te damos acceso a la Plataforma de Socios — CASC";
}

/**
 * Plain-text alternative. Sending it alongside the HTML is what keeps the
 * message out of spam filters that penalise HTML-only mail, and it is what
 * screen readers and text-only clients fall back to.
 */
export function textoInvitacion({
  invitationUrl,
  nombre,
}: InvitacionEmailInput): string {
  const saludo = nombre ? `Hola ${nombre},` : "Hola,";
  return `${saludo}

La Cámara Argentina de Shopping Centers te invita a sumarte a su plataforma
exclusiva para socios. Desde ahí vas a poder acceder a los informes del sector,
las capacitaciones y todos los beneficios que la Cámara pone a disposición.

Para activar tu cuenta, entrá en este enlace y creá tu contraseña:

${invitationUrl}

Esta invitación es personal y fue enviada a tu dirección de correo. Si no
esperabas recibirla, podés ignorar este mensaje: sin activarla, no se crea
ninguna cuenta.

—
Cámara Argentina de Shopping Centers
Representamos a los centros comerciales de toda la Argentina desde 1990.
https://casc.org.ar`;
}

export function htmlInvitacion({
  invitationUrl,
  nombre,
}: InvitacionEmailInput): string {
  const saludo = nombre ? `Hola ${escapeHtml(nombre)},` : "Hola,";
  // The URL goes into an href and into visible text; escaping covers both.
  const url = escapeHtml(invitationUrl);

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Invitación a la Plataforma de Socios — CASC</title>
  </head>
  <body style="margin:0; padding:0; background-color:#DBDAD7; -webkit-font-smoothing:antialiased;">

    <div style="display:none; font-size:1px; color:#DBDAD7; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
      Te damos acceso a la Plataforma de Socios de la Cámara Argentina de Shopping Centers.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#DBDAD7;">
      <tr>
        <td align="center" style="padding:40px 16px;">

          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:100%; background-color:#FFFFFF;">

            <tr>
              <td align="center" style="background-color:#000000; padding:40px 32px 36px 32px;">
                <!-- Real brand logo, white version over the black header.
                     The alt text matters more than usual: clients block remote
                     images by default, so on first open many readers see it
                     instead of the image. It is styled white and bold so the
                     header still reads as CASC when the image never loads. -->
                <img
                  src="${LOGO_URL}"
                  width="200"
                  alt="CASC · Cámara Argentina de Shopping Centers"
                  style="display:block; width:200px; max-width:70%; height:auto; border:0; outline:none; text-decoration:none; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:20px; font-weight:700; color:#FFFFFF;"
                />
                <p style="margin:18px 0 0 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:12px; line-height:18px; font-weight:400; letter-spacing:2px; text-transform:uppercase; color:#DBDAD7;">
                  Cámara Argentina de Shopping Centers
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:44px 48px 8px 48px;">
                <p style="margin:0 0 10px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:12px; line-height:18px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#19557B;">
                  Invitación
                </p>
                <h1 style="margin:0 0 20px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:27px; line-height:35px; font-weight:700; color:#000000;">
                  Te damos acceso a la Plataforma de Socios
                </h1>
                <p style="margin:0 0 16px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:16px; line-height:26px; font-weight:400; color:#3A3A3A;">
                  ${saludo}
                </p>
                <p style="margin:0 0 16px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:16px; line-height:26px; font-weight:400; color:#3A3A3A;">
                  La Cámara Argentina de Shopping Centers te invita a sumarte a su
                  plataforma exclusiva para socios. Desde ahí vas a poder acceder
                  a los informes del sector, las capacitaciones y todos los
                  beneficios que la Cámara pone a disposición.
                </p>
                <p style="margin:0 0 30px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:16px; line-height:26px; font-weight:400; color:#3A3A3A;">
                  Para activar tu cuenta, entrá desde el botón y creá tu contraseña.
                  Solo te va a llevar un minuto.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:0 48px 36px 48px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="background-color:#19557B;">
                      <a href="${url}"
                         style="display:inline-block; padding:16px 42px; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:16px; line-height:20px; font-weight:600; color:#FFFFFF; text-decoration:none;">
                        Activar mi cuenta
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 48px 40px 48px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F3F2;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <p style="margin:0 0 8px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:20px; font-weight:600; color:#000000;">
                        ¿El botón no funciona?
                      </p>
                      <p style="margin:0 0 8px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:20px; font-weight:400; color:#5A5A5A;">
                        Copiá y pegá esta dirección en tu navegador:
                      </p>
                      <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:12px; line-height:19px; font-weight:400; word-break:break-all;">
                        <a href="${url}" style="color:#19557B; text-decoration:underline;">${url}</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 48px 40px 48px; border-top:1px solid #E6E4E2;">
                <p style="margin:24px 0 0 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:21px; font-weight:400; color:#7A7A7A;">
                  Esta invitación es personal y fue enviada a tu dirección de correo.
                  Si no esperabas recibirla, podés ignorar este mensaje: sin activarla,
                  no se crea ninguna cuenta.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="background-color:#000000; padding:32px 48px;">
                <p style="margin:0 0 6px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:14px; line-height:22px; font-weight:600; color:#FFFFFF;">
                  Cámara Argentina de Shopping Centers
                </p>
                <p style="margin:0 0 16px 0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:21px; font-weight:400; color:#9A9A9A;">
                  Representamos a los centros comerciales de toda la Argentina desde 1990.
                </p>
                <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:13px; line-height:21px; font-weight:400;">
                  <a href="https://casc.org.ar" style="color:#DBDAD7; text-decoration:none;">casc.org.ar</a>
                </p>
              </td>
            </tr>

          </table>

          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:100%;">
            <tr>
              <td align="center" style="padding:20px 24px 0 24px;">
                <p style="margin:0; font-family:'Inter', Helvetica, Arial, sans-serif; font-size:12px; line-height:19px; font-weight:400; color:#6E6C6A;">
                  Recibiste este correo porque la Cámara Argentina de Shopping Centers
                  te invitó a su plataforma de socios.
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
