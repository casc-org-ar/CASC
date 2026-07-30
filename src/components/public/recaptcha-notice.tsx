/**
 * reCAPTCHA legal notice. Google requires this attribution wherever v3 runs
 * (it may be shown in place of the floating badge). Rendered under each public
 * form. Renders nothing when reCAPTCHA is not configured.
 */
export function RecaptchaNotice() {
  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) return null;

  return (
    <p className="mt-4 text-xs leading-5 text-ink-muted">
      Este sitio está protegido por reCAPTCHA y se aplican la{" "}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-ink"
      >
        Política de privacidad
      </a>{" "}
      y los{" "}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-ink"
      >
        Términos del servicio
      </a>{" "}
      de Google.
    </p>
  );
}
