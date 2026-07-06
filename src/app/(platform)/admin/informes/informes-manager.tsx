"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import type { Informe } from "@/lib/types/domain";
import { deleteInforme } from "./actions";
import { InformeForm } from "./informe-form";

const columns: Column<Informe>[] = [
  {
    header: "Título",
    cell: (i) => <span className="font-medium text-ink">{i.titulo}</span>,
  },
  { header: "Categoría", cell: (i) => <span className="text-ink-muted">{i.categoria}</span> },
  {
    header: "Fecha",
    cell: (i) => (
      <span className="text-ink-muted">
        {new Date(i.fecha).toLocaleDateString("es-AR")}
      </span>
    ),
  },
  { header: "Estado", cell: (i) => <StatusBadge status={i.status} /> },
];

/** Client manager: generic table + create/edit modal + delete, over the mock repo. */
export function InformesManager({ informes }: { informes: Informe[] }) {
  const [editing, setEditing] = useState<Informe | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const onDelete = (i: Informe) => {
    if (!confirm(`¿Eliminar "${i.titulo}"?`)) return;
    startTransition(() => void deleteInforme(i.id));
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Nuevo informe
        </Button>
      </div>

      <DataTable
        rows={informes}
        columns={columns}
        rowLabel={(i) => i.titulo}
        onEdit={setEditing}
        onDelete={onDelete}
        emptyMessage="Todavía no hay informes cargados."
      />

      <Modal
        open={creating || editing !== null}
        onClose={closeModal}
        title={editing ? "Editar informe" : "Nuevo informe"}
      >
        <InformeForm informe={editing ?? undefined} onDone={closeModal} />
      </Modal>
    </>
  );
}
