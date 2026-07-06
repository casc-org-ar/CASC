"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import type { Newsletter } from "@/lib/types/domain";
import { deleteNewsletter } from "./actions";
import { NewsletterForm } from "./newsletter-form";

const columns: Column<Newsletter>[] = [
  {
    header: "Edición",
    cell: (n) => <span className="font-medium text-ink">{n.edicion}</span>,
  },
  { header: "Título", cell: (n) => <span className="text-ink-muted">{n.titulo}</span> },
  {
    header: "Fecha",
    cell: (n) => (
      <span className="text-ink-muted">
        {new Date(n.fecha).toLocaleDateString("es-AR")}
      </span>
    ),
  },
  { header: "Estado", cell: (n) => <StatusBadge status={n.status} /> },
];

/** Client manager: generic table + create/edit modal + delete, over the mock repo. */
export function NewsletterManager({
  newsletters,
}: {
  newsletters: Newsletter[];
}) {
  const [editing, setEditing] = useState<Newsletter | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const onDelete = (n: Newsletter) => {
    if (!confirm(`¿Eliminar la edición "${n.edicion}"?`)) return;
    startTransition(() => void deleteNewsletter(n.id));
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Nueva edición
        </Button>
      </div>

      <DataTable
        rows={newsletters}
        columns={columns}
        rowLabel={(n) => n.edicion}
        onEdit={setEditing}
        onDelete={onDelete}
        emptyMessage="Todavía no hay ediciones cargadas."
      />

      <Modal
        open={creating || editing !== null}
        onClose={closeModal}
        title={editing ? "Editar edición" : "Nueva edición"}
      >
        <NewsletterForm
          newsletter={editing ?? undefined}
          onDone={closeModal}
        />
      </Modal>
    </>
  );
}
