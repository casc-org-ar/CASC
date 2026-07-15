"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const fieldClass =
  "min-h-12 w-full rounded-lg border border-border bg-bg px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

const labelClass = "mb-2 block text-sm font-semibold text-ink";

/**
 * Associate request form. Content parity phase: reproduces the original
 * Livewire form fields. Submission is NOT wired yet — the original posted to a
 * PHP/Livewire backend that is out of scope for the content-parity phase.
 */
export function AssociateForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire submission to the platform backend.
      }}
    >
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
          <option value="shopping-center">Shopping center</option>
          <option value="proveedor-de-servicio">Proveedor de servicio</option>
          <option value="retailer">Retailer</option>
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
            Nombre y apellido del contacto
          </label>
          <input
            id="contacto"
            name="contacto"
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

      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
      >
        Enviar
        <Send className="h-4 w-4" strokeWidth={1.8} aria-hidden />
      </Button>
    </form>
  );
}
