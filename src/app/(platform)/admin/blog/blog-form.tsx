"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import type { BlogPost } from "@/lib/types/domain";
import { createBlogPost, updateBlogPost } from "./actions";

interface BlogFormProps {
  post?: BlogPost;
  onDone: () => void;
}

export function BlogForm({ post, onDone }: BlogFormProps) {
  const [pending, startTransition] = useTransition();
  // Mocked cover upload: picking a file fills portadaUrl with a fake path.
  const [portadaUrl, setPortadaUrl] = useState(post?.portadaUrl ?? "");

  const action = (formData: FormData) =>
    startTransition(async () => {
      if (post) {
        await updateBlogPost(post.id, formData);
      } else {
        await createBlogPost(formData);
      }
      onDone();
    });

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPortadaUrl(`/mock/${file.name}`);
  };

  return (
    <form action={action} className="space-y-4">
      <FormField label="Título" htmlFor="titulo">
        <Input id="titulo" name="titulo" required defaultValue={post?.titulo} />
      </FormField>

      <FormField label="Slug (opcional — se genera del título)" htmlFor="slug">
        <Input
          id="slug"
          name="slug"
          defaultValue={post?.slug}
          placeholder="futuro-retail-experiencial"
        />
      </FormField>

      <FormField label="Bajada" htmlFor="bajada">
        <Input id="bajada" name="bajada" required defaultValue={post?.bajada} />
      </FormField>

      <FormField label="Cuerpo" htmlFor="cuerpo">
        <Textarea
          id="cuerpo"
          name="cuerpo"
          required
          defaultValue={post?.cuerpo}
          className="min-h-48"
        />
      </FormField>

      <FormField label="Imagen de portada (opcional)" htmlFor="portada">
        <Input id="portada" type="file" accept="image/*" onChange={onFilePick} />
        <input type="hidden" name="portadaUrl" value={portadaUrl} />
        {portadaUrl && (
          <p className="mt-1.5 text-xs text-ink-muted">Portada: {portadaUrl}</p>
        )}
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Autor" htmlFor="autor">
          <Input
            id="autor"
            name="autor"
            required
            defaultValue={post?.autor ?? "Equipo CASC"}
          />
        </FormField>
        <FormField label="Tags (separados por coma)" htmlFor="tags">
          <Input
            id="tags"
            name="tags"
            defaultValue={post?.tags.join(", ")}
            placeholder="retail, tendencias"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Fecha" htmlFor="fecha">
          <Input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={post?.fecha?.slice(0, 10)}
          />
        </FormField>
        <FormField label="Estado" htmlFor="status">
          <Select
            id="status"
            name="status"
            defaultValue={post?.status ?? "borrador"}
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
          {post ? "Guardar cambios" : "Crear artículo"}
        </Button>
      </div>
    </form>
  );
}
