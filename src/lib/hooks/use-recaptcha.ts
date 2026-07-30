"use client";

import { useCallback, useEffect } from "react";

/**
 * reCAPTCHA v3 client hook. Loads Google's script once (idempotent) and exposes
 * `execute(action)`, which returns a fresh token to send with a form submit.
 *
 * v3 is invisible — no widget, no puzzle. The token is verified server-side by
 * `verifyRecaptcha`. When the public site key is not configured, `execute`
 * resolves to an empty string and the server skips verification (fail-open),
 * so forms keep working in environments without reCAPTCHA.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const SCRIPT_ID = "recaptcha-v3";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

export function useRecaptcha() {
  useEffect(() => {
    if (!SITE_KEY) return;
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const execute = useCallback(async (action: string): Promise<string> => {
    if (!SITE_KEY || !window.grecaptcha) return "";
    return new Promise((resolve) => {
      window.grecaptcha!.ready(() => {
        window
          .grecaptcha!.execute(SITE_KEY, { action })
          .then(resolve)
          .catch(() => resolve(""));
      });
    });
  }, []);

  return { execute };
}

/**
 * Wrap a `useActionState` form action so a reCAPTCHA token is obtained and
 * appended to the FormData before the action runs. Use as the form's `action`:
 *
 *   const guarded = useRecaptchaAction(formAction, "consulta");
 *   <form action={guarded}>…</form>
 *
 * The token lands under `recaptchaToken`, which the server action verifies.
 */
export function useRecaptchaAction(
  formAction: (formData: FormData) => void,
  action: string,
) {
  const { execute } = useRecaptcha();

  return useCallback(
    async (formData: FormData) => {
      const token = await execute(action);
      formData.set("recaptchaToken", token);
      formAction(formData);
    },
    [execute, formAction, action],
  );
}
