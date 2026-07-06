"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import type { Noticia } from "@/lib/types/domain";
import { createNoticia, updateNoticia } from "./actions";

interface NoticiaFormProps {
  noticia?: Noticia;
  onDone: () => void;
}

export function NoticiaForm({ noticia, onDone }: NoticiaFormProps) {
  const [pending, startTransition] = useTransition();
  // Mocked image upload: picking a file fills imagenUrl with a fake path.
  const [imagenUrl, setImagenUrl] = useState(noticia?.imagenUrl ?? "");

  const action = (formData: FormData) =>
    startTransition(async () => {
      if (noticia) {
        await updateNoticia(noticia.id, formData);
      } else {
        await createNoticia(formData);
      }
      onDone();
    });

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagenUrl(`/mock/${file.name}`);
  };

  return (
    <form action={action} className="space-y-4">
      <FormField label="Título" htmlFor="titulo">
        <Input id="titulo" name="titulo" required defaultValue={noticia?.titulo} />
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
        />
      </FormField>

      <FormField label="Imagen (opcional)" htmlFor="imagen">
        <Input id="imagen" type="file" accept="image/*" onChange={onFilePick} />
        <input type="hidden" name="imagenUrl" value={imagenUrl} />
        {imagenUrl && (
          <p className="mt-1.5 text-xs text-ink-muted">Imagen: {imagenUrl}</p>
        )}
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Fecha" htmlFor="fecha">
          <Input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={noticia?.fecha?.slice(0, 10)}
          />
        </FormField>
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
      </div>

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
