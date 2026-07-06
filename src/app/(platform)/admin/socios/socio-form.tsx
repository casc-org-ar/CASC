"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select } from "@/components/ui/field";
import type { Socio } from "@/lib/types/domain";
import { createSocio, updateSocio } from "./actions";

interface SocioFormProps {
  socio?: Socio;
  onDone: () => void;
}

export function SocioForm({ socio, onDone }: SocioFormProps) {
  const [pending, startTransition] = useTransition();

  const action = (formData: FormData) =>
    startTransition(async () => {
      if (socio) {
        await updateSocio(socio.id, formData);
      } else {
        await createSocio(formData);
      }
      onDone();
    });

  return (
    <form action={action} className="space-y-4">
      <FormField label="Nombre" htmlFor="nombre">
        <Input id="nombre" name="nombre" required defaultValue={socio?.nombre} />
      </FormField>

      <FormField label="Shopping / Centro comercial" htmlFor="shopping">
        <Input
          id="shopping"
          name="shopping"
          required
          defaultValue={socio?.shopping}
          placeholder="Alto Palermo"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={socio?.email}
          />
        </FormField>
        <FormField label="Cargo (opcional)" htmlFor="cargo">
          <Input id="cargo" name="cargo" defaultValue={socio?.cargo} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Rol" htmlFor="role">
          <Select id="role" name="role" defaultValue={socio?.role ?? "socio"}>
            <option value="socio">Socio</option>
            <option value="admin">Admin</option>
          </Select>
        </FormField>
        <FormField label="Estado" htmlFor="estado">
          <Select
            id="estado"
            name="estado"
            defaultValue={socio?.estado ?? "activo"}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Select>
        </FormField>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {socio ? "Guardar cambios" : "Alta de socio"}
        </Button>
      </div>
    </form>
  );
}
