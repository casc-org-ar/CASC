"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import type { Webinar } from "@/lib/types/domain";
import { createWebinar, updateWebinar } from "./actions";

interface WebinarFormProps {
  /** When present, the form edits this webinar; otherwise it creates. */
  webinar?: Webinar;
  onDone: () => void;
}

export function WebinarForm({ webinar, onDone }: WebinarFormProps) {
  const [pending, startTransition] = useTransition();

  const action = (formData: FormData) =>
    startTransition(async () => {
      if (webinar) {
        await updateWebinar(webinar.id, formData);
      } else {
        await createWebinar(formData);
      }
      onDone();
    });

  return (
    <form action={action} className="space-y-4">
      <FormField label="Título" htmlFor="titulo">
        <Input
          id="titulo"
          name="titulo"
          required
          defaultValue={webinar?.titulo}
          placeholder="Tendencias de consumo retail 2026"
        />
      </FormField>

      <FormField label="Descripción" htmlFor="descripcion">
        <Textarea
          id="descripcion"
          name="descripcion"
          required
          defaultValue={webinar?.descripcion}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Fecha" htmlFor="fecha">
          <Input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={webinar?.fecha?.slice(0, 10)}
          />
        </FormField>
        <FormField label="Categoría" htmlFor="categoria">
          <Input
            id="categoria"
            name="categoria"
            required
            defaultValue={webinar?.categoria}
            placeholder="Retail"
          />
        </FormField>
      </div>

      <FormField label="URL del video (embed YouTube/Vimeo)" htmlFor="videoUrl">
        <Input
          id="videoUrl"
          name="videoUrl"
          type="url"
          required
          defaultValue={webinar?.videoUrl}
          placeholder="https://www.youtube.com/embed/..."
        />
      </FormField>

      <FormField
        label="Material adjunto (URL, opcional)"
        htmlFor="materialAdjuntoUrl"
      >
        <Input
          id="materialAdjuntoUrl"
          name="materialAdjuntoUrl"
          type="url"
          defaultValue={webinar?.materialAdjuntoUrl}
          placeholder="/mock/material.pdf"
        />
      </FormField>

      <FormField label="Estado" htmlFor="status">
        <Select
          id="status"
          name="status"
          defaultValue={webinar?.status ?? "borrador"}
        >
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado</option>
        </Select>
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {webinar ? "Guardar cambios" : "Crear webinar"}
        </Button>
      </div>
    </form>
  );
}
