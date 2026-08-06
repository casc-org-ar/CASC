"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { Actividad } from "@/lib/types/domain";
import { deleteActividad } from "./actions";
import { ActividadForm } from "./actividad-form";

const columns: Column<Actividad>[] = [
  {
    header: "Título",
    cell: (a) => <span className="font-medium text-ink">{a.titulo}</span>,
  },
  {
    header: "Fecha",
    cell: (a) => <span className="text-ink-muted">{a.fecha ?? "—"}</span>,
  },
  {
    header: "Lugar",
    cell: (a) => <span className="text-ink-muted">{a.lugar ?? "—"}</span>,
  },
  { header: "Estado", cell: (a) => <StatusBadge status={a.status} /> },
];

/** Client manager: generic table + create/edit modal + delete. */
export function ActividadesManager({
  actividades,
}: {
  actividades: Actividad[];
}) {
  const [editing, setEditing] = useState<Actividad | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();
  const toast = useToast();

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const onDelete = (a: Actividad) => {
    if (!confirm(`¿Eliminar "${a.titulo}"?`)) return;
    startTransition(async () => {
      try {
        await deleteActividad(a.id);
        toast.success("Actividad eliminada.");
      } catch {
        toast.error("No se pudo eliminar la actividad.");
      }
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Nueva actividad
        </Button>
      </div>

      <DataTable
        rows={actividades}
        columns={columns}
        rowLabel={(a) => a.titulo}
        onEdit={setEditing}
        onDelete={onDelete}
        emptyMessage="Todavía no hay actividades cargadas."
      />

      <Modal
        open={creating || editing !== null}
        onClose={closeModal}
        title={editing ? "Editar actividad" : "Nueva actividad"}
        size="lg"
      >
        <ActividadForm actividad={editing ?? undefined} onDone={closeModal} />
      </Modal>
    </>
  );
}
