"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import { FileOrLinkField } from "@/components/ui/file-or-link-field";
import { useToast } from "@/components/ui/toast";
import { todayInBuenosAires } from "@/lib/utils";
import type { Newsletter } from "@/lib/types/domain";
import { createNewsletter, updateNewsletter } from "./actions";

interface NewsletterFormProps {
  newsletter?: Newsletter;
  onDone: () => void;
}

export function NewsletterForm({ newsletter, onDone }: NewsletterFormProps) {
  const [pending, startTransition] = useTransition();
  // The edition lives in a file (PDF exported from the email provider) or, when
  // the provider exposes a public campaign link, in that link.
  const [adjuntoUrl, setAdjuntoUrl] = useState(newsletter?.adjuntoUrl ?? "");
  const toast = useToast();

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
