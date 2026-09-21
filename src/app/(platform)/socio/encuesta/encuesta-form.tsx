"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label, Textarea } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  CANALES_NOVEDADES,
  DISPOSITIVO_LABEL,
  ESCALA_EXTREMOS,
  PARTICIPACION_LABEL,
  TEMAS_PRIORITARIOS,
} from "@/lib/types/domain";
import { CAMPO_TEMA_OTRO } from "@/lib/validation/encuesta-schema";
import { enviarEncuesta } from "./actions";

/**
 * The member satisfaction survey form.
 *
 * Built from native inputs (radio/checkbox) rather than custom widgets: they
 * are keyboard- and screen-reader-accessible for free, and they post through
 * `FormData` without any client-side state to keep in sync. The only state
 * here is what the UI genuinely needs — whether "Otro" is ticked, to reveal
 * its text box.
 *
 * Submitting is one-way. The confirm dialog is there because the answers
 * cannot be edited afterwards, and a survey is easy to send by accident with
 * a stray Enter key.
 */

/** Ordered scale values, low to high. */
const ESCALA = [1, 2, 3, 4, 5] as const;

/**
 * A 1-5 rating rendered as five radio buttons, not a `<select>`.
 *
 * The survey itself asks whether members browse on a phone, and on a phone a
 * native select opens a modal picker — three of those turns a 9-question form
 * into a chore. Five tappable targets answer in one tap and show the whole
 * scale at a glance, which a collapsed select cannot.
 *
 * The endpoints are labelled: a bare "3" does not say which end is good, and
 * an unanchored scale gets answered inconsistently — which would make the
 * averages CASC reads meaningless.
 */
function EscalaField({
  name,
  label,
  extremos,
}: {
  name: string;
  label: string;
  extremos: { min: string; max: string };
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </legend>
      <div className="flex flex-wrap items-center gap-2">
        {ESCALA.map((valor) => (
          <label
            key={valor}
            className={cn(
              "flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-sm font-semibold text-ink transition-colors",
              "hover:border-accent",
              // The checked state is styled through the peer input so the
              // native radio keeps doing the keyboard and a11y work.
              "has-checked:border-primary has-checked:bg-primary has-checked:text-white",
              "has-focus-visible:ring-2 has-focus-visible:ring-primary has-focus-visible:ring-offset-2",
            )}
          >
            <input
              type="radio"
              name={name}
              value={valor}
              required
              className="sr-only"
            />
            {valor}
          </label>
        ))}
      </div>
      <p className="mt-1.5 flex justify-between text-xs text-ink-muted">
        <span>1 · {extremos.min}</span>
        <span>5 · {extremos.max}</span>
      </p>
    </fieldset>
  );
}

