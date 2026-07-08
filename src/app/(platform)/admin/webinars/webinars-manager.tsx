"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { Webinar } from "@/lib/types/domain";
import { deleteWebinar } from "./actions";
import { WebinarForm } from "./webinar-form";

const columns: Column<Webinar>[] = [
  {
    header: "Título",
    cell: (w) => <span className="font-medium text-ink">{w.titulo}</span>,
  },
  { header: "Categoría", cell: (w) => <span className="text-ink-muted">{w.categoria}</span> },
  {
    header: "Fecha",
    cell: (w) => (
      <span className="text-ink-muted">
        {new Date(w.fecha).toLocaleDateString("es-AR")}
      </span>
    ),
  },
  { header: "Estado", cell: (w) => <StatusBadge status={w.status} /> },
];

/** Client manager: generic table + create/edit modal + delete, over the mock repo. */
export function WebinarsManager({ webinars }: { webinars: Webinar[] }) {
  const [editing, setEditing] = useState<Webinar | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();
  const toast = useToast();

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const onDelete = (w: Webinar) => {
    if (!confirm(`¿Eliminar "${w.titulo}"?`)) return;
    startTransition(async () => {
      try {
        await deleteWebinar(w.id);
        toast.success("Webinar eliminado.");
      } catch {
        toast.error("No se pudo eliminar el webinar.");
      }
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Nuevo webinar
        </Button>
      </div>

      <DataTable
        rows={webinars}
        columns={columns}
        rowLabel={(w) => w.titulo}
        onEdit={setEditing}
        onDelete={onDelete}
        emptyMessage="Todavía no hay webinars cargados."
      />

      <Modal
        open={creating || editing !== null}
        onClose={closeModal}
        title={editing ? "Editar webinar" : "Nuevo webinar"}
        size="lg"
      >
        <WebinarForm webinar={editing ?? undefined} onDone={closeModal} />
      </Modal>
    </>
  );
}
