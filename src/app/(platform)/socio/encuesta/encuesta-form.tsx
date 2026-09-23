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
  DISPOSITIVO_LABEL,
  PARTICIPACION_LABEL,
  type EncuestaTextos,
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
   * The wording to render — what CASC has saved, or the original texts. It
   * comes from the server so the form shows the same version the submitted
   * answer will be stamped with; resolving it here could drift between what
   * the member read and what gets stored.
   */
  textos,
  /**
   * The viewer is an admin trying the form out. They submit like anyone else,
   * but their answer is stored as a test and never counts towards CASC's
   * results — so the form says so, in the confirmation and in the footer.
   *
   * This is presentation, NOT the access control: the action decides who is
   * calling and whether the answer is a test, from the session and never from
   * this prop.
   */
  esAdmin = false,
}: {
  textos: EncuestaTextos;
  esAdmin?: boolean;
}) {
  // The only piece of UI state: the free-text topic box is revealed by its
  // checkbox. Everything else is read from the form on submit.
  const [otroActivo, setOtroActivo] = useState(false);
  const [enviando, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Answers are final once sent (there is no edit, by design), so the
    // confirmation is part of the contract with the member, not a formality.
    // An admin is warned about something else entirely: not that it cannot be
    // undone, but that it will not count.
    const aviso = esAdmin
      ? "Se va a guardar como respuesta de prueba y no va a contar en los resultados. ¿Enviar?"
      : "Una vez enviada, la encuesta no se puede modificar. ¿Querés enviarla?";
    if (!confirm(aviso)) return;

    startTransition(async () => {
      try {
        await enviarEncuesta(formData);
        toast.success(
          esAdmin
            ? "Respuesta de prueba enviada. La ves en el panel de la encuesta."
            : "¡Gracias! Recibimos tus respuestas.",
        );
        // An admin lands on the panel, where their test answer now shows —
        // seeing it stored is the whole point of the exercise.
        router.push(esAdmin ? "/admin/encuesta" : "/socio");
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
          label={textos.satisfaccionServicios}
          extremos={{
            min: textos.satisfaccionMin,
            max: textos.satisfaccionMax,
          }}
        />
        <EscalaField
          name="utilidadComunicacion"
          label={textos.utilidadComunicacion}
          extremos={{ min: textos.utilidadMin, max: textos.utilidadMax }}
        />
        <div>
          <Label htmlFor="queMejorarias">
            {textos.queMejorarias}{" "}
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
            {textos.temasPrioritarios}
          </legend>
          <div className="flex flex-wrap gap-2">
            {textos.temasOpciones.map((tema) => (
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
          label={textos.participacionAcciones}
          opciones={PARTICIPACION_LABEL}
        />

        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-ink">
            {textos.canalesPreferidos}
          </legend>
          <div className="flex flex-wrap gap-2">
            {textos.canalesOpciones.map((canal) => (
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
          label={textos.facilidadPortal}
          extremos={{ min: textos.facilidadMin, max: textos.facilidadMax }}
        />
        <div>
          <Label htmlFor="funcionalidadSugerida">
            {textos.funcionalidadSugerida}{" "}
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
          label={textos.dispositivoPrincipal}
          opciones={DISPOSITIVO_LABEL}
        />
      </Bloque>

      {/* Stacks on a phone, sits on one row from `sm` up. `flex-wrap` alone
          wrapped the button onto its own line but left it content-width,
          which on a narrow screen reads as a small, easy-to-miss target for
          the action that ends the whole form. */}
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-muted">
          {esAdmin
            ? "Prueba: se guarda marcada como tal y no entra en los resultados."
            : "Las respuestas no se pueden modificar una vez enviadas."}
        </p>
        {/* Full width on a phone, natural width from `sm` up, where the row
            has the note beside it. `shrink-0` keeps the label from wrapping
            once they share the line. */}
        <Button
          type="submit"
          size="lg"
          disabled={enviando}
          className="w-full sm:w-auto sm:shrink-0"
        >
          <Send className="h-4 w-4" aria-hidden />
          {enviando
            ? "Enviando…"
            : esAdmin
              ? "Enviar prueba"
              : "Enviar encuesta"}
        </Button>
      </div>
    </form>
  );
}
