"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import { FileOrLinkField } from "@/components/ui/file-or-link-field";
import { useToast } from "@/components/ui/toast";
import { cn, todayInBuenosAires } from "@/lib/utils";
import { SOCIO_CATEGORIAS, type Informe } from "@/lib/types/domain";
import { createInforme, updateInforme } from "./actions";

/**
 * Audience a NEW report starts with.
 *
 * Shopping centers only, matching what the section did before reports carried
 * their own audience: the reports CASC publishes are sector statistics, and a
 * new one reaching providers because nobody ticked a box is the failure worth
 * avoiding. Opening it is one click; un-showing something is not.
 */
const CATEGORIAS_POR_DEFECTO = ["shopping"] as const;

interface InformeFormProps {
  informe?: Informe;
  onDone: () => void;
}

export function InformeForm({ informe, onDone }: InformeFormProps) {
  const [pending, startTransition] = useTransition();
  const [archivoUrl, setArchivoUrl] = useState(informe?.archivoUrl ?? "");
  const [portadaUrl, setPortadaUrl] = useState(informe?.portadaUrl ?? "");
  const toast = useToast();

  // An existing report keeps whatever it has, INCLUDING an empty list — that
  // is a deliberate "nobody sees this", and replacing it with the default
  // would silently republish it to shoppings on the next save.
  const categoriasIniciales: readonly string[] =
    informe?.categorias ?? CATEGORIAS_POR_DEFECTO;

  const action = (formData: FormData) =>
    startTransition(async () => {
      try {
        if (informe) {
          await updateInforme(informe.id, formData);
          toast.success("Informe actualizado.");
        } else {
          await createInforme(formData);
          toast.success("Informe creado.");
        }
        onDone();
      } catch {
        toast.error("No se pudo guardar el informe. Intentá de nuevo.");
      }
    });

  return (
    <form action={action} className="space-y-4">
      <FormField label="Título" htmlFor="titulo">
        <Input
          id="titulo"
          name="titulo"
          required
          defaultValue={informe?.titulo}
          placeholder="Reporte anual de afluencia 2025"
        />
      </FormField>

      <FormField label="Descripción" htmlFor="descripcion">
        <Textarea
          id="descripcion"
          name="descripcion"
          required
          defaultValue={informe?.descripcion}
          placeholder="Qué contiene el informe y a qué período corresponde."
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Categoría" htmlFor="categoria">
          <Input
            id="categoria"
            name="categoria"
            required
            defaultValue={informe?.categoria}
            placeholder="Estadísticas"
          />
        </FormField>
        <FormField label="Fecha" htmlFor="fecha">
          <Input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={informe?.fecha?.slice(0, 10) ?? todayInBuenosAires()}
          />
        </FormField>
      </div>

      <FormField label="Archivo PDF" htmlFor="archivoUrl-file">
        <FileOrLinkField
          name="archivoUrl"
          value={archivoUrl}
          onChange={setArchivoUrl}
          kind="pdf"
          accept=".pdf"
          uploadLabel="Subir PDF"
          linkPlaceholder="https://ejemplo.com/informe.pdf"
        />
      </FormField>

      <FormField label="Imagen de portada (opcional)" htmlFor="portadaUrl-file">
        <FileOrLinkField
          name="portadaUrl"
          value={portadaUrl}
          onChange={setPortadaUrl}
          accept="image/*"
          uploadLabel="Subir imagen de portada"
          linkPlaceholder="https://ejemplo.com/portada.jpg"
        />
      </FormField>

      {/* Who sees this report. A group of checkboxes, not a multi-select:
          there are three options, they are all worth seeing at once, and a
          multi-select hides what is NOT ticked behind a scroll — which is the
          half that matters when deciding who to leave out. */}
      <FormField label="¿Qué socios lo ven?">
        <div className="flex flex-wrap gap-2">
          {SOCIO_CATEGORIAS.map((c) => (
            <label
              key={c.value}
              className={cn(
                "cursor-pointer rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink transition-colors",
                "hover:border-accent",
                "has-checked:border-primary has-checked:bg-primary has-checked:font-semibold has-checked:text-white",
                "has-focus-visible:ring-2 has-focus-visible:ring-primary has-focus-visible:ring-offset-2",
              )}
            >
              <input
                type="checkbox"
                name="categorias"
                value={c.value}
                defaultChecked={categoriasIniciales.includes(c.value)}
                className="sr-only"
              />
              {c.label}
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-ink-muted">
          Sin ninguna marcada, el informe no lo ve ningún socio. Sirve para
          sacarlo de circulación sin despublicarlo.
        </p>
      </FormField>

      <FormField label="Estado" htmlFor="status">
        <Select
          id="status"
          name="status"
          defaultValue={informe?.status ?? "borrador"}
        >
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado</option>
        </Select>
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending || !archivoUrl}>
          {informe ? "Guardar cambios" : "Crear informe"}
        </Button>
      </div>
    </form>
  );
}
