import "server-only";

/**
 * Structured security-event logging.
 *
 * Records security-relevant events (permission denials, rate-limit hits, failed
 * validations, rejected uploads) to the server logs (Vercel) so abuse and
 * misconfig are visible after the fact. It is NOT user-facing.
 *
 * HARD RULE — never log sensitive data: no passwords, tokens, cookies, full
 * emails, phone numbers, message bodies, or CV contents. Log the KIND of event
 * and coarse, non-identifying context only. Where an identifier helps triage
 * (e.g. an email on a denied action), pass it already masked via `maskEmail`.
 *
 * Kept dependency-free (console) on purpose; swap the sink for a real
 * observability service later without touching call sites.
 */

export type SecurityEvent =
  | "auth.role_denied" // requireRole rejected a caller
  | "ratelimit.exceeded" // an endpoint hit its limit
  | "input.validation_failed" // a public payload failed schema validation
  | "upload.scan_rejected" // a CV failed the antivirus scan
  | "captcha.rejected" // a reCAPTCHA check failed (reason in context)
  | "write.failed"; // a persistence write threw

/** Non-secret context. Callers must NOT put personal data here. */
type Context = Record<string, string | number | boolean | undefined>;

/**
 * Mask an email for logs: keep the first char and the domain, hide the rest.
 * "maria.gonzalez@shopping.com" → "m***@shopping.com". Never log the raw value.
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local.charAt(0)}***@${domain}`;
}

/** Log a security event to the server logs. Structured, greppable, no secrets. */
export function securityLog(event: SecurityEvent, context: Context = {}): void {
  // Single-line, structured, easy to grep in Vercel logs.
  console.warn(
    `[security] ${event}`,
    JSON.stringify({ at: new Date().toISOString(), ...context }),
  );
}
