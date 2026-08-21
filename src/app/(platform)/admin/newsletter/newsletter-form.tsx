"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import { FileOrLinkField } from "@/components/ui/file-or-link-field";
import { useToast } from "@/components/ui/toast";
import { todayInBuenosAires } from "@/lib/utils";
import type { Newsletter, NewsletterAdjunto } from "@/lib/types/domain";
import { createNewsletter, updateNewsletter } from "./actions";

/** Cap mirrors the schema so the UI stops offering rows the save would reject. */
const MAX_ADJUNTOS = 20;

interface NewsletterFormProps {
  newsletter?: Newsletter;
  onDone: () => void;
}

export function NewsletterForm({ newsletter, onDone }: NewsletterFormProps) {
  const [pending, startTransition] = useTransition();
  // The edition lives in a file (PDF exported from the email provider) or, when
  // the provider exposes a public campaign link, in that link.
  const [adjuntoUrl, setAdjuntoUrl] = useState(newsletter?.adjuntoUrl ?? "");
  // Extras published with the edition (the magazine, an annex). Optional and
  // repeatable: an edition may ship none, one, or several.
  const [adjuntos, setAdjuntos] = useState<NewsletterAdjunto[]>(
    newsletter?.adjuntos ?? [],
  );
  const toast = useToast();

  const addAdjunto = () =>
    setAdjuntos((rows) =>
      rows.length >= MAX_ADJUNTOS ? rows : [...rows, { titulo: "", url: "" }],
    );

  const removeAdjunto = (index: number) =>
    setAdjuntos((rows) => rows.filter((_, i) => i !== index));

  const patchAdjunto = (index: number, patch: Partial<NewsletterAdjunto>) =>
    setAdjuntos((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );

  const action = (formData: FormData) =>
    startTransition(async () => {
      try {
        if (newsletter) {
          await updateNewsletter(newsletter.id, formData);
          toast.success("Edición actualizada.");
        } else {
          await createNewsletter(formData);
          toast.success("Edición creada.");
        }
        onDone();
      } catch {
        toast.error("No se pudo guardar la edición. Intentá de nuevo.");
      }
    });

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Título" htmlFor="titulo">
          <Input
            id="titulo"
            name="titulo"
            required
            defaultValue={newsletter?.titulo}
          />
        </FormField>
        <FormField label="Edición" htmlFor="edicion">
          <Input
            id="edicion"
            name="edicion"
            required
            defaultValue={newsletter?.edicion}
            placeholder="N° 42"
          />
        </FormField>
      </div>

      <FormField label="Resumen breve (opcional)" htmlFor="contenido">
        <Textarea
          id="contenido"
          name="contenido"
          defaultValue={newsletter?.contenido}
          className="min-h-20"
          placeholder="Ej: Resumen de actividades y novedades de junio (aparece en la tarjeta del listado)."
        />
      </FormField>

      <FormField label="Archivo de la edición" htmlFor="adjuntoUrl-file">
        <FileOrLinkField
          name="adjuntoUrl"
          value={adjuntoUrl}
          onChange={setAdjuntoUrl}
          accept=".pdf,.doc,.docx,image/*"
          uploadLabel="Subir archivo (PDF)"
          linkPlaceholder="https://mailchi.mp/…"
          hint="Subí la edición ya enviada (el PDF exportado desde Mailchimp/emBlue) o pegá el link público de la campaña. Los socios la abren desde el archivo."
        />
      </FormField>

      <FormField label="Archivos adicionales (opcional)">
        <div className="space-y-3">
          {adjuntos.length > 0 && (
            <ul className="space-y-3">
              {adjuntos.map((adjunto, idx) => (
                <li
                  key={idx}
                  className="rounded-md border border-border bg-white p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Archivo {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAdjunto(idx)}
                      aria-label={`Quitar archivo adicional ${idx + 1}`}
                      className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <Input
                    aria-label={`Nombre del archivo adicional ${idx + 1}`}
                    value={adjunto.titulo}
                    onChange={(e) =>
                      patchAdjunto(idx, { titulo: e.target.value })
                    }
                    placeholder="Ej: Revista N° 12"
                    className="mb-2"
                  />

                  <FileOrLinkField
                    name={`adjuntos-${idx}-url`}
                    value={adjunto.url}
                    onChange={(url) => patchAdjunto(idx, { url })}
                    accept=".pdf,.doc,.docx,image/*"
                    uploadLabel="Subir archivo"
                    linkPlaceholder="https://…"
                  />
                </li>
              ))}
            </ul>
          )}

          {adjuntos.length < MAX_ADJUNTOS && (
            <Button type="button" variant="secondary" onClick={addAdjunto}>
              <Plus className="h-4 w-4" />
              Agregar archivo
            </Button>
          )}

          <p className="text-xs text-ink-muted">
            Sumá acá la revista u otros materiales que se publican junto con la
            edición. Cada archivo puede subirse o enlazarse, y el nombre es el
            que ven los socios.
          </p>

          {/* Carries the rows into the submitted form data as a JSON array. */}
          <input
            type="hidden"
            name="adjuntos"
            value={JSON.stringify(adjuntos)}
          />
        </div>
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Fecha" htmlFor="fecha">
          <Input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={newsletter?.fecha?.slice(0, 10) ?? todayInBuenosAires()}
          />
        </FormField>
        <FormField label="Estado" htmlFor="status">
          <Select
            id="status"
            name="status"
            defaultValue={newsletter?.status ?? "borrador"}
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
          {newsletter ? "Guardar cambios" : "Crear edición"}
        </Button>
      </div>
    </form>
  );
}
