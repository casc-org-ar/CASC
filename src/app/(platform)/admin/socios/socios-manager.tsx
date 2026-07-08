"use client";

import { CheckCircle2, Plus, Send } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge, InvitationBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { Socio } from "@/lib/types/domain";
import { deleteSocio, resendInvitation } from "./actions";
import { SocioForm } from "./socio-form";

/** Client manager: generic table + create/edit modal + delete, over the mock repo. */
export function SociosManager({ socios }: { socios: Socio[] }) {
  const [editing, setEditing] = useState<Socio | null>(null);
  const [creating, setCreating] = useState(false);
  const [shoppingFilter, setShoppingFilter] = useState("Todos");
  // Admin notification: set after an alta or a resend so the admin sees the
  // invitation went out (and where to check for it).
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  // Shopping options are derived from the data itself, so a newly added
  // shopping shows up in the filter automatically — no manual categories.
  const shoppings = useMemo(
    () =>
      ["Todos", ...Array.from(new Set(socios.map((s) => s.shopping)))].sort(
        (a, b) => (a === "Todos" ? -1 : b === "Todos" ? 1 : a.localeCompare(b)),
      ),
    [socios],
  );

  const columns: Column<Socio>[] = [
    {
      header: "Nombre",
      cell: (s) => <span className="font-medium text-ink">{s.nombre}</span>,
    },
    {
      header: "Shopping",
      cell: (s) => <span className="text-ink-muted">{s.shopping}</span>,
    },
    {
      header: "Email",
      cell: (s) => <span className="text-ink-muted">{s.email}</span>,
    },
    {
      header: "Rol",
      cell: (s) => (
        <Badge tone={s.role === "admin" ? "accent" : "neutral"}>
          {s.role === "admin" ? "Admin" : "Socio"}
        </Badge>
      ),
    },
    { header: "Estado", cell: (s) => <StatusBadge status={s.estado} /> },
    {
      header: "Invitación",
      cell: (s) => (
        <div className="flex items-center gap-2">
          <InvitationBadge status={s.invitacionStatus} />
          {s.invitacionStatus !== "aceptada" && (
            <button
              type="button"
              onClick={() => onResend(s)}
              disabled={pending}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:underline disabled:opacity-50"
            >
              <Send className="h-3 w-3" />
              Reenviar
            </button>
          )}
        </div>
      ),
    },
  ];

  const visibles =
    shoppingFilter === "Todos"
      ? socios
      : socios.filter((s) => s.shopping === shoppingFilter);

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const onDelete = (s: Socio) => {
    if (!confirm(`¿Dar de baja a "${s.nombre}"?`)) return;
    startTransition(async () => {
      try {
        await deleteSocio(s.id);
        toast.success("Socio dado de baja.");
      } catch {
        toast.error("No se pudo dar de baja al socio.");
      }
    });
  };

  const onResend = (s: Socio) => {
    startTransition(async () => {
      try {
        const result = await resendInvitation(s.id);
        if (result.invitacionEnviada) {
          setNotice(
            `Se reenvió la invitación a ${result.email}. Pedile al socio que revise su bandeja de entrada o la carpeta de spam.`,
          );
        }
      } catch {
        toast.error("No se pudo reenviar la invitación.");
      }
    });
  };

  return (
    <>
      {notice && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-casc-navy-700" />
          <p className="flex-1 text-sm text-ink">{notice}</p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            aria-label="Cerrar notificación"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-ink-muted">
            Filtrar por shopping
          </span>
          <Select
            value={shoppingFilter}
            onChange={(e) => setShoppingFilter(e.target.value)}
            className="min-w-56"
          >
            {shoppings.map((sh) => (
              <option key={sh} value={sh}>
                {sh === "Todos" ? "Todos los shoppings" : sh}
              </option>
            ))}
          </Select>
        </label>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Nuevo socio
        </Button>
      </div>

      <DataTable
        rows={visibles}
        columns={columns}
        rowLabel={(s) => s.nombre}
        onEdit={setEditing}
        onDelete={onDelete}
        emptyMessage={
          shoppingFilter === "Todos"
            ? "Todavía no hay socios cargados."
            : `No hay socios en ${shoppingFilter}.`
        }
      />

      <Modal
        open={creating || editing !== null}
        onClose={closeModal}
        title={editing ? "Editar socio" : "Nuevo socio"}
      >
        <SocioForm
          socio={editing ?? undefined}
          onDone={closeModal}
          onAlta={(email) =>
            setNotice(
              `Se dio de alta al socio y se envió la invitación a ${email}. Pedile que revise su bandeja de entrada o la carpeta de spam para completar el registro.`,
            )
          }
        />
      </Modal>
    </>
  );
}
