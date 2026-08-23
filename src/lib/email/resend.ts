import "server-only";
import { securityLog } from "@/lib/security/security-log";

/**
 * Minimal Resend client.
 *
 * Resend's REST API is a single POST, so this calls it with `fetch` instead of
 * pulling in the SDK — one less dependency to keep current for one endpoint.
 *
 * Configuration (both required to send):
 *   RESEND_API_KEY  — API key. A "sending only" key is enough and is the safer
 *                     choice: it cannot read or change account configuration.
 *   RESEND_FROM     — sender, e.g. "CASC <no-reply@casc.org.ar>". The domain
 *                     must be verified in Resend, or the API rejects the send.
 *
 * With either missing, `sendEmail` reports failure instead of throwing: an
 * unconfigured mailer must not break the alta de socio, which still creates the
 * member and can be retried with "Reenviar invitación".
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  /** Plain-text alternative. Sent alongside the HTML to avoid spam filters. */
  text: string;
}

export interface SendEmailResult {
  ok: boolean;
  /** Resend's message id, for tracing a delivery in their dashboard. */
  id?: string;
  error?: string;
}

export function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    const error = "Resend no está configurado (falta RESEND_API_KEY o RESEND_FROM)";
    securityLog("write.failed", { entity: "email", message: error });
    return { ok: false, error };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html, text }),
    });

    const body = (await response.json()) as { id?: string; message?: string };

    if (!response.ok) {
      // Resend explains the refusal in `message` (unverified domain, invalid
      // key). Keep it: it is the difference between a DNS problem and a
      // credentials problem when someone reads the log later.
      const error = body.message ?? `Resend respondió ${response.status}`;
      securityLog("write.failed", { entity: "email", message: error });
      return { ok: false, error };
    }

    return { ok: true, id: body.id };
  } catch (cause) {
    // Network-level failure — never let it bubble into the alta de socio.
    const error = cause instanceof Error ? cause.message : "Error de red";
    securityLog("write.failed", { entity: "email", message: error });
    return { ok: false, error };
  }
}
