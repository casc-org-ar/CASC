"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { Hotel } from "@/lib/types/domain";
import { deleteHotel } from "./actions";
import { HotelForm } from "./hotel-form";

const columns: Column<Hotel>[] = [
  {
    header: "Hotel",
    cell: (h) => <span className="font-medium text-ink">{h.nombre}</span>,
  },
  {
    header: "Ciudad",
    cell: (h) => <span className="text-ink-muted">{h.ciudad}</span>,
  },
  {
    header: "Descuento",
    cell: (h) => (
      <span className="line-clamp-1 text-ink-muted">{h.descuento}</span>
    ),
  },
  { header: "Estado", cell: (h) => <StatusBadge status={h.status} /> },
];

/** Client manager: generic table + create/edit modal + delete, over the mock repo. */
export function BeneficiosManager({ hoteles }: { hoteles: Hotel[] }) {
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();
  const toast = useToast();

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const onDelete = (h: Hotel) => {
    if (!confirm(`¿Eliminar "${h.nombre}"?`)) return;
    startTransition(async () => {
      try {
        await deleteHotel(h.id);
        toast.success("Hotel eliminado.");
      } catch {
        toast.error("No se pudo eliminar el hotel.");
      }
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Nuevo hotel
        </Button>
      </div>

      <DataTable
        rows={hoteles}
        columns={columns}
        rowLabel={(h) => h.nombre}
        onEdit={setEditing}
        onDelete={onDelete}
        emptyMessage="Todavía no hay hoteles cargados."
      />

      <Modal
        open={creating || editing !== null}
        onClose={closeModal}
        title={editing ? "Editar hotel" : "Nuevo hotel"}
        size="lg"
      >
        <HotelForm hotel={editing ?? undefined} onDone={closeModal} />
      </Modal>
    </>
  );
}
