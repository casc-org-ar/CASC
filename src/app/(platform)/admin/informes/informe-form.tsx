"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import { FileOrLinkField } from "@/components/ui/file-or-link-field";
import { useToast } from "@/components/ui/toast";
import { todayInBuenosAires } from "@/lib/utils";
import type { Informe } from "@/lib/types/domain";
import { createInforme, updateInforme } from "./actions";

interface InformeFormProps {
  informe?: Informe;
  onDone: () => void;
}

export function InformeForm({ informe, onDone }: InformeFormProps) {
  const [pending, startTransition] = useTransition();
  const [archivoUrl, setArchivoUrl] = useState(informe?.archivoUrl ?? "");
  const [portadaUrl, setPortadaUrl] = useState(informe?.portadaUrl ?? "");
  const toast = useToast();

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
            defaultValue={informe?.fecha?.slice(0, 10) ?? todayInBuenosAires()}
          />
        </FormField>
      </div>

      <FormField label="Archivo PDF" htmlFor="archivoUrl-file">
        <FileOrLinkField
          name="archivoUrl"
          value={archivoUrl}
          onChange={setArchivoUrl}
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
