"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import type { EncuestaTextos } from "@/lib/types/domain";
import { guardarTextos } from "./actions";

/**
 * Editor for the survey's wording.
 *
 * Edits how the survey READS — the nine questions and their types are fixed
 * columns on `encuesta_respuestas`. That limit is stated on the page rather
 * than left to be discovered: an admin who expects to add a question here
 * should find out before writing one.
 *
 * Answers already stored are untouched by anything done here. Each carries the
 * wording its author read, so rewording a question never reinterprets what a
 * member already said.
 */

/** A labelled single-line field. */
function Campo({
  name,
  label,
  defaultValue,
  hint,
  maxLength = 300,
}: {
  name: string;
  label: string;
  defaultValue: string;
  hint?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue}
        maxLength={maxLength}
        required
      />
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

/** The two endpoints of a 1-5 scale, side by side. */
function Extremos({
  nameMin,
  nameMax,
  min,
  max,
}: {
  nameMin: string;
  nameMax: string;
  min: string;
  max: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Campo name={nameMin} label="Extremo 1 (bajo)" defaultValue={min} maxLength={40} />
      <Campo name={nameMax} label="Extremo 5 (alto)" defaultValue={max} maxLength={40} />
    </div>
  );
}

/**
 * The options of a choice question, one per line.
 *
 * A textarea rather than a repeatable row widget: these lists are four items
 * long, and typing four lines beats clicking "add" four times. The warning is
 * not decoration — removing an option does NOT remove it from answers already
 * given, and an admin who assumes otherwise would misread their own results.
 */
function Opciones({
  name,
  label,
  valor,
}: {
  name: string;
  label: string;
  valor: string[];
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={valor.join("\n")}
        rows={Math.max(4, valor.length + 1)}
        className="font-mono text-xs"
      />
      <p className="mt-1 text-xs text-ink-muted">
        Una opción por línea. Si sacás una opción, las respuestas que ya la
        eligieron la conservan: dejan de ofrecerse, no se borran.
      </p>
    </div>
  );
}

/** One thematic block of the editor, mirroring the survey's own sections. */
function Bloque({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="space-y-5">
      <CardTitle>{titulo}</CardTitle>
      {children}
    </Card>
  );
}

export function TextosForm({ textos }: { textos: EncuestaTextos }) {
  const [guardando, startTransition] = useTransition();
  // Tracks whether anything was typed, so the page can say it has unsaved
  // work instead of letting the admin walk away assuming it saved.
  const [sucio, setSucio] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await guardarTextos(formData);
        setSucio(false);
        toast.success("Textos actualizados.");
        router.push("/admin/encuesta");
      } catch {
        // The schema rejects blank questions and duplicate options, so a
        // failure here is usually one of those — the message says where to
        // look rather than blaming the connection.
        toast.error(
          "No se pudieron guardar. Revisá que ninguna pregunta quede vacía y que no haya opciones repetidas.",
        );
      }
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      onChange={() => setSucio(true)}
      className="space-y-6"
    >
      <Bloque titulo="Presentación">
        <Campo
          name="titulo"
          label="Título de la página"
          defaultValue={textos.titulo}
          maxLength={120}
        />
        <Campo
          name="subtitulo"
          label="Texto introductorio"
          defaultValue={textos.subtitulo}
        />
        <Campo
          name="ctaTitulo"
          label="Título del aviso en el inicio"
          defaultValue={textos.ctaTitulo}
          maxLength={120}
          hint="Es el banner que invita a responder desde el panel del socio."
        />
        <Campo
          name="ctaDescripcion"
          label="Texto del aviso en el inicio"
          defaultValue={textos.ctaDescripcion}
        />
      </Bloque>

      <Bloque titulo="Sobre la CASC">
        <Campo
          name="satisfaccionServicios"
          label="Pregunta 1 — escala 1 a 5"
          defaultValue={textos.satisfaccionServicios}
        />
        <Extremos
          nameMin="satisfaccionMin"
          nameMax="satisfaccionMax"
          min={textos.satisfaccionMin}
          max={textos.satisfaccionMax}
        />
        <Campo
          name="utilidadComunicacion"
          label="Pregunta 2 — escala 1 a 5"
          defaultValue={textos.utilidadComunicacion}
        />
        <Extremos
          nameMin="utilidadMin"
          nameMax="utilidadMax"
          min={textos.utilidadMin}
          max={textos.utilidadMax}
        />
        <Campo
          name="queMejorarias"
          label="Pregunta 3 — respuesta abierta"
          defaultValue={textos.queMejorarias}
        />
      </Bloque>

      <Bloque titulo="Prioridades y participación">
        <Campo
          name="temasPrioritarios"
          label="Pregunta 4 — elección múltiple"
          defaultValue={textos.temasPrioritarios}
        />
        <Opciones
          name="temasOpciones"
          label="Opciones de temas"
          valor={textos.temasOpciones}
        />
        <Campo
          name="participacionAcciones"
          label="Pregunta 5 — Sí / No / Depende"
          defaultValue={textos.participacionAcciones}
          hint="Las tres respuestas posibles son fijas; solo se edita el enunciado."
        />
        <Campo
          name="canalesPreferidos"
          label="Pregunta 6 — elección múltiple"
          defaultValue={textos.canalesPreferidos}
        />
        <Opciones
          name="canalesOpciones"
          label="Opciones de canales"
          valor={textos.canalesOpciones}
        />
      </Bloque>

      <Bloque titulo="Sobre el portal">
        <Campo
          name="facilidadPortal"
          label="Pregunta 7 — escala 1 a 5"
          defaultValue={textos.facilidadPortal}
        />
        <Extremos
          nameMin="facilidadMin"
          nameMax="facilidadMax"
          min={textos.facilidadMin}
          max={textos.facilidadMax}
        />
        <Campo
          name="funcionalidadSugerida"
          label="Pregunta 8 — respuesta abierta"
          defaultValue={textos.funcionalidadSugerida}
        />
        <Campo
          name="dispositivoPrincipal"
          label="Pregunta 9 — Celular / Desktop"
          defaultValue={textos.dispositivoPrincipal}
          hint="Las dos respuestas posibles son fijas; solo se edita el enunciado."
        />
      </Bloque>

      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-muted">
          {sucio
            ? "Tenés cambios sin guardar."
            : "Los cambios se ven en la encuesta apenas guardás."}
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={guardando}
          className="w-full sm:w-auto sm:shrink-0"
        >
          <Save className="h-4 w-4" aria-hidden />
          {guardando ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
