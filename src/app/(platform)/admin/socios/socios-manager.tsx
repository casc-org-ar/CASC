"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { Socio } from "@/lib/types/domain";
import { deleteSocio } from "./actions";
import { SocioForm } from "./socio-form";

const columns: Column<Socio>[] = [
  {
    header: "Nombre",
    cell: (s) => <span className="font-medium text-ink">{s.nombre}</span>,
  },
  { header: "Shopping", cell: (s) => <span className="text-ink-muted">{s.shopping}</span> },
  { header: "Email", cell: (s) => <span className="text-ink-muted">{s.email}</span> },
  {
    header: "Rol",
    cell: (s) => (
      <Badge tone={s.role === "admin" ? "accent" : "neutral"}>
        {s.role === "admin" ? "Admin" : "Socio"}
      </Badge>
    ),
  },
  { header: "Estado", cell: (s) => <StatusBadge status={s.estado} /> },
];

/** Client manager: generic table + create/edit modal + delete, over the mock repo. */
export function SociosManager({ socios }: { socios: Socio[] }) {
  const [editing, setEditing] = useState<Socio | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const onDelete = (s: Socio) => {
    if (!confirm(`¿Dar de baja a "${s.nombre}"?`)) return;
    startTransition(() => void deleteSocio(s.id));
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Nuevo socio
        </Button>
      </div>

      <DataTable
        rows={socios}
        columns={columns}
        rowLabel={(s) => s.nombre}
        onEdit={setEditing}
        onDelete={onDelete}
        emptyMessage="Todavía no hay socios cargados."
      />

      <Modal
        open={creating || editing !== null}
        onClose={closeModal}
        title={editing ? "Editar socio" : "Nuevo socio"}
      >
        <SocioForm socio={editing ?? undefined} onDone={closeModal} />
      </Modal>
    </>
  );
}
