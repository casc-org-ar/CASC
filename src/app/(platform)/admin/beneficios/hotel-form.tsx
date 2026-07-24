"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/field";
import { FileOrLinkField } from "@/components/ui/file-or-link-field";
import { useToast } from "@/components/ui/toast";
import type { Hotel } from "@/lib/types/domain";
import { createHotel, updateHotel } from "./actions";

interface HotelFormProps {
  hotel?: Hotel;
  onDone: () => void;
}

export function HotelForm({ hotel, onDone }: HotelFormProps) {
  const [pending, startTransition] = useTransition();
  const [logoUrl, setLogoUrl] = useState(hotel?.logoUrl ?? "");
  const toast = useToast();

  const action = (formData: FormData) =>
    startTransition(async () => {
      try {
        if (hotel) {
          await updateHotel(hotel.id, formData);
          toast.success("Hotel actualizado.");
        } else {
          await createHotel(formData);
          toast.success("Hotel creado.");
        }
        onDone();
      } catch {
        toast.error("No se pudo guardar el hotel. Intentá de nuevo.");
      }
    });

  return (
    <form action={action} className="space-y-4">
      <FormField label="Nombre" htmlFor="nombre">
        <Input
          id="nombre"
          name="nombre"
          required
          defaultValue={hotel?.nombre}
          placeholder="Scala Hotel Buenos Aires"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Ciudad" htmlFor="ciudad">
          <Input
            id="ciudad"
            name="ciudad"
            required
            defaultValue={hotel?.ciudad}
            placeholder="CABA"
          />
        </FormField>
        <FormField label="Estrellas (opcional)" htmlFor="estrellas">
          <Select
            id="estrellas"
            name="estrellas"
            defaultValue={hotel?.estrellas ? String(hotel.estrellas) : ""}
          >
            <option value="">Sin especificar</option>
            <option value="3">3 estrellas</option>
            <option value="4">4 estrellas</option>
            <option value="5">5 estrellas</option>
          </Select>
        </FormField>
      </div>

      <FormField label="Dirección (opcional)" htmlFor="direccion">
        <Input
          id="direccion"
          name="direccion"
          defaultValue={hotel?.direccion}
          placeholder="Bernardo de Irigoyen 740 — CABA"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Teléfono (opcional)" htmlFor="telefono">
          <Input
            id="telefono"
            name="telefono"
            defaultValue={hotel?.telefono}
            placeholder="54 11 4343 0606"
          />
        </FormField>
        <FormField label="Sitio web (opcional)" htmlFor="web">
          <Input
            id="web"
            name="web"
            defaultValue={hotel?.web}
            placeholder="www.hotel.com"
          />
        </FormField>
      </div>

      <FormField label="Logo (opcional)" htmlFor="logoUrl-file">
        <FileOrLinkField
          name="logoUrl"
          value={logoUrl}
          onChange={setLogoUrl}
          accept="image/*"
          uploadLabel="Subir logo"
          linkPlaceholder="/assets/hoteles/hotel.png"
        />
      </FormField>

      <FormField label="Descuento" htmlFor="descuento">
        <Textarea
          id="descuento"
          name="descuento"
          required
          defaultValue={hotel?.descuento}
          placeholder="10% sobre tarifa pública"
        />
      </FormField>

      <FormField
        label="Beneficios adicionales (uno por línea, opcional)"
        htmlFor="beneficios"
      >
        <Textarea
          id="beneficios"
          name="beneficios"
          rows={4}
          defaultValue={hotel?.beneficios?.join("\n")}
          placeholder={"Wifi premium\nCancelaciones flexibles\nUpgrade sujeto a disponibilidad"}
        />
      </FormField>

      <FormField label="Reservas (opcional)" htmlFor="reservas">
        <Textarea
          id="reservas"
          name="reservas"
          defaultValue={hotel?.reservas}
          placeholder="reservas@hotel.com — Mencionar convenio CASC"
        />
      </FormField>

      <FormField label="Nota (opcional)" htmlFor="nota">
        <Input
          id="nota"
          name="nota"
          defaultValue={hotel?.nota}
          placeholder="Informar que se trata de un asociado de la CASC."
        />
      </FormField>

      <FormField label="Estado" htmlFor="status">
        <Select
          id="status"
          name="status"
          defaultValue={hotel?.status ?? "borrador"}
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
          {hotel ? "Guardar cambios" : "Crear hotel"}
        </Button>
      </div>
    </form>
  );
}
