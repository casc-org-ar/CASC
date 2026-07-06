"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import type { Informe } from "@/lib/types/domain";
import { createInforme, updateInforme } from "./actions";

interface InformeFormProps {
  informe?: Informe;
  onDone: () => void;
}

export function InformeForm({ informe, onDone }: InformeFormProps) {
  const [pending, startTransition] = useTransition();
  // Mocked upload: picking a file just fills the archivoUrl with a fake path,
  // simulating what Vercel Blob will return once wired up.
  const [archivoUrl, setArchivoUrl] = useState(informe?.archivoUrl ?? "");

  const action = (formData: FormData) =>
    startTransition(async () => {
      if (informe) {
        await updateInforme(informe.id, formData);
      } else {
        await createInforme(formData);
      }
      onDone();
    });

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production this URL comes from the Blob upload response.
      setArchivoUrl(`/mock/${file.name}`);
    }
  };

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
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
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
            defaultValue={informe?.fecha?.slice(0, 10)}
          />
        </FormField>
      </div>

      <FormField label="Archivo PDF" htmlFor="archivo">
        <Input id="archivo" type="file" accept=".pdf" onChange={onFilePick} />
        {/* Carries the mocked/real URL into the submitted form data. */}
        <input type="hidden" name="archivoUrl" value={archivoUrl} />
        {archivoUrl && (
          <p className="mt-1.5 text-xs text-ink-muted">
            Archivo actual: {archivoUrl}
          </p>
        )}
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
