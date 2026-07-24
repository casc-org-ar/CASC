"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  enviarSolicitudAsociacion,
  type FormState,
} from "@/lib/actions/public-forms";

const fieldClass =
  "min-h-12 w-full rounded-lg border border-border bg-bg px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

const labelClass = "mb-2 block text-sm font-semibold text-ink";

const initialState: FormState = { ok: false };

/**
 * Membership request form. Submits to a public server action that validates
 * every field and stores the request; the CASC team manages it from the admin
 * panel. On success the form is replaced by a confirmation message.
 */
export function AssociateForm() {
  const [state, formAction, pending] = useActionState(
    enviarSolicitudAsociacion,
    initialState,
  );

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-border bg-surface/60 p-8 text-center">
        <CheckCircle2
          className="mx-auto h-12 w-12 text-primary"
          aria-hidden="true"
        />
        <h3 className="mt-4 text-xl font-bold text-ink">
          ¡Recibimos tu solicitud!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
          El equipo de la Cámara va a ponerse en contacto con vos a la brevedad.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="sector" className={labelClass}>
          Sector <span className="text-accent">*</span>
        </label>
        <select
          id="sector"
          name="sector"
          required
          defaultValue=""
          className={fieldClass}
        >
          <option value="" disabled>
            Seleccionar
          </option>
          <option value="Shopping center">Shopping center</option>
          <option value="Proveedor de servicio">Proveedor de servicio</option>
          <option value="Retailer">Retailer</option>
        </select>
      </div>

      <div>
        <label htmlFor="empresa" className={labelClass}>
          Empresa (Nombre Fantasía) / Razón Social{" "}
          <span className="text-accent">*</span>
        </label>
        <input
          id="empresa"
          name="empresa"
          required
          className={fieldClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contacto" className={labelClass}>
            Nombre y apellido del contacto{" "}
            <span className="text-accent">*</span>
          </label>
          <input
            id="contacto"
            name="contacto"
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="cargo" className={labelClass}>
            Cargo
          </label>
          <input id="cargo" name="cargo" className={fieldClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="telefono" className={labelClass}>
            Telefono de contacto <span className="text-accent">*</span>
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email de contacto <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Ingresar correo electrónico"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <fieldset>
          <legend className={labelClass}>
            Deseo recibir más información para asociarme{" "}
            <span className="text-accent">*</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Si", value: "si" },
              { label: "No", value: "no" },
            ].map((option) => (
              <label
                key={option.value}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-bg px-4 text-sm text-ink transition-colors hover:border-accent/60"
              >
                <input
                  type="radio"
                  name="info"
                  value={option.value}
                  required
                  className="h-4 w-4 accent-primary"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div>
        <label htmlFor="mensaje" className={labelClass}>
          Comentario o mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={4}
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
    </form>
  );
}
