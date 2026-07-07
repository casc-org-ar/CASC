"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import type { Newsletter } from "@/lib/types/domain";
import { createNewsletter, updateNewsletter } from "./actions";

interface NewsletterFormProps {
  newsletter?: Newsletter;
  onDone: () => void;
}

export function NewsletterForm({ newsletter, onDone }: NewsletterFormProps) {
  const [pending, startTransition] = useTransition();
  // Mocked upload: picking a file fills adjuntoUrl with a fake path, simulating
  // what Vercel Blob will return once wired up. Uploading the file is the
  // primary path — the email provider may not expose a public campaign link,
  // so the admin always uploads the sent edition (PDF or any file).
  const [adjuntoUrl, setAdjuntoUrl] = useState(newsletter?.adjuntoUrl ?? "");

  const action = (formData: FormData) =>
    startTransition(async () => {
      if (newsletter) {
        await updateNewsletter(newsletter.id, formData);
      } else {
        await createNewsletter(formData);
      }
      onDone();
    });

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production this URL comes from the Blob upload response.
      setAdjuntoUrl(`/mock/${file.name}`);
    }
  };

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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

      <FormField label="Contenido" htmlFor="contenido">
        <Textarea
          id="contenido"
          name="contenido"
          required
          defaultValue={newsletter?.contenido}
          className="min-h-32"
        />
      </FormField>

      <FormField label="Archivo de la edición (PDF)" htmlFor="adjunto">
        <Input
          id="adjunto"
          type="file"
          accept=".pdf,.doc,.docx,image/*"
          onChange={onFilePick}
        />
        {/* Carries the mocked/real upload URL into the submitted form data. */}
        <input type="hidden" name="adjuntoUrl" value={adjuntoUrl} />
        {adjuntoUrl && (
          <p className="mt-1.5 text-xs text-ink-muted">
            Archivo actual: {adjuntoUrl}
          </p>
        )}
        <p className="mt-1.5 text-xs text-ink-muted">
          Subí la edición ya enviada (el PDF exportado desde Mailchimp/emBlue, o
          el archivo que sea). Los socios la descargan desde el archivo.
        </p>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Fecha" htmlFor="fecha">
          <Input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={newsletter?.fecha?.slice(0, 10)}
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
