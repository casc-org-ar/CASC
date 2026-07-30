import type { FormEvent } from "react";

/**
 * Spanish native-validation messages for form fields. The browser's built-in
 * messages are in English and generic ("Please fill out this field"); these
 * handlers replace them with clear Spanish text, per field, without extra
 * client state — they hook into the HTML5 constraint validation events.
 *
 * Usage on an input/textarea/select:
 *   <input ... {...requiredField("Ingresá tu nombre.")} />
 *   <input type="email" ... {...emailField("Ingresá un email válido.")} />
 */

type FieldEl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/** Shared: clear any custom message as the user types, so it re-validates. */
function clearOnInput(e: FormEvent<FieldEl>) {
  e.currentTarget.setCustomValidity("");
}

/** A required field with a Spanish "missing value" message. */
export function requiredField(message: string) {
  return {
    required: true,
    onInvalid: (e: FormEvent<FieldEl>) => {
      if (e.currentTarget.validity.valueMissing) {
        e.currentTarget.setCustomValidity(message);
      }
    },
    onInput: clearOnInput,
  };
}

/** A required email field: distinguishes "missing" from "bad format". */
export function emailField(opts: { missing: string; invalid: string }) {
  return {
    required: true,
    onInvalid: (e: FormEvent<HTMLInputElement>) => {
      const v = e.currentTarget.validity;
      if (v.valueMissing) e.currentTarget.setCustomValidity(opts.missing);
      else if (v.typeMismatch)
        e.currentTarget.setCustomValidity(opts.invalid);
    },
    onInput: clearOnInput,
  };
}
