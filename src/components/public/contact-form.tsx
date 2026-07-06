"use client";

/**
 * Contact form. Content parity phase: reproduces the original Livewire form
 * fields (Nombre, Empresa, Email, Mensaje). Submission is NOT wired yet — the
 * original posted to a PHP/Livewire backend, out of scope for content parity.
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
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">
            Nombre <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="empresa" className="mb-1 block text-sm font-medium text-ink">
            Empresa
          </label>
          <input
            id="empresa"
            name="empresa"
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
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

      <div>
        <label htmlFor="mensaje" className="mb-1 block text-sm font-medium text-ink">
          Mensaje <span className="text-accent">*</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          placeholder="Escribir..."
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Enviar mensaje
      </button>
    </form>
  );
}
