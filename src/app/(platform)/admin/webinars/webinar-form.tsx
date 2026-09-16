"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import { FileOrLinkField } from "@/components/ui/file-or-link-field";
import { useToast } from "@/components/ui/toast";
import { todayInBuenosAires } from "@/lib/utils";
import type { ArchivoAdjunto, Webinar } from "@/lib/types/domain";
import { createWebinar, updateWebinar } from "./actions";

/** Cap mirrors the schema so the UI stops offering rows the save would reject. */
const MAX_ADJUNTOS = 20;

interface WebinarFormProps {
  /** When present, the form edits this webinar; otherwise it creates. */
  webinar?: Webinar;
  onDone: () => void;
}

export function WebinarForm({ webinar, onDone }: WebinarFormProps) {
  const [pending, startTransition] = useTransition();
  const [portadaUrl, setPortadaUrl] = useState(webinar?.portadaUrl ?? "");
  // A webinar usually ships with more than one file (the deck plus an annexed
  // report), so the material is a list, not a single slot.
  const [adjuntos, setAdjuntos] = useState<ArchivoAdjunto[]>(
    webinar?.adjuntos ?? [],
  );
  const toast = useToast();

  const addAdjunto = () =>
    setAdjuntos((rows) =>
      rows.length >= MAX_ADJUNTOS ? rows : [...rows, { titulo: "", url: "" }],
    );

  const removeAdjunto = (index: number) =>
    setAdjuntos((rows) => rows.filter((_, i) => i !== index));

  const patchAdjunto = (index: number, patch: Partial<ArchivoAdjunto>) =>
    setAdjuntos((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );

  const action = (formData: FormData) =>
    startTransition(async () => {
      try {
        if (webinar) {
          await updateWebinar(webinar.id, formData);
          toast.success("Webinar actualizado.");
        } else {
          await createWebinar(formData);
          toast.success("Webinar creado.");
        }
        onDone();
      } catch {
        toast.error("No se pudo guardar el webinar. Intentá de nuevo.");
      }
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
          placeholder="De qué trata el webinar, temas y expositores."
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Fecha" htmlFor="fecha">
          <Input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={webinar?.fecha?.slice(0, 10) ?? todayInBuenosAires()}
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

      <FormField label="Material adjunto (opcional)">
        <div className="space-y-3">
          {adjuntos.length > 0 && (
            <ul className="space-y-3">
              {adjuntos.map((adjunto, idx) => (
                <li
                  key={idx}
                  className="rounded-md border border-border bg-white p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">
                      Archivo {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAdjunto(idx)}
                      aria-label={`Quitar material adjunto ${idx + 1}`}
                      className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <Input
                    aria-label={`Nombre del material adjunto ${idx + 1}`}
                    value={adjunto.titulo}
                    onChange={(e) =>
                      patchAdjunto(idx, { titulo: e.target.value })
                    }
                    placeholder="Ej: Presentación del webinar"
                    className="mb-2"
                  />

                  <FileOrLinkField
                    name={`adjuntos-${idx}-url`}
                    value={adjunto.url}
                    onChange={(url) => patchAdjunto(idx, { url })}
                    kind="pdf"
                    accept=".pdf"
                    uploadLabel="Subir PDF"
                    linkPlaceholder="https://ejemplo.com/material.pdf"
                  />
                </li>
              ))}
            </ul>
          )}

          {adjuntos.length < MAX_ADJUNTOS && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={addAdjunto}
            >
              <Plus className="h-4 w-4" />
              Agregar material
            </Button>
          )}

          <p className="text-xs text-ink-muted">
            Sumá acá la presentación y todo otro material del webinar. Cada
            archivo puede subirse o enlazarse, y el nombre es el que ven los
            socios en el botón de descarga.
          </p>

          {/* Carries the rows into the submitted form data as a JSON array. */}
          <input
            type="hidden"
            name="adjuntos"
            value={JSON.stringify(adjuntos)}
          />
        </div>
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
