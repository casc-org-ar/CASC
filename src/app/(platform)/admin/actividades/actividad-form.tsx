"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import { FileOrLinkField } from "@/components/ui/file-or-link-field";
import { useToast } from "@/components/ui/toast";
import type { Actividad } from "@/lib/types/domain";
import { createActividad, updateActividad } from "./actions";

interface ActividadFormProps {
  /** When present, the form edits this activity; otherwise it creates. */
  actividad?: Actividad;
  onDone: () => void;
}

export function ActividadForm({ actividad, onDone }: ActividadFormProps) {
  const [pending, startTransition] = useTransition();
  const [imagen, setImagen] = useState(actividad?.imagen ?? "");
  const toast = useToast();

  const action = (formData: FormData) =>
    startTransition(async () => {
      try {
        if (actividad) {
          await updateActividad(actividad.id, formData);
          toast.success("Actividad actualizada.");
        } else {
          await createActividad(formData);
          toast.success("Actividad creada.");
        }
        onDone();
      } catch {
        toast.error("No se pudo guardar la actividad. Intentá de nuevo.");
      }
    });

  return (
    <form action={action} className="space-y-4">
      <FormField label="Título" htmlFor="titulo">
        <Input
          id="titulo"
          name="titulo"
          required
          defaultValue={actividad?.titulo}
          placeholder="FASE 2026 — Foro Argentino de Shoppings y Experiencias"
        />
      </FormField>

      <FormField label="Slug (opcional — se genera del título)" htmlFor="slug">
        <Input
          id="slug"
          name="slug"
          defaultValue={actividad?.slug}
          placeholder="fase-2026"
        />
      </FormField>

      <FormField label="Descripción" htmlFor="descripcion">
        <Textarea
          id="descripcion"
          name="descripcion"
          required
          defaultValue={actividad?.descripcion}
          placeholder="Resumen breve que se muestra en la card."
        />
      </FormField>

      <FormField label="Contenido completo (opcional)" htmlFor="cuerpo">
        <Textarea
          id="cuerpo"
          name="cuerpo"
          defaultValue={actividad?.cuerpo}
          className="min-h-40"
          placeholder="Texto ampliado para la página de detalle de la actividad."
        />
      </FormField>

      <FormField label="Imagen (opcional)" htmlFor="imagen-file">
        <FileOrLinkField
          name="imagen"
          value={imagen}
          onChange={setImagen}
          accept="image/*"
          uploadLabel="Subir imagen"
          linkPlaceholder="https://ejemplo.com/imagen.jpg"
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Fecha (opcional)" htmlFor="fecha">
          <Input
            id="fecha"
            name="fecha"
            defaultValue={actividad?.fecha}
            placeholder="28 de mayo de 2026"
          />
        </FormField>
        <FormField label="Lugar / formato (opcional)" htmlFor="lugar">
          <Input
            id="lugar"
            name="lugar"
            defaultValue={actividad?.lugar}
            placeholder="Auditorio Plaza Galicia, CABA / Online"
          />
        </FormField>
      </div>

      <FormField
        label="Link de inscripción o info (opcional)"
        htmlFor="inscripcionUrl"
      >
        <Input
          id="inscripcionUrl"
          name="inscripcionUrl"
          type="url"
          defaultValue={actividad?.inscripcionUrl}
          placeholder="https://…"
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="¿Dónde se muestra?" htmlFor="visibilidad">
          <Select
            id="visibilidad"
            name="visibilidad"
            defaultValue={actividad?.visibilidad ?? "ambos"}
          >
            <option value="ambos">Socios y sitio público</option>
            <option value="publico">Solo sitio público</option>
            <option value="socios">Solo panel de socios</option>
          </Select>
        </FormField>
        <FormField label="Estado" htmlFor="status">
          <Select
            id="status"
            name="status"
            defaultValue={actividad?.status ?? "borrador"}
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
          {actividad ? "Guardar cambios" : "Crear actividad"}
        </Button>
      </div>
    </form>
  );
}
