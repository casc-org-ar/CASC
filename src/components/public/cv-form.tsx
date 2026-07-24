"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Send, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  areasInteres,
  nivelesEducativos,
  skillsDisponibles,
} from "@/lib/data/bolsa-trabajo";
import { submitCandidato, type SubmitState } from "@/app/(public)/bolsa-de-trabajo/actions";

const initialState: SubmitState = { ok: false };

const labelClass = "mb-2 block text-sm font-semibold text-ink";
const inputClass =
  "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-accent/30";

/**
 * Public CV submission form for the Bolsa de Trabajo. Submits to a server
 * action that validates everything (including the PDF) and stores the
 * candidate as pending moderation. On success it swaps to a confirmation
 * message instead of a toast, since the public site has no toast provider.
 */
export function CvForm() {
  const [state, formAction, pending] = useActionState(
    submitCandidato,
    initialState,
  );
  const [fileName, setFileName] = useState<string | null>(null);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-border bg-surface/60 p-8 text-center">
        <CheckCircle2
          className="mx-auto h-12 w-12 text-primary"
          aria-hidden="true"
        />
        <h3 className="mt-4 text-xl font-bold text-ink">
          ¡Recibimos tu postulación!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
          Tu perfil quedó registrado y será revisado por el equipo de la Cámara
          antes de estar disponible para los reclutadores. Gracias por sumarte a
          la Bolsa de Trabajo.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-border bg-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={labelClass}>
            Nombre y apellido <span className="text-accent">*</span>
          </label>
          <input id="nombre" name="nombre" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="telefono" className={labelClass}>
            Teléfono
          </label>
          <input id="telefono" name="telefono" className={inputClass} />
        </div>
        <div>
          <label htmlFor="puestoBuscado" className={labelClass}>
            Puesto que buscás <span className="text-accent">*</span>
          </label>
          <input
            id="puestoBuscado"
            name="puestoBuscado"
            required
            placeholder="Ej.: Encargado de local"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="areaInteres" className={labelClass}>
            Área de interés <span className="text-accent">*</span>
          </label>
          <select
            id="areaInteres"
            name="areaInteres"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Elegí un área…
            </option>
            {areasInteres.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="aniosExperiencia" className={labelClass}>
            Años de experiencia
          </label>
          <input
            id="aniosExperiencia"
            name="aniosExperiencia"
            type="number"
            min={0}
            max={60}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ciudad" className={labelClass}>
            Ciudad
          </label>
          <input id="ciudad" name="ciudad" className={inputClass} />
        </div>
        <div>
          <label htmlFor="provincia" className={labelClass}>
            Provincia
          </label>
          <input id="provincia" name="provincia" className={inputClass} />
        </div>
        <div>
          <label htmlFor="nivelEducativo" className={labelClass}>
            Nivel educativo
          </label>
          <select
            id="nivelEducativo"
            name="nivelEducativo"
            defaultValue=""
            className={inputClass}
          >
            <option value="">Sin especificar</option>
            {nivelesEducativos.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="disponibilidad" className={labelClass}>
            Disponibilidad
          </label>
          <select
            id="disponibilidad"
            name="disponibilidad"
            defaultValue=""
            className={inputClass}
          >
            <option value="">Sin especificar</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="ambas">Ambas</option>
          </select>
        </div>
      </div>

      {/* Skills — the key filter recruiters use. */}
      <fieldset className="mt-6">
        <legend className={labelClass}>
          Habilidades <span className="text-accent">*</span>
        </legend>
        <p className="mb-3 text-xs text-ink-muted">
          Seleccioná todas las que apliquen.
        </p>
        <div className="flex flex-wrap gap-2">
          {skillsDisponibles.map((skill) => (
            <label
              key={skill}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-ink-muted transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary"
            >
              <input
                type="checkbox"
                name="skills"
                value={skill}
                className="h-3.5 w-3.5 accent-[var(--color-casc-navy-500)]"
              />
              {skill}
            </label>
          ))}
        </div>
      </fieldset>

      {/* CV upload. */}
      <div className="mt-6">
        <label htmlFor="cv" className={labelClass}>
          Tu CV en PDF <span className="text-accent">*</span>
        </label>
        <label
          htmlFor="cv"
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-surface/60 px-4 py-3 text-sm text-ink-muted transition-colors hover:border-primary hover:bg-surface"
        >
          <UploadCloud className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <span>{fileName ?? "Elegí un archivo PDF (máx. 5 MB)"}</span>
          <input
            id="cv"
            name="cv"
            type="file"
            accept="application/pdf,.pdf"
            required
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
      </div>

      {/* Consent — required by ley 25.326. */}
      <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-6 text-ink-muted">
        <input
          type="checkbox"
          name="consentimiento"
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-casc-navy-500)]"
        />
        <span>
          Presto mi consentimiento para que la Cámara Argentina de Shopping
          Centers almacene mis datos y los comparta con reclutadores de sus
          centros comerciales asociados, con el fin de participar en búsquedas
          laborales (Ley 25.326 de Protección de Datos Personales).{" "}
          <span className="text-accent">*</span>
        </span>
      </label>

      {state.error && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Enviando…" : "Enviar postulación"}
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
