import { esES } from "@clerk/localizations";

/**
 * Clerk localization: Spanish base (esES) plus overrides for a few
 * server-error messages that esES doesn't translate, so the UI never shows
 * English (e.g. "New sign-ups are currently restricted." when the instance is
 * invitation-only).
 *
 * Clerk surfaces server errors through `unstable__errors[<code>]`. We merge our
 * extra keys on top of esES's; if Clerk renames a code, the worst case is
 * falling back to Clerk's English default (no crash).
 */
export const clerkEsLocalization = {
  ...esES,
  unstable__errors: {
    ...esES.unstable__errors,
    // Invitation-only instance: sign-ups are closed.
    not_allowed_to_sign_up:
      "El registro está restringido. El acceso es solo por invitación de la Cámara.",
    sign_up_restricted:
      "El registro está restringido. El acceso es solo por invitación de la Cámara.",
    captcha_invalid:
      "No pudimos validar la seguridad. Actualizá la página e intentá de nuevo.",
  },
};
