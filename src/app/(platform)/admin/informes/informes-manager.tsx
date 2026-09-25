"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { SOCIO_CATEGORIAS, type Informe } from "@/lib/types/domain";
import { deleteInforme } from "./actions";
import { InformeForm } from "./informe-form";
import { formatDate } from "@/lib/utils";

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
        {formatDate(i.fecha)}
      </span>
    ),
  },
  {
    header: "Lo ven",
    // At a glance, without opening each report: with an audience per report,
    // the one thing the table cannot leave unanswered is who sees what.
    cell: (i) =>
      i.categorias.length === 0 ? (
        <Badge tone="muted">Nadie</Badge>
      ) : i.categorias.length === SOCIO_CATEGORIAS.length ? (
        <Badge tone="neutral">Todos</Badge>
      ) : (
        <div className="flex flex-wrap gap-1">
          {SOCIO_CATEGORIAS.filter((c) => i.categorias.includes(c.value)).map(
            (c) => (
              <Badge key={c.value} tone="accent">
                {c.label}
              </Badge>
            ),
          )}
        </div>
      ),
  },
  { header: "Estado", cell: (i) => <StatusBadge status={i.status} /> },
];

/** Client manager: generic table + create/edit modal + delete, over the mock repo. */
export function InformesManager({ informes }: { informes: Informe[] }) {
  const [editing, setEditing] = useState<Informe | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();
  const toast = useToast();

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const onDelete = (i: Informe) => {
    if (!confirm(`¿Eliminar "${i.titulo}"?`)) return;
    startTransition(async () => {
      try {
        await deleteInforme(i.id);
        toast.success("Informe eliminado.");
      } catch {
        toast.error("No se pudo eliminar el informe.");
      }
    });
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
        size="lg"
      >
        <InformeForm informe={editing ?? undefined} onDone={closeModal} />
      </Modal>
    </>
  );
}
