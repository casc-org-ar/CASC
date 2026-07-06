"use client";

/**
 * Associate request form. Content parity phase: reproduces the original
 * Livewire form fields (Sector, Empresa, Contacto, Cargo, Teléfono, Email,
 * Mensaje). Submission is NOT wired yet — the original posted to a PHP/Livewire
 * backend that is out of scope for the content-parity phase. The submit handler
 * is a placeholder pending backend integration.
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
        <label htmlFor="sector" className="mb-1 block text-sm font-medium text-ink">
          Sector <span className="text-accent">*</span>
        </label>
        <input
          id="sector"
          name="sector"
          required
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="empresa" className="mb-1 block text-sm font-medium text-ink">
          Empresa <span className="text-accent">*</span>
        </label>
        <input
          id="empresa"
          name="empresa"
          required
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contacto" className="mb-1 block text-sm font-medium text-ink">
            Contacto <span className="text-accent">*</span>
          </label>
          <input
            id="contacto"
            name="contacto"
            required
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="cargo" className="mb-1 block text-sm font-medium text-ink">
            Cargo
          </label>
          <input
            id="cargo"
            name="cargo"
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="telefono" className="mb-1 block text-sm font-medium text-ink">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Ingresar correo electrónico"
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className="mb-1 block text-sm font-medium text-ink">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={4}
          placeholder="Escribir..."
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Enviar solicitud
      </button>
    </form>
  );
}
