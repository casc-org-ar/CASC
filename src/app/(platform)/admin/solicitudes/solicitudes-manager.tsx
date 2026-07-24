"use client";

import { useState, useTransition } from "react";
import { Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

type Tab = "solicitudes" | "consultas";
type Mensaje = SolicitudAsociacion | ConsultaContacto;

/** Who sent the message — the field differs between the two form types. */
function remitente(m: Mensaje): string {
  return "contacto" in m ? m.contacto : m.nombre;
}

/** Headline shown in the list: company when there is one, else the person. */
function titulo(m: Mensaje): string {
  if ("empresa" in m && m.empresa) return m.empresa;
  return remitente(m);
}

/** Inline control to move an enquiry through its handling states. */
function GestionSelect({
  value,
  onChange,
}: {
  value: GestionStatus;
  onChange: (next: GestionStatus) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as GestionStatus)}
      onClick={(e) => e.stopPropagation()}
      aria-label="Estado de gestión"
      className="h-9 rounded-md border border-border bg-white px-2 text-xs text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-accent/30"
    >
      {ORDEN.map((g) => (
        <option key={g} value={g}>
          {GESTION_LABEL[g]}
        </option>
      ))}
    </select>
  );
}

export function SolicitudesManager({
  solicitudes,
  consultas,
}: {
  solicitudes: SolicitudAsociacion[];
  consultas: ConsultaContacto[];
}) {
  const [tab, setTab] = useState<Tab>("solicitudes");
  const [detalle, setDetalle] = useState<Mensaje | null>(null);
  const [, startTransition] = useTransition();
  const toast = useToast();

  const cambiarGestion = (tipo: Tab, id: string, gestion: GestionStatus) =>
    startTransition(async () => {
      try {
        if (tipo === "solicitudes") await setSolicitudGestion(id, gestion);
        else await setConsultaGestion(id, gestion);
        toast.success("Estado actualizado.");
      } catch {
        toast.error("No se pudo actualizar el estado.");
      }
    });

  const eliminar = (tipo: Tab, m: Mensaje) => {
    if (!confirm(`¿Eliminar el mensaje de "${titulo(m)}"?`)) return;
    startTransition(async () => {
      try {
        if (tipo === "solicitudes") await deleteSolicitud(m.id);
        else await deleteConsulta(m.id);
        toast.success("Mensaje eliminado.");
      } catch {
        toast.error("No se pudo eliminar el mensaje.");
      }
    });
  };

  const items: Mensaje[] = tab === "solicitudes" ? solicitudes : consultas;
  const nuevasSolicitudes = solicitudes.filter(
    (s) => s.gestion === "nueva",
  ).length;
  const nuevasConsultas = consultas.filter((c) => c.gestion === "nueva").length;

  return (
    <>
      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
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

      {items.length === 0 ? (
        <EmptyState
          message={
            tab === "solicitudes"
              ? "Todavía no hay solicitudes de asociación."
              : "Todavía no hay consultas de contacto."
          }
        />
      ) : (
        /*
         * Inbox-style list rather than the generic admin table: the primary
         * action here is READING a message, so each row previews the text and
         * opens the full message on click — no ambiguous pencil icon.
         */
        <ul className="space-y-3">
          {items.map((m) => {
            const esNueva = m.gestion === "nueva";
            return (
              <li key={m.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setDetalle(m)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setDetalle(m);
                    }
                  }}
                  className={cn(
                    "group flex cursor-pointer flex-col gap-3 rounded-xl border bg-white p-4 text-left transition-all duration-200",
                    "hover:-translate-y-0.5 hover:border-accent/70",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    esNueva ? "border-primary/40" : "border-border",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-base font-bold text-ink">
                        {esNueva ? (
                          <Mail
                            className="h-4 w-4 shrink-0 text-primary"
                            aria-label="Sin leer"
                          />
                        ) : (
                          <MailOpen
                            className="h-4 w-4 shrink-0 text-ink-muted"
                            aria-hidden
                          />
                        )}
                        {titulo(m)}
                      </p>
                      <p className="mt-0.5 text-sm text-ink-muted">
                        {remitente(m)}
                        {"cargo" in m && m.cargo ? ` · ${m.cargo}` : ""}
                        {" · "}
                        {new Date(m.createdAt).toLocaleDateString("es-AR")}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {"sector" in m && <Badge tone="accent">{m.sector}</Badge>}
                      <Badge tone={GESTION_TONE[m.gestion]}>
                        {GESTION_LABEL[m.gestion]}
                      </Badge>
                    </div>
                  </div>

                  {/* The message itself — the whole point of the inbox. */}
                  {m.mensaje && (
                    <p className="line-clamp-2 text-sm leading-6 text-ink-muted">
                      {m.mensaje}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                    <span className="text-sm font-semibold text-primary group-hover:underline">
                      Ver mensaje completo
                    </span>
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GestionSelect
                        value={m.gestion}
                        onChange={(g) => cambiarGestion(tab, m.id, g)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminar(tab, m)}
                        aria-label={`Eliminar mensaje de ${titulo(m)}`}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Full message. Read-only: these records come from the public site. */}
      <Modal
        open={detalle !== null}
        onClose={() => setDetalle(null)}
        title={detalle ? titulo(detalle) : "Mensaje"}
        size="lg"
      >
        {detalle && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={GESTION_TONE[detalle.gestion]}>
                {GESTION_LABEL[detalle.gestion]}
              </Badge>
              {"sector" in detalle && (
                <Badge tone="accent">{detalle.sector}</Badge>
              )}
              <span className="text-xs text-ink-muted">
                {new Date(detalle.createdAt).toLocaleString("es-AR")}
              </span>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Contacto
                </dt>
                <dd className="text-sm text-ink">
                  {remitente(detalle)}
                  {"cargo" in detalle && detalle.cargo
                    ? ` · ${detalle.cargo}`
                    : ""}
                </dd>
              </div>
              {"empresa" in detalle && detalle.empresa && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Empresa
                  </dt>
                  <dd className="text-sm text-ink">{detalle.empresa}</dd>
                </div>
              )}
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
                <a
                  href={`tel:${detalle.telefono}`}
                  className="inline-flex items-center gap-2 text-ink-muted hover:text-ink"
                >
                  <Phone className="h-4 w-4 text-accent" aria-hidden />
                  {detalle.telefono}
                </a>
              )}
            </div>

            {detalle.mensaje ? (
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Mensaje
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">
                  {detalle.mensaje}
                </p>
              </div>
            ) : (
              <p className="text-sm italic text-ink-muted">
                Este envío no incluyó un mensaje.
              </p>
            )}

            <div className="flex justify-end border-t border-border pt-4">
              <a
                href={`mailto:${detalle.email}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Responder por email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
