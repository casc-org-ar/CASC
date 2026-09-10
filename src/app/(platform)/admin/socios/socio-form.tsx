"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import type { Socio } from "@/lib/types/domain";
import { SOCIO_CATEGORIAS } from "@/lib/types/domain";
import { createSocio, updateSocio } from "./actions";

interface SocioFormProps {
  socio?: Socio;
  onDone: () => void;
  /** Called after a successful alta with the invited email, so the parent can notify the admin. */
  onAlta?: (email: string) => void;
}

export function SocioForm({ socio, onDone, onAlta }: SocioFormProps) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const action = (formData: FormData) =>
    startTransition(async () => {
      try {
        if (socio) {
          const result = await updateSocio(socio.id, formData);
          // The row saved either way; what may have failed is pushing the new
          // role to the identity provider. Reporting a plain success would tell
          // the admin the member's permissions changed when they did not.
          if (result.roleSyncFailed) {
            toast.error(
              "Se guardaron los datos, pero no pudimos aplicar el cambio de rol. Volvé a intentarlo.",
            );
          } else {
            toast.success("Socio actualizado.");
          }
        } else {
          const result = await createSocio(formData);
          toast.success("Socio dado de alta.");
          if (result.invitacionEnviada) onAlta?.(result.email);
        }
        onDone();
      } catch {
        toast.error("No se pudo guardar el socio. Intentá de nuevo.");
      }
    });

  return (
    <form action={action} className="space-y-4">
      <FormField label="Nombre" htmlFor="nombre">
        <Input id="nombre" name="nombre" required defaultValue={socio?.nombre} />
      </FormField>

      <FormField label="Empresa" htmlFor="shopping">
        <Input
          id="shopping"
          name="shopping"
          required
          defaultValue={socio?.shopping}
          placeholder="Alto Palermo"
        />
      </FormField>

      {/*
        No default on alta: an empty first option forces a deliberate choice.
        A pre-selected category is easy to skip past when loading a provider,
        and the mistake stays invisible until that member sees a section
        reserved for shopping centers.
      */}
      <FormField label="Tipo de socio" htmlFor="categoria">
        <Select
          id="categoria"
          name="categoria"
          required
          defaultValue={socio?.categoria ?? ""}
        >
          <option value="" disabled>
            Seleccioná una opción
          </option>
          {SOCIO_CATEGORIAS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      {!socio && (
        <p className="rounded-md border border-border bg-surface px-3 py-2 text-xs text-ink-muted">
          Al dar de alta, se enviará automáticamente una invitación por email
          para que el socio complete su registro.
        </p>
      )}

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
