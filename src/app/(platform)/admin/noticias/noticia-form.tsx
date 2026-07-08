"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import { FileOrLinkField } from "@/components/ui/file-or-link-field";
import { useToast } from "@/components/ui/toast";
import { todayInBuenosAires } from "@/lib/utils";
import type { Noticia } from "@/lib/types/domain";
import { createNoticia, updateNoticia } from "./actions";

interface NoticiaFormProps {
  noticia?: Noticia;
  onDone: () => void;
}

export function NoticiaForm({ noticia, onDone }: NoticiaFormProps) {
  const [pending, startTransition] = useTransition();
  const [imagenUrl, setImagenUrl] = useState(noticia?.imagenUrl ?? "");
  const toast = useToast();

  const action = (formData: FormData) =>
    startTransition(async () => {
      try {
        if (noticia) {
          await updateNoticia(noticia.id, formData);
          toast.success("Noticia actualizada.");
        } else {
          await createNoticia(formData);
          toast.success("Noticia creada.");
        }
        onDone();
      } catch {
        toast.error("No se pudo guardar la noticia. Intentá de nuevo.");
      }
    });

  return (
    <form action={action} className="space-y-4">
      <FormField label="Título" htmlFor="titulo">
        <Input
          id="titulo"
          name="titulo"
          required
          defaultValue={noticia?.titulo}
          placeholder="CASC firma acuerdo con la Secretaría de Comercio"
        />
      </FormField>

      <FormField label="Bajada" htmlFor="bajada">
        <Input
          id="bajada"
          name="bajada"
          required
          defaultValue={noticia?.bajada}
          placeholder="Resumen breve de la noticia"
        />
      </FormField>

      <FormField label="Cuerpo" htmlFor="cuerpo">
        <Textarea
          id="cuerpo"
          name="cuerpo"
          required
          defaultValue={noticia?.cuerpo}
          className="min-h-40"
          placeholder="Desarrollá el contenido de la noticia."
        />
      </FormField>

      <FormField label="Imagen (opcional)" htmlFor="imagenUrl-file">
        <FileOrLinkField
          name="imagenUrl"
          value={imagenUrl}
          onChange={setImagenUrl}
          accept="image/*"
          uploadLabel="Subir imagen"
          linkPlaceholder="https://ejemplo.com/imagen.jpg"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Categoría (opcional)" htmlFor="categoria">
          <Input
            id="categoria"
            name="categoria"
            defaultValue={noticia?.categoria}
            placeholder="Institucional"
          />
        </FormField>
        <FormField label="Fecha" htmlFor="fecha">
          <Input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={noticia?.fecha?.slice(0, 10) ?? todayInBuenosAires()}
          />
        </FormField>
      </div>

      <FormField label="Estado" htmlFor="status">
        <Select
          id="status"
          name="status"
          defaultValue={noticia?.status ?? "borrador"}
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
          {noticia ? "Guardar cambios" : "Crear noticia"}
        </Button>
      </div>
    </form>
  );
}
