"use client";

import { useState, useTransition } from "react";
import { Mail, Phone } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type {
  ConsultaContacto,
  GestionStatus,
  SolicitudAsociacion,
} from "@/lib/types/domain";
import {
  deleteConsulta,
  deleteSolicitud,
  setConsultaGestion,
  setSolicitudGestion,
} from "./actions";

const GESTION_LABEL: Record<GestionStatus, string> = {
  nueva: "Nueva",
  "en-proceso": "En proceso",
  resuelta: "Resuelta",
};

const GESTION_TONE: Record<GestionStatus, "accent" | "neutral" | "success"> = {
  nueva: "accent",
  "en-proceso": "neutral",
  resuelta: "success",
};

const ORDEN: GestionStatus[] = ["nueva", "en-proceso", "resuelta"];

/** Inline control to move an enquiry through its handling states. */
function GestionSelect({
  value,
  onChange,
  disabled,
}: {
  value: GestionStatus;
  onChange: (next: GestionStatus) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as GestionStatus)}
      className="h-9 rounded-md border border-border bg-white px-2 text-xs text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
    >
      {ORDEN.map((g) => (
        <option key={g} value={g}>
          {GESTION_LABEL[g]}
        </option>
      ))}
    </select>
  );
}

type Tab = "solicitudes" | "consultas";

export function SolicitudesManager({
  solicitudes,
  consultas,
}: {
  solicitudes: SolicitudAsociacion[];
  consultas: ConsultaContacto[];
}) {
  const [tab, setTab] = useState<Tab>("solicitudes");
  const [detalle, setDetalle] = useState<
    SolicitudAsociacion | ConsultaContacto | null
  >(null);
  const [, startTransition] = useTransition();
  const toast = useToast();

  const cambiarGestion = (
    tipo: Tab,
    id: string,
    gestion: GestionStatus,
  ) =>
    startTransition(async () => {
      try {
        if (tipo === "solicitudes") await setSolicitudGestion(id, gestion);
        else await setConsultaGestion(id, gestion);
        toast.success("Estado actualizado.");
      } catch {
        toast.error("No se pudo actualizar el estado.");
      }
    });

  const eliminar = (tipo: Tab, id: string, nombre: string) => {
    if (!confirm(`¿Eliminar el mensaje de "${nombre}"?`)) return;
    startTransition(async () => {
      try {
        if (tipo === "solicitudes") await deleteSolicitud(id);
        else await deleteConsulta(id);
        toast.success("Mensaje eliminado.");
      } catch {
        toast.error("No se pudo eliminar el mensaje.");
      }
    });
  };

  const solicitudColumns: Column<SolicitudAsociacion>[] = [
    {
      header: "Empresa",
      cell: (s) => <span className="font-medium text-ink">{s.empresa}</span>,
    },
    { header: "Sector", cell: (s) => <Badge tone="accent">{s.sector}</Badge> },
    {
      header: "Contacto",
      cell: (s) => (
        <span className="text-ink-muted">
          {s.contacto}
          {s.cargo ? ` · ${s.cargo}` : ""}
        </span>
      ),
    },
    {
      header: "Recibida",
      cell: (s) => (
        <span className="text-ink-muted">
          {new Date(s.createdAt).toLocaleDateString("es-AR")}
        </span>
      ),
    },
    {
      header: "Estado",
      cell: (s) => (
        <GestionSelect
          value={s.gestion}
          onChange={(g) => cambiarGestion("solicitudes", s.id, g)}
        />
      ),
    },
  ];

  const consultaColumns: Column<ConsultaContacto>[] = [
    {
      header: "Nombre",
      cell: (c) => <span className="font-medium text-ink">{c.nombre}</span>,
    },
    {
      header: "Empresa",
      cell: (c) => <span className="text-ink-muted">{c.empresa ?? "—"}</span>,
    },
    {
      header: "Recibida",
      cell: (c) => (
        <span className="text-ink-muted">
          {new Date(c.createdAt).toLocaleDateString("es-AR")}
        </span>
      ),
    },
    {
      header: "Estado",
      cell: (c) => (
        <GestionSelect
          value={c.gestion}
          onChange={(g) => cambiarGestion("consultas", c.id, g)}
        />
      ),
    },
  ];

  const nuevasSolicitudes = solicitudes.filter(
    (s) => s.gestion === "nueva",
  ).length;
  const nuevasConsultas = consultas.filter((c) => c.gestion === "nueva").length;

  return (
    <>
      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {(
          [
            ["solicitudes", "Solicitudes de asociación", nuevasSolicitudes],
            ["consultas", "Consultas de contacto", nuevasConsultas],
          ] as const
        ).map(([value, label, nuevas]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              tab === value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-white text-ink-muted hover:border-accent/70",
            )}
          >
            {label}
            {nuevas > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                {nuevas}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "solicitudes" ? (
        <DataTable
          rows={solicitudes}
          columns={solicitudColumns}
          rowLabel={(s) => s.empresa}
          onEdit={setDetalle}
          onDelete={(s) => eliminar("solicitudes", s.id, s.empresa)}
          emptyMessage="Todavía no hay solicitudes de asociación."
        />
      ) : (
        <DataTable
          rows={consultas}
          columns={consultaColumns}
          rowLabel={(c) => c.nombre}
          onEdit={setDetalle}
          onDelete={(c) => eliminar("consultas", c.id, c.nombre)}
          emptyMessage="Todavía no hay consultas de contacto."
        />
      )}

      {/* Detail modal — read-only: these records come from the public site. */}
      <Modal
        open={detalle !== null}
        onClose={() => setDetalle(null)}
        title="Detalle del mensaje"
        size="lg"
      >
        {detalle && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={GESTION_TONE[detalle.gestion]}>
                {GESTION_LABEL[detalle.gestion]}
              </Badge>
              <span className="text-xs text-ink-muted">
                {new Date(detalle.createdAt).toLocaleString("es-AR")}
              </span>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              {"empresa" in detalle && detalle.empresa && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Empresa
                  </dt>
                  <dd className="text-sm text-ink">{detalle.empresa}</dd>
                </div>
              )}
              {"sector" in detalle && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Sector
                  </dt>
                  <dd className="text-sm text-ink">{detalle.sector}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Contacto
                </dt>
                <dd className="text-sm text-ink">
                  {"contacto" in detalle ? detalle.contacto : detalle.nombre}
                  {"cargo" in detalle && detalle.cargo
                    ? ` · ${detalle.cargo}`
                    : ""}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-4 border-t border-border pt-4 text-sm">
              <a
                href={`mailto:${detalle.email}`}
                className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {detalle.email}
              </a>
              {"telefono" in detalle && detalle.telefono && (
                <span className="inline-flex items-center gap-2 text-ink-muted">
                  <Phone className="h-4 w-4 text-accent" aria-hidden />
                  {detalle.telefono}
                </span>
              )}
            </div>

            {detalle.mensaje && (
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Mensaje
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">
                  {detalle.mensaje}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
