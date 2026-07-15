"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Contact form. Content parity phase: reproduces the original Livewire form
 * fields (Nombre y Apellido, Empresa, Correo electrónico, Mensaje).
 * Submission is NOT wired yet — the original posted to a PHP/Livewire backend,
 * out of scope for content parity.
 */
export function ContactForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire submission to the platform backend.
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Nombre y Apellido <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
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
          required
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
          required
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
