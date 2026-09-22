"use client";

import { CheckCircle2, Plus, Send } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { Badge, InvitationBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { Socio, SocioCategoria } from "@/lib/types/domain";
import { SOCIO_CATEGORIAS } from "@/lib/types/domain";
import { deleteSocio, resendInvitation } from "./actions";
import { SocioForm } from "./socio-form";

/** Category → label, from the single list both the table and the form read. */
const CATEGORIA_LABEL = Object.fromEntries(
  SOCIO_CATEGORIAS.map((c) => [c.value, c.label]),
) as Record<SocioCategoria, string>;

/**
 * Case- and accent-insensitive form of a string, for searching.
 * Same shape as `normalizeText` in the public asociados directory: a search
 * that misses "Martín" because it was typed "martin" is one an admin stops
 * trusting after the first surprise.
 */
function normalizar(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/** Client manager: generic table + create/edit modal + delete, over the mock repo. */
export function SociosManager({ socios }: { socios: Socio[] }) {
  const [editing, setEditing] = useState<Socio | null>(null);
  const [creating, setCreating] = useState(false);
  const [shoppingFilter, setShoppingFilter] = useState("Todos");
  const [categoriaFilter, setCategoriaFilter] = useState<
    SocioCategoria | "Todas"
  >("Todas");
  const [query, setQuery] = useState("");
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
      header: "Empresa",
      cell: (s) => <span className="text-ink-muted">{s.shopping}</span>,
    },
    {
      header: "Tipo",
      cell: (s) => (
        <Badge tone={s.categoria === "shopping" ? "neutral" : "accent"}>
          {CATEGORIA_LABEL[s.categoria]}
        </Badge>
      ),
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
        /* The badge and the resend link stay side by side instead of the link
           dropping under it: with seven columns this cell is narrow enough to
           wrap, and a stray "Reenviar" below reads as a separate row. */
        <div className="flex items-center gap-2 whitespace-nowrap">
          <InvitationBadge status={s.invitacionStatus} />
          {s.invitacionStatus !== "aceptada" && (
            <button
              type="button"
              onClick={() => onResend(s)}
              disabled={pending}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary transition-colors hover:underline disabled:opacity-50"
            >
              <Send className="h-3 w-3" />
              Reenviar
            </button>
          )}
        </div>
      ),
    },
  ];

  /**
   * The three filters combine (AND), and the search runs over the fields an
   * admin actually looks someone up by: their name, their company, and their
   * email. Accent- and case-insensitive, because "Martín" typed as "martin"
   * should still find him — an exact-match search is one an admin quietly
   * stops trusting.
   */
  const visibles = useMemo(() => {
    const term = normalizar(query);
    return socios.filter((s) => {
      if (shoppingFilter !== "Todos" && s.shopping !== shoppingFilter) {
        return false;
      }
      if (categoriaFilter !== "Todas" && s.categoria !== categoriaFilter) {
        return false;
      }
      if (!term) return true;
      return [s.nombre, s.shopping, s.email].some((campo) =>
        normalizar(campo).includes(term),
      );
    });
  }, [socios, shoppingFilter, categoriaFilter, query]);

  /** True when anything is narrowing the list — drives the empty message. */
  const filtrando =
    shoppingFilter !== "Todos" || categoriaFilter !== "Todas" || query !== "";

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

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-1 basis-64 flex-col gap-1">
          <span className="text-xs font-medium text-ink-muted">Buscar</span>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Nombre, empresa o email"
          />
        </label>

        {/* Type of associate. Options come from the shared taxonomy, so a new
            category appears here without touching this file. */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-ink-muted">Tipo</span>
          <Select
            value={categoriaFilter}
            onChange={(e) =>
              setCategoriaFilter(e.target.value as SocioCategoria | "Todas")
            }
            className="min-w-44"
          >
            <option value="Todas">Todos los tipos</option>
            {SOCIO_CATEGORIAS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-ink-muted">Empresa</span>
          <Select
            value={shoppingFilter}
            onChange={(e) => setShoppingFilter(e.target.value)}
            className="min-w-56"
          >
            {shoppings.map((sh) => (
              <option key={sh} value={sh}>
                {sh === "Todos" ? "Todas las empresas" : sh}
              </option>
            ))}
          </Select>
        </label>

        <Button onClick={() => setCreating(true)} className="shrink-0">
          <Plus className="h-4 w-4" />
          Nuevo socio
        </Button>
      </div>

      {/* Result count. With three filters combining it stops being obvious how
          much of the list is showing, and "no results" is easier to read as a
          number than inferred from an empty table. */}
      {filtrando && (
        <p className="mb-3 text-sm text-ink-muted">
          {visibles.length} de {socios.length} socio
          {socios.length === 1 ? "" : "s"}
        </p>
      )}

      <DataTable
        rows={visibles}
        columns={columns}
        rowLabel={(s) => s.nombre}
        onEdit={setEditing}
        onDelete={onDelete}
        // Tells apart "nothing loaded" from "nothing matches": the first is a
        // state of the data, the second of the filters — and only the second
        // is fixed by clearing them.
        emptyMessage={
          filtrando
            ? "Ningún socio coincide con la búsqueda."
            : "Todavía no hay socios cargados."
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
