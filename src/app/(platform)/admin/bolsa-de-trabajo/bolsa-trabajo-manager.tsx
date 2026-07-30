"use client";

import { useState, useTransition } from "react";
import { Download, Eye, EyeOff, FileDown } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { Candidato } from "@/lib/types/domain";
import { getCvUrl } from "@/lib/actions/cv-download";
import { downloadFile, toCsv } from "@/lib/utils/csv-export";
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

  const openCv = (c: Candidato) => {
    startTransition(async () => {
      const url = await getCvUrl(c.cvUrl);
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        toast.error("No pudimos abrir el CV.");
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
    {
      // The CV is what the admin needs to actually judge a candidate before
      // publishing them, so it sits right before the moderation controls.
      header: "CV",
      cell: (c) =>
        c.cvUrl ? (
          <button
            type="button"
            onClick={() => openCv(c)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            aria-label={`Ver CV de ${c.nombre}`}
          >
            <FileDown className="h-4 w-4" aria-hidden />
            Ver CV
          </button>
        ) : (
          <span className="text-sm text-ink-muted">—</span>
        ),
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

  /**
   * Export ALL candidates to CSV with every field, so the CASC team can manage
   * the pool in Excel / Google Sheets. Runs client-side over the loaded rows.
   */
  const exportarCsv = () => {
    const disponibilidadLabel: Record<string, string> = {
      "full-time": "Full-time",
      "part-time": "Part-time",
      ambas: "Full o part-time",
    };
    const csv = toCsv(candidatos, [
      { header: "Nombre", value: (c) => c.nombre },
      { header: "Email", value: (c) => c.email },
      { header: "Teléfono", value: (c) => c.telefono },
      { header: "Puesto buscado", value: (c) => c.puestoBuscado },
      { header: "Área de interés", value: (c) => c.areaInteres },
      { header: "Habilidades", value: (c) => c.skills },
      { header: "Años de experiencia", value: (c) => c.aniosExperiencia },
      { header: "Nivel educativo", value: (c) => c.nivelEducativo },
      {
        header: "Disponibilidad",
        value: (c) =>
          c.disponibilidad ? disponibilidadLabel[c.disponibilidad] : "",
      },
      { header: "Ciudad", value: (c) => c.ciudad },
      { header: "Provincia", value: (c) => c.provincia },
      {
        header: "Estado",
        value: (c) => (c.status === "publicado" ? "Aprobado" : "Pendiente"),
      },
      { header: "Fecha de carga", value: (c) => c.createdAt?.slice(0, 10) },
    ]);
    const fecha = new Date().toISOString().slice(0, 10);
    downloadFile(csv, `candidatos-casc-${fecha}.csv`);
    toast.success("CSV descargado.");
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          {candidatos.length} candidato{candidatos.length === 1 ? "" : "s"}
        </p>
        <Button
          variant="secondary"
          onClick={exportarCsv}
          disabled={candidatos.length === 0}
        >
          <Download className="h-4 w-4" />
          Descargar CSV
        </Button>
      </div>

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
