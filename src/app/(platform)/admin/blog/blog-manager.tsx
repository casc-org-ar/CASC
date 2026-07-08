"use client";

import { Eye, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { BlogPost } from "@/lib/types/domain";
import { deleteBlogPost } from "./actions";
import { BlogForm } from "./blog-form";
import { BlogPreview } from "./blog-preview";

const columns: Column<BlogPost>[] = [
  {
    header: "Título",
    cell: (p) => <span className="font-medium text-ink">{p.titulo}</span>,
  },
  {
    header: "Autor",
    cell: (p) => <span className="text-ink-muted">{p.autor}</span>,
  },
  {
    header: "Tags",
    cell: (p) => (
      <div className="flex flex-wrap gap-1">
        {p.tags.slice(0, 2).map((t) => (
          <Badge key={t} tone="muted">
            {t}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    header: "Fecha",
    cell: (p) => (
      <span className="text-ink-muted">
        {new Date(p.fecha).toLocaleDateString("es-AR")}
      </span>
    ),
  },
  { header: "Estado", cell: (p) => <StatusBadge status={p.status} /> },
];

/** Client manager: generic table + create/edit modal + delete, over the mock repo. */
export function BlogManager({ posts }: { posts: BlogPost[] }) {
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [previewing, setPreviewing] = useState<BlogPost | null>(null);
  const [, startTransition] = useTransition();
  const toast = useToast();

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const onDelete = (p: BlogPost) => {
    if (!confirm(`¿Eliminar "${p.titulo}"?`)) return;
    startTransition(async () => {
      try {
        await deleteBlogPost(p.id);
        toast.success("Artículo eliminado.");
      } catch {
        toast.error("No se pudo eliminar el artículo.");
      }
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Nuevo artículo
        </Button>
      </div>

      <DataTable
        rows={posts}
        columns={columns}
        rowLabel={(p) => p.titulo}
        onEdit={setEditing}
        onDelete={onDelete}
        emptyMessage="Todavía no hay artículos de blog."
        extraActions={[
          {
            icon: <Eye className="h-4 w-4" />,
            label: (p) => `Previsualizar ${p.titulo}`,
            onClick: setPreviewing,
          },
        ]}
      />

      <Modal
        open={creating || editing !== null}
        onClose={closeModal}
        title={editing ? "Editar artículo" : "Nuevo artículo"}
        size="xl"
      >
        <BlogForm post={editing ?? undefined} onDone={closeModal} />
      </Modal>

      <Modal
        open={previewing !== null}
        onClose={() => setPreviewing(null)}
        title="Vista previa del artículo"
        size="xl"
      >
        {previewing && (
          <BlogPreview
            draft={{
              titulo: previewing.titulo,
              bajada: previewing.bajada,
              cuerpo: previewing.cuerpo,
              autor: previewing.autor,
              fecha: previewing.fecha.slice(0, 10),
            }}
            portadaUrl={previewing.portadaUrl}
            imagenes={previewing.imagenes ?? []}
            onBack={() => setPreviewing(null)}
          />
        )}
      </Modal>
    </>
  );
}
