"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  enviarConsultaContacto,
  type FormState,
} from "@/lib/actions/public-forms";
import { useRecaptchaAction } from "@/lib/hooks/use-recaptcha";
import { RecaptchaNotice } from "./recaptcha-notice";
import { emailField, requiredField } from "./form-validation";

const initialState: FormState = { ok: false };

/**
 * Contact form. Submits to a public server action that validates the input and
 * stores the enquiry; the CASC team manages it from the admin panel. On success
 * the form is replaced by a confirmation message.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    enviarConsultaContacto,
    initialState,
  );
  const guardedAction = useRecaptchaAction(formAction, "consulta");

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-border bg-surface/60 p-8 text-center">
        <CheckCircle2
          className="mx-auto h-12 w-12 text-primary"
          aria-hidden="true"
        />
        <h3 className="mt-4 text-xl font-bold text-ink">
          ¡Recibimos tu consulta!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
          Te vamos a responder al correo que nos dejaste.
        </p>
      </div>
    );
  }

  // Values echoed back by the action on failure, so the fields keep what the
  // user typed instead of clearing. `defaultValue` + a state-derived key make
  // the inputs re-mount with those values after an error.
  const v = state.values ?? {};

  return (
    <form action={guardedAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="nombre"
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Nombre y Apellido <span className="text-accent">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            {...requiredField("Ingresá tu nombre y apellido.")}
            defaultValue={v.nombre ?? ""}
            className="min-h-12 w-full rounded-lg border border-border bg-bg px-4 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div>
          <label
            htmlFor="empresa"
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Empresa
          </label>
          <input
            id="empresa"
            name="empresa"
            defaultValue={v.empresa ?? ""}
            className="min-h-12 w-full rounded-lg border border-border bg-bg px-4 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-ink"
        >
          Correo electrónico <span className="text-accent">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          {...emailField({
            missing: "Ingresá tu correo electrónico.",
            invalid: "Ingresá un correo electrónico válido.",
          })}
          defaultValue={v.email ?? ""}
          placeholder="Ingresar correo electrónico"
          className="min-h-12 w-full rounded-lg border border-border bg-bg px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </div>

      <div>
        <label
          htmlFor="mensaje"
          className="mb-2 block text-sm font-semibold text-ink"
        >
          Mensaje <span className="text-accent">*</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          {...requiredField("Escribí tu mensaje.")}
          defaultValue={v.mensaje ?? ""}
          placeholder="Escribir..."
          className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="w-full sm:w-auto"
      >
        {pending ? "Enviando…" : "Enviar"}
        <Send className="h-4 w-4" strokeWidth={1.8} aria-hidden />
      </Button>

      <RecaptchaNotice />
    </form>
  );
}
