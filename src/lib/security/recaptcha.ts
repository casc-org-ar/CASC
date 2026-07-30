import "server-only";
import { securityLog } from "@/lib/security/security-log";

/**
 * Server-side reCAPTCHA v3 verification.
 *
 * The public forms send a token produced by grecaptcha in the browser. Here we
 * hand it to Google's siteverify endpoint with the SECRET key (never exposed to
 * the client) and accept the submission only when Google confirms it and the
 * risk score clears our threshold. v3 is invisible: no puzzle, just a 0.0–1.0
 * score where 1.0 is very likely human.
 *
 * Config (env):
 *   NEXT_PUBLIC_RECAPTCHA_SITE_KEY — public site key, used in the browser.
 *   RECAPTCHA_SECRET_KEY           — secret key, server-only, used here.
 *
 * Fail-open by design: if the secret is not configured, verification is
 * SKIPPED (returns true) so the forms keep working in environments without
 * reCAPTCHA set up (local dev, previews). Spam protection only kicks in once
 * both keys are present. Rate limiting remains as a second layer regardless.
 */

/** Minimum score to accept. 0.5 is Google's suggested default for v3. */
const SCORE_THRESHOLD = 0.5;

interface SiteVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
}

export async function verifyRecaptcha(
  token: string,
  expectedAction: string,
): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // Not configured → skip (fail-open). Rate limiting still applies.
  if (!secret) return true;

  if (!token) {
    securityLog("captcha.rejected", {
      reason: "missing_token",
      action: expectedAction,
    });
    return false;
  }

  try {
    const res = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      },
    );
    const data = (await res.json()) as SiteVerifyResponse;

    if (!data.success) {
      securityLog("captcha.rejected", {
        reason: "verify_failed",
        action: expectedAction,
        codes: (data["error-codes"] ?? []).join(","),
      });
      return false;
    }

    // Guard against a token minted for a different action being replayed here.
    if (data.action && data.action !== expectedAction) {
      securityLog("captcha.rejected", {
        reason: "action_mismatch",
        expected: expectedAction,
        got: data.action,
      });
      return false;
    }

    const score = data.score ?? 0;
    if (score < SCORE_THRESHOLD) {
      securityLog("captcha.rejected", {
        reason: "low_score",
        action: expectedAction,
        score: String(score),
      });
      return false;
    }

    return true;
  } catch (err) {
    // A network error to Google must not silently let spam through, but also
    // must not hard-block real users. Log and fail-open: rate limiting covers us.
    securityLog("captcha.rejected", {
      reason: "network_error",
      action: expectedAction,
      message: err instanceof Error ? err.message : "unknown",
    });
    return true;
  }
}
