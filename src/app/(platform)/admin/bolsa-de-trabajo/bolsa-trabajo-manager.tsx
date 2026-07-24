"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { Candidato } from "@/lib/types/domain";
import {
  deleteCandidato,
  setCandidatoStatus,
} from "./actions";
import { CandidatoForm } from "./candidato-form";

/** Admin table for candidate moderation: publish/unpublish, edit, delete. */
export function BolsaTrabajoManager({
  candidatos,
}: {
  candidatos: Candidato[];
}) {
  const [editing, setEditing] = useState<Candidato | null>(null);
  const [, startTransition] = useTransition();
  const toast = useToast();

  const toggleStatus = (c: Candidato) => {
    const next = c.status === "publicado" ? "borrador" : "publicado";
    startTransition(async () => {
      try {
        await setCandidatoStatus(c.id, next);
        toast.success(
          next === "publicado"
            ? "Candidato publicado."
            : "Candidato ocultado.",
        );
      } catch {
        toast.error("No se pudo actualizar el estado.");
      }
    });
  };

  const onDelete = (c: Candidato) => {
    if (!confirm(`¿Eliminar el perfil de "${c.nombre}"?`)) return;
    startTransition(async () => {
      try {
        await deleteCandidato(c.id);
        toast.success("Candidato eliminado.");
      } catch {
        toast.error("No se pudo eliminar el candidato.");
      }
    });
  };

  const columns: Column<Candidato>[] = [
    {
      header: "Candidato",
      cell: (c) => <span className="font-medium text-ink">{c.nombre}</span>,
    },
    {
      header: "Puesto",
      cell: (c) => <span className="text-ink-muted">{c.puestoBuscado}</span>,
    },
    {
      header: "Área",
      cell: (c) => <span className="text-ink-muted">{c.areaInteres}</span>,
    },
    { header: "Estado", cell: (c) => <StatusBadge status={c.status} /> },
    {
      header: "Moderar",
      cell: (c) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => toggleStatus(c)}
        >
          {c.status === "publicado" ? (
            <>
              <EyeOff className="h-4 w-4" />
              Ocultar
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Publicar
            </>
          )}
        </Button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        rows={candidatos}
        columns={columns}
        rowLabel={(c) => c.nombre}
        onEdit={setEditing}
        onDelete={onDelete}
        emptyMessage="Todavía no hay candidatos cargados."
      />

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Editar candidato"
        size="lg"
      >
        {editing && (
          <CandidatoForm
            candidato={editing}
            onDone={() => setEditing(null)}
          />
        )}
      </Modal>
    </>
  );
}