/** A single-choice question rendered as a row of radio pills. */
function OpcionUnicaField<T extends string>({
  name,
  label,
  opciones,
}: {
  name: string;
  label: string;
  opciones: Record<T, string>;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {(Object.entries(opciones) as [T, string][]).map(([valor, texto]) => (
          <label
            key={valor}
            className={cn(
              "cursor-pointer rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink transition-colors",
              "hover:border-accent",
              "has-checked:border-primary has-checked:bg-primary has-checked:font-semibold has-checked:text-white",
              "has-focus-visible:ring-2 has-focus-visible:ring-primary has-focus-visible:ring-offset-2",
            )}
          >
            <input
              type="radio"
              name={name}
              value={valor}
              required
              className="sr-only"
            />
            {texto}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A checkbox in the shared pill style, used by both multi-choice questions. */
function OpcionMultiple({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "cursor-pointer rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink transition-colors",
        "hover:border-accent",
        "has-checked:border-primary has-checked:bg-primary has-checked:font-semibold has-checked:text-white",
        "has-focus-visible:ring-2 has-focus-visible:ring-primary has-focus-visible:ring-offset-2",
      )}
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
      />
      {children}
    </label>
  );
}

/** One of the three thematic blocks the survey is grouped into. */
function Bloque({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="space-y-6">
      <h2 className="text-lg font-bold tracking-tight text-ink">{titulo}</h2>
      {children}
    </Card>
  );
}

export function EncuestaForm({
  /**
   * Preview mode, for an admin looking at the survey they send to members.
   * The controls stay usable so the form can be read and tried out, but
   * nothing is submitted.
   *
   * This is presentation, NOT the access control: the action re-checks who is
   * calling, and the insert policy would refuse an admin's row regardless.
   * A disabled button is a courtesy to the person, never the lock.
   */
  soloLectura = false,
}: {
  soloLectura?: boolean;
}) {
  // The only piece of UI state: the free-text topic box is revealed by its
  // checkbox. Everything else is read from the form on submit.
  const [otroActivo, setOtroActivo] = useState(false);
  const [enviando, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (soloLectura) return;
    const formData = new FormData(e.currentTarget);

    // Answers are final once sent (there is no edit, by design), so the
    // confirmation is part of the contract with the member, not a formality.
    if (
      !confirm(
        "Una vez enviada, la encuesta no se puede modificar. ¿Querés enviarla?",
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        await enviarEncuesta(formData);
        toast.success("¡Gracias! Recibimos tus respuestas.");
        router.push("/socio");
      } catch {
        toast.error("No se pudo enviar la encuesta. Intentá de nuevo.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Bloque titulo="Sobre la CASC">
        <EscalaField
          name="satisfaccionServicios"
          label="¿Qué tan satisfecho/a estás con los servicios de la CASC?"
          extremos={ESCALA_EXTREMOS.satisfaccion}
        />
        <EscalaField
          name="utilidadComunicacion"
          label="¿Qué tan útil te resulta la información/comunicación que recibís de la Cámara?"
          extremos={ESCALA_EXTREMOS.utilidad}
        />
        <div>
          <Label htmlFor="queMejorarias">
            ¿Qué mejorarías?{" "}
            <span className="font-normal text-ink-muted">(opcional)</span>
          </Label>
          <Textarea
            id="queMejorarias"
            name="queMejorarias"
            maxLength={2000}
            placeholder="Contanos qué cambiarías."
          />
        </div>
      </Bloque>

      <Bloque titulo="Prioridades y participación">
        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-ink">
            ¿Qué temas te gustaría que la CASC priorice este año?
          </legend>
          <div className="flex flex-wrap gap-2">
            {TEMAS_PRIORITARIOS.map((tema) => (
              <OpcionMultiple key={tema} name="temasPrioritarios" value={tema}>
                {tema}
              </OpcionMultiple>
            ))}
            {/*
              "Otro" is not posted as an answer itself — the typed topic is what
              gets stored. The checkbox only reveals the box (see
              `construirTemas`), so it carries no name.
            */}
            <OpcionMultiple
              name=""
              value="otro"
              checked={otroActivo}
              onChange={setOtroActivo}
            >
              Otro
            </OpcionMultiple>
          </div>
          {otroActivo && (
            <input
              type="text"
              name={CAMPO_TEMA_OTRO}
              maxLength={120}
              placeholder="¿Qué otro tema?"
              aria-label="Otro tema a priorizar"
              className="mt-2 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}
        </fieldset>

        <OpcionUnicaField
          name="participacionAcciones"
          label="¿Participarías de próximas acciones comerciales conjuntas?"
          opciones={PARTICIPACION_LABEL}
        />

        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-ink">
            ¿Cómo preferís recibir novedades de la Cámara?
          </legend>
          <div className="flex flex-wrap gap-2">
            {CANALES_NOVEDADES.map((canal) => (
              <OpcionMultiple key={canal} name="canalesPreferidos" value={canal}>
                {canal}
              </OpcionMultiple>
            ))}
          </div>
        </fieldset>
      </Bloque>

      <Bloque titulo="Sobre el portal">
        <EscalaField
          name="facilidadPortal"
          label="¿Qué tan fácil es encontrar lo que buscás en el portal?"
          extremos={ESCALA_EXTREMOS.facilidad}
        />
        <div>
          <Label htmlFor="funcionalidadSugerida">
            ¿Qué funcionalidad te gustaría que se agregue?{" "}
            <span className="font-normal text-ink-muted">(opcional)</span>
          </Label>
          <Textarea
            id="funcionalidadSugerida"
            name="funcionalidadSugerida"
            maxLength={2000}
            placeholder="Contanos qué te gustaría encontrar."
          />
        </div>
        <OpcionUnicaField
          name="dispositivoPrincipal"
          label="¿Abrís el portal desde el celular o desktop, principalmente?"
          opciones={DISPOSITIVO_LABEL}
        />
      </Bloque>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-ink-muted">
          {soloLectura
            ? "Vista previa: las respuestas de una cuenta de administración no se guardan."
            : "Las respuestas no se pueden modificar una vez enviadas."}
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={enviando || soloLectura}
          // Says WHY it cannot be used. A disabled button with no explanation
          // reads as a bug; a hover title turns it into an answer.
          title={
            soloLectura
              ? "La encuesta la responden los socios. Esta cuenta es de administración."
              : undefined
          }
        >
          <Send className="h-4 w-4" aria-hidden />
          {enviando ? "Enviando…" : "Enviar encuesta"}
        </Button>
      </div>
    </form>
  );
}
