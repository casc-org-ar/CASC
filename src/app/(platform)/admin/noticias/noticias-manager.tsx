"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { Noticia } from "@/lib/types/domain";
import { deleteNoticia } from "./actions";
import { NoticiaForm } from "./noticia-form";

const columns: Column<Noticia>[] = [
  {
    header: "Título",
    cell: (n) => <span className="font-medium text-ink">{n.titulo}</span>,
  },
  {
    header: "Bajada",
    cell: (n) => (
      <span className="line-clamp-1 max-w-md text-ink-muted">{n.bajada}</span>
    ),
  },
  {
    header: "Categoría",
    cell: (n) =>
      n.categoria ? (
        <span className="text-ink-muted">{n.categoria}</span>
      ) : (
        <span className="text-ink-muted/50">—</span>
      ),
  },
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
export function NoticiasManager({ noticias }: { noticias: Noticia[] }) {
  const [editing, setEditing] = useState<Noticia | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();
  const toast = useToast();

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const onDelete = (n: Noticia) => {
    if (!confirm(`¿Eliminar "${n.titulo}"?`)) return;
    startTransition(async () => {
      try {
        await deleteNoticia(n.id);
        toast.success("Noticia eliminada.");
      } catch {
        toast.error("No se pudo eliminar la noticia.");
      }
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Nueva noticia
        </Button>
      </div>

      <DataTable
        rows={noticias}
        columns={columns}
        rowLabel={(n) => n.titulo}
        onEdit={setEditing}
        onDelete={onDelete}
        emptyMessage="Todavía no hay noticias cargadas."
      />

      <Modal
        open={creating || editing !== null}
        onClose={closeModal}
        title={editing ? "Editar noticia" : "Nueva noticia"}
        size="lg"
      >
        <NoticiaForm noticia={editing ?? undefined} onDone={closeModal} />
      </Modal>
    </>
  );
}
