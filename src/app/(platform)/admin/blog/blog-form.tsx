"use client";

import { Eye, Loader2, Trash2, Upload } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import { FileOrLinkField } from "@/components/ui/file-or-link-field";
import { useToast } from "@/components/ui/toast";
import { uploadContentImage } from "@/lib/actions/upload-image";
import {
  compressImage,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
} from "@/lib/utils/image-compress";
import { todayInBuenosAires } from "@/lib/utils";
import type { BlogPost } from "@/lib/types/domain";
import { createBlogPost, updateBlogPost } from "./actions";
import { BlogPreview, type BlogDraft } from "./blog-preview";

interface BlogFormProps {
  post?: BlogPost;
  onDone: () => void;
  /**
   * Optional controlled preview state. When provided, the parent owns the
   * toggle (e.g. to render the "Vista previa" button in the modal header).
   * When omitted, the form manages preview with its own internal state.
   */
  preview?: boolean;
  onPreviewChange?: (preview: boolean) => void;
}

export function BlogForm({
  post,
  onDone,
  preview: previewProp,
  onPreviewChange,
}: BlogFormProps) {
  const [pending, startTransition] = useTransition();
  // Cover image: an uploaded public URL (Supabase Storage) or a pasted link.
  const [portadaUrl, setPortadaUrl] = useState(post?.portadaUrl ?? "");
  // Gallery images: each an uploaded public URL or a pasted link.
  const [imagenes, setImagenes] = useState<string[]>(post?.imagenes ?? []);
  const [nuevoLink, setNuevoLink] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);
  // Preview: controlled by the parent when props are passed, otherwise local.
  const [previewLocal, setPreviewLocal] = useState(false);
  const preview = previewProp ?? previewLocal;
  const setPreview = onPreviewChange ?? setPreviewLocal;
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

  const onGalleryPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setGalleryUploading(true);
    try {
      for (const file of files) {
        // Reject an oversized original up front, with the reason and its size.
        if (file.size > MAX_UPLOAD_BYTES) {
          const mb = (file.size / (1024 * 1024)).toFixed(1);
          toast.error(
            `"${file.name}" pesa ${mb} MB. El máximo es ${MAX_UPLOAD_MB} MB.`,
          );
          continue;
        }
        const optimized = await compressImage(file);
        const fd = new FormData();
        fd.set("file", optimized);
        const result = await uploadContentImage(fd);
        if (result.ok) {
          setImagenes((prev) => [...prev, result.url]);
        } else {
          toast.error(result.error);
        }
      }
    } finally {
      setGalleryUploading(false);
    }
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
              className={
                galleryUploading
                  ? "flex cursor-wait items-center gap-2 rounded-md border border-dashed border-border bg-surface px-4 py-2 text-sm font-medium text-ink opacity-70"
                  : "flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-primary hover:bg-white"
              }
            >
              {galleryUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Subiendo…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 text-primary" />
                  Subir imágenes
                </>
              )}
            </label>
            <input
              id="galeria"
              type="file"
              accept="image/*"
              multiple
              disabled={galleryUploading}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <FormField label="¿Dónde se muestra?" htmlFor="visibilidad">
        <Select
          id="visibilidad"
          name="visibilidad"
          defaultValue={post?.visibilidad ?? "ambos"}
        >
          <option value="ambos">Socios y sitio público</option>
          <option value="socios">Solo panel de socios</option>
          <option value="publico">Solo sitio público (Noticias)</option>
        </Select>
        <p className="mt-1.5 text-xs text-ink-muted">
          Elegí si el artículo aparece en el panel de socios, en el sitio web
          público (Noticias), o en ambos.
        </p>
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
