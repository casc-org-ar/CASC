"use client";

import { Eye, Trash2, Upload } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import { FileOrLinkField } from "@/components/ui/file-or-link-field";
import { useToast } from "@/components/ui/toast";
import { todayInBuenosAires } from "@/lib/utils";
import type { BlogPost } from "@/lib/types/domain";
import { createBlogPost, updateBlogPost } from "./actions";
import { BlogPreview, type BlogDraft } from "./blog-preview";

interface BlogFormProps {
  post?: BlogPost;
  onDone: () => void;
}

export function BlogForm({ post, onDone }: BlogFormProps) {
  const [pending, startTransition] = useTransition();
  // Mocked cover upload: picking a file fills portadaUrl with a fake path.
  const [portadaUrl, setPortadaUrl] = useState(post?.portadaUrl ?? "");
  // Gallery images: each can be an uploaded file (mocked path) or a pasted link.
  const [imagenes, setImagenes] = useState<string[]>(post?.imagenes ?? []);
  const [nuevoLink, setNuevoLink] = useState("");
  const [preview, setPreview] = useState(false);
  const toast = useToast();

  // Live draft mirrors the controlled fields so the preview reflects them.
  const [draft, setDraft] = useState<BlogDraft>({
    titulo: post?.titulo ?? "",
    bajada: post?.bajada ?? "",
    cuerpo: post?.cuerpo ?? "",
    autor: post?.autor ?? "Equipo CASC",
    fecha: post?.fecha?.slice(0, 10) ?? todayInBuenosAires(),
  });

  const action = (formData: FormData) =>
    startTransition(async () => {
      try {
        if (post) {
          await updateBlogPost(post.id, formData);
          toast.success("Artículo actualizado.");
        } else {
          await createBlogPost(formData);
          toast.success("Artículo creado.");
        }
        onDone();
      } catch {
        toast.error("No se pudo guardar el artículo. Intentá de nuevo.");
      }
    });

  const onGalleryPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) {
      setImagenes((prev) => [...prev, ...files.map((f) => `/mock/${f.name}`)]);
    }
    e.target.value = "";
  };

  const addLink = () => {
    const link = nuevoLink.trim();
    if (link) {
      setImagenes((prev) => [...prev, link]);
      setNuevoLink("");
    }
  };

  const removeImage = (idx: number) =>
    setImagenes((prev) => prev.filter((_, i) => i !== idx));

  if (preview) {
    return (
      <BlogPreview
        draft={draft}
        portadaUrl={portadaUrl}
        imagenes={imagenes}
        onBack={() => setPreview(false)}
      />
    );
  }

  return (
    <form action={action} className="space-y-4">
      <FormField label="Título" htmlFor="titulo">
        <Input
          id="titulo"
          name="titulo"
          required
          defaultValue={post?.titulo}
          placeholder="El futuro del retail experiencial en Argentina"
          onChange={(e) => setDraft((d) => ({ ...d, titulo: e.target.value }))}
        />
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
        <Input
          id="bajada"
          name="bajada"
          required
          defaultValue={post?.bajada}
          placeholder="Cómo los centros comerciales integran tecnología y experiencia."
          onChange={(e) => setDraft((d) => ({ ...d, bajada: e.target.value }))}
        />
      </FormField>

      <FormField label="Cuerpo" htmlFor="cuerpo">
        <Textarea
          id="cuerpo"
          name="cuerpo"
          required
          defaultValue={post?.cuerpo}
          className="min-h-48"
          placeholder="Escribí el contenido del artículo. Podés usar varios párrafos."
          onChange={(e) => setDraft((d) => ({ ...d, cuerpo: e.target.value }))}
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

      <FormField label="Imágenes del artículo (opcional)" htmlFor="galeria">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor="galeria"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-primary hover:bg-white"
            >
              <Upload className="h-4 w-4 text-primary" />
              Subir imágenes
            </label>
            <input
              id="galeria"
              type="file"
              accept="image/*"
              multiple
              onChange={onGalleryPick}
              className="sr-only"
            />
            <div className="flex flex-1 gap-2">
              <Input
                value={nuevoLink}
                onChange={(e) => setNuevoLink(e.target.value)}
                placeholder="…o pegá el link de una imagen"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLink();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addLink}>
                Agregar
              </Button>
            </div>
          </div>

          {imagenes.length > 0 && (
            <ul className="space-y-2">
              {imagenes.map((img, idx) => (
                <li
                  key={`${img}-${idx}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-border bg-white px-3 py-2"
                >
                  <span className="truncate text-sm text-ink-muted">{img}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    aria-label={`Quitar imagen ${idx + 1}`}
                    className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <input
            type="hidden"
            name="imagenes"
            value={JSON.stringify(imagenes)}
          />
        </div>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Autor" htmlFor="autor">
          <Input
            id="autor"
            name="autor"
            required
            defaultValue={post?.autor ?? "Equipo CASC"}
            placeholder="Equipo CASC"
            onChange={(e) => setDraft((d) => ({ ...d, autor: e.target.value }))}
          />
        </FormField>
        <FormField label="Tags (separados por coma)" htmlFor="tags">
          <Input
            id="tags"
            name="tags"
            defaultValue={post?.tags.join(", ")}
            placeholder="retail, tendencias, innovación"
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
            defaultValue={post?.fecha?.slice(0, 10) ?? todayInBuenosAires()}
            onChange={(e) => setDraft((d) => ({ ...d, fecha: e.target.value }))}
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

      <div className="flex justify-between gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={() => setPreview(true)}>
          <Eye className="h-4 w-4" />
          Vista previa
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onDone}>
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>
            {post ? "Guardar cambios" : "Crear artículo"}
          </Button>
        </div>
      </div>
    </form>
  );
}
