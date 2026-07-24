"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { areasInteres } from "@/lib/data/bolsa-trabajo";
import type { Candidato } from "@/lib/types/domain";
import { updateCandidato } from "./actions";

interface CandidatoFormProps {
  candidato: Candidato;
  onDone: () => void;
}

/**
 * Admin edit form. Candidates come from the public landing; here the admin
 * corrects data and sets moderation status. Skills are edited as a
 * comma-separated field — the action splits them back into an array.
 */
export function CandidatoForm({ candidato, onDone }: CandidatoFormProps) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const action = (formData: FormData) =>
    startTransition(async () => {
      try {
        // Split the comma-separated skills into repeated form entries the
        // action expects (getAll("skills")).
        const skillsRaw = String(formData.get("skills-csv") ?? "");
        formData.delete("skills-csv");
        for (const s of skillsRaw
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)) {
          formData.append("skills", s);
        }
        await updateCandidato(candidato.id, formData);
        toast.success("Candidato actualizado.");
        onDone();
      } catch {
        toast.error("No se pudo guardar el candidato.");
      }
    });

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre" htmlFor="nombre">
          <Input id="nombre" name="nombre" required defaultValue={candidato.nombre} />
        </FormField>
        <FormField label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={candidato.email}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Teléfono" htmlFor="telefono">
          <Input id="telefono" name="telefono" defaultValue={candidato.telefono} />
        </FormField>
        <FormField label="Puesto buscado" htmlFor="puestoBuscado">
          <Input
            id="puestoBuscado"
            name="puestoBuscado"
            required
            defaultValue={candidato.puestoBuscado}
          />
        </FormField>
      </div>

      <FormField label="Área de interés" htmlFor="areaInteres">
        <Select
          id="areaInteres"
          name="areaInteres"
          defaultValue={candidato.areaInteres}
        >
          {areasInteres.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label="Habilidades (separadas por coma)"
        htmlFor="skills-csv"
      >
        <Input
          id="skills-csv"
          name="skills-csv"
          defaultValue={candidato.skills.join(", ")}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Ciudad" htmlFor="ciudad">
          <Input id="ciudad" name="ciudad" defaultValue={candidato.ciudad} />
        </FormField>
        <FormField label="Provincia" htmlFor="provincia">
          <Input id="provincia" name="provincia" defaultValue={candidato.provincia} />
        </FormField>
      </div>

      <FormField label="Estado" htmlFor="status">
        <Select id="status" name="status" defaultValue={candidato.status}>
          <option value="borrador">Pendiente (oculto)</option>
          <option value="publicado">Publicado</option>
        </Select>
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
